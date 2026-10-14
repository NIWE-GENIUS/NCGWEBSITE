// backend/src/services/authService.js
const db = require('../database');
const { hashPassword, verifyPassword } = require('../utils/password');
const { signAccessToken, signRefreshToken } = require('../utils/jwt');
const { generateToken, expiresIn } = require('../utils/tokens');
const { sendEmail } = require('../utils/email');
const templates = require('../utils/email/authTemplates');
const {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../utils/errors');
const logger = require('../utils/logger');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ============================================================
// REGISTER
// ============================================================
async function register({ firstName, lastName, email, phone, password, role = 'guest', newsletter }) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      throw new ConflictError('An account with this email already exists');
    }

    const passwordHash = await hashPassword(password);

    const userResult = await client.query(
      `INSERT INTO users (email, phone, password_hash, first_name, last_name, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, email, first_name, last_name, role, status, created_at`,
      [email, phone || null, passwordHash, firstName, lastName, role]
    );
    const user = userResult.rows[0];

    await client.query(
      `INSERT INTO profiles (user_id, headline, location, country, city)
       VALUES ($1, $2, 'Kigali', 'Rwanda', 'Kigali')`,
      [user.id, `${role.charAt(0).toUpperCase() + role.slice(1)} at NCG`]
    );

    await client.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE name = $2`,
      [user.id, role]
    );

    const verificationToken = generateToken(32);
    await client.query(
      `INSERT INTO verifications (user_id, type, token, expires_at)
       VALUES ($1, 'email', $2, $3)`,
      [user.id, verificationToken, expiresIn(24, 'hours')]
    );

    await client.query('COMMIT');

    // Subscribe to newsletter if opted in
    if (newsletter) {
      await db.query(
        `INSERT INTO newsletter_subscribers (email, name, source, confirmed, created_at)
         VALUES ($1, $2, 'registration', TRUE, NOW())
         ON CONFLICT (email) DO UPDATE SET confirmed = TRUE, unsubscribed_at = NULL, updated_at = NOW()`,
        [email, `${firstName} ${lastName}`]
      ).catch(() => {});
    }

    // Send welcome + verification email
    const verificationUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
    sendEmail({
      to: email,
      subject: 'Welcome to NCG — Verify your email',
      html: templates.verificationEmail({ firstName, verificationUrl }),
    }).catch((err) => logger.error('Welcome email failed', { error: err.message }));

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await db.query(
      `INSERT INTO sessions (user_id, token, refresh_token, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [user.id, accessToken, refreshToken, expiresIn(30, 'days')]
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        status: user.status,
      },
      accessToken,
      refreshToken,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
// ============================================================
// LOGIN
// ============================================================
async function login({ email, password, ip, userAgent }) {
  // Find user
  const user = await db.queryOne(
    `SELECT id, email, password_hash, first_name, last_name, role, status,
            email_verified, avatar_url
     FROM users WHERE email = $1 AND deleted_at IS NULL`,
    [email]
  );

  // Log attempt
  const logAttempt = (success, reason = null) =>
    db.query(
      `INSERT INTO login_attempts (email, ip_address, user_agent, success, failure_reason)
       VALUES ($1, $2, $3, $4, $5)`,
      [email, ip || null, userAgent || null, success, reason]
    ).catch(() => {});

  if (!user) {
    await logAttempt(false, 'user_not_found');
    throw new UnauthorizedError('Invalid email or password');
  }

  if (user.status === 'suspended' || user.status === 'inactive') {
    await logAttempt(false, 'account_' + user.status);
    throw new ForbiddenError('Your account is ' + user.status);
  }

  // Verify password
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    await logAttempt(false, 'wrong_password');
    throw new UnauthorizedError('Invalid email or password');
  }

  await logAttempt(true);

  // Update last login
  await db.query(
    `UPDATE users SET last_login_at = NOW(), last_login_ip = $1 WHERE id = $2`,
    [ip || null, user.id]
  );

  // Sign tokens
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Save session
  await db.query(
    `INSERT INTO sessions (user_id, token, refresh_token, device_info, ip_address, user_agent, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      user.id,
      accessToken,
      refreshToken,
      JSON.stringify({}),
      ip || null,
      userAgent || null,
      expiresIn(30, 'days'),
    ]
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      status: user.status,
      emailVerified: user.email_verified,
      avatarUrl: user.avatar_url,
    },
    accessToken,
    refreshToken,
  };
}

// ============================================================
// VERIFY EMAIL
// ============================================================
async function verifyEmail(token) {
  const verification = await db.queryOne(
    `SELECT id, user_id, expires_at, verified_at
     FROM verifications
     WHERE token = $1 AND type = 'email'`,
    [token]
  );

  if (!verification) throw new BadRequestError('Invalid verification token');
  if (verification.verified_at) throw new BadRequestError('Email already verified');
  if (new Date(verification.expires_at) < new Date()) {
    throw new BadRequestError('Verification token expired');
  }

  await db.transaction(async (client) => {
    await client.query(
      `UPDATE verifications SET verified_at = NOW() WHERE id = $1`,
      [verification.id]
    );
    await client.query(
      `UPDATE users SET email_verified = TRUE, status = 'active' WHERE id = $1`,
      [verification.user_id]
    );
  });

  return { message: 'Email verified successfully' };
}

// ============================================================
// FORGOT PASSWORD
// ============================================================
async function forgotPassword(email) {
  const user = await db.queryOne(
    `SELECT id, first_name FROM users WHERE email = $1 AND deleted_at IS NULL`,
    [email]
  );

  // Always return success (don't leak existence)
  if (!user) return { message: 'If that email exists, a reset link has been sent' };

  const token = generateToken(32);
  await db.query(
    `INSERT INTO password_resets (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [user.id, token, expiresIn(1, 'hours')]
  );

  const resetUrl = `${FRONTEND_URL}/reset-password?token=${token}`;
  sendEmail({
    to: email,
    subject: 'Reset your NCG password',
    html: templates.passwordResetEmail({ firstName: user.first_name, resetUrl }),
  }).catch((err) => logger.error('Reset email failed', { error: err.message }));

  return { message: 'If that email exists, a reset link has been sent' };
}

// ============================================================
// RESET PASSWORD
// ============================================================
async function resetPassword({ token, password }) {
  const reset = await db.queryOne(
    `SELECT id, user_id, expires_at, used_at
     FROM password_resets WHERE token = $1`,
    [token]
  );

  if (!reset) throw new BadRequestError('Invalid reset token');
  if (reset.used_at) throw new BadRequestError('Reset token already used');
  if (new Date(reset.expires_at) < new Date()) {
    throw new BadRequestError('Reset token expired');
  }

  const passwordHash = await hashPassword(password);

  await db.transaction(async (client) => {
    await client.query(
      `UPDATE password_resets SET used_at = NOW() WHERE id = $1`,
      [reset.id]
    );
    await client.query(
      `UPDATE users SET password_hash = $1 WHERE id = $2`,
      [passwordHash, reset.user_id]
    );
    // Revoke all sessions
    await client.query(
      `DELETE FROM sessions WHERE user_id = $1`,
      [reset.user_id]
    );
  });

  return { message: 'Password reset successfully' };
}

// ============================================================
// CHANGE PASSWORD
// ============================================================
async function changePassword({ userId, currentPassword, newPassword }) {
  const user = await db.queryOne(
    `SELECT id, password_hash FROM users WHERE id = $1`,
    [userId]
  );
  if (!user) throw new NotFoundError('User not found');

  const ok = await verifyPassword(currentPassword, user.password_hash);
  if (!ok) throw new UnauthorizedError('Current password is incorrect');

  const newHash = await hashPassword(newPassword);
  await db.query(
    `UPDATE users SET password_hash = $1 WHERE id = $2`,
    [newHash, userId]
  );

  // Revoke other sessions (optional)
  // await db.query(`DELETE FROM sessions WHERE user_id = $1`, [userId]);

  return { message: 'Password changed successfully' };
}

// ============================================================
// LOGOUT
// ============================================================
async function logout(token) {
  await db.query(`DELETE FROM sessions WHERE token = $1`, [token]);
  return { message: 'Logged out successfully' };
}

// ============================================================
// GET CURRENT USER
// ============================================================
async function getMe(userId) {
  const user = await db.queryOne(
    `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.status,
            u.email_verified, u.phone, u.avatar_url, u.created_at,
            p.headline, p.bio, p.location, p.country, p.city, p.company, p.position
     FROM users u
     LEFT JOIN profiles p ON p.user_id = u.id
     WHERE u.id = $1 AND u.deleted_at IS NULL`,
    [userId]
  );
  if (!user) throw new NotFoundError('User not found');

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    fullName: `${user.first_name} ${user.last_name}`,
    role: user.role,
    status: user.status,
    emailVerified: user.email_verified,
    phone: user.phone,
    avatarUrl: user.avatar_url,
    createdAt: user.created_at,
    profile: {
      headline: user.headline,
      bio: user.bio,
      location: user.location,
      country: user.country,
      city: user.city,
      company: user.company,
      position: user.position,
    },
  };
}

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
  getMe,
};