// backend/src/services/userService.js
const db = require('../database');
const { hashPassword } = require('../utils/password');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/errors');
const { getPagination, getSorting } = require('../utils/pagination');

const ALLOWED_SORT_FIELDS = ['created_at', 'updated_at', 'email', 'first_name', 'last_name', 'role', 'status'];

/**
 * List users with pagination, filters, sorting
 */
async function listUsers(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT_FIELDS, 'created_at', 'DESC');

  const conditions = ['u.deleted_at IS NULL'];
  const values = [];
  let i = 1;

  if (query.role) { conditions.push(`u.role = $${i++}`); values.push(query.role); }
  if (query.status) { conditions.push(`u.status = $${i++}`); values.push(query.status); }
  if (query.search) {
    conditions.push(`(u.email ILIKE $${i} OR u.first_name ILIKE $${i} OR u.last_name ILIKE $${i})`);
    values.push(`%${query.search}%`);
    i++;
  }
  if (query.emailVerified === 'true' || query.emailVerified === 'false') {
    conditions.push(`u.email_verified = $${i++}`);
    values.push(query.emailVerified === 'true');
  }

  const where = 'WHERE ' + conditions.join(' AND ');

  // Total count
  const countResult = await db.queryOne(
    `SELECT COUNT(*)::int AS count FROM users u ${where}`,
    values
  );

  // Data
  const dataResult = await db.queryMany(
    `SELECT u.id, u.email, u.first_name, u.last_name, u.full_name, u.phone,
            u.role, u.status, u.email_verified, u.avatar_url,
            u.last_login_at, u.created_at,
            (SELECT COUNT(*) FROM sessions WHERE user_id = u.id) AS active_sessions
     FROM users u
     ${where}
     ORDER BY u.${sortBy} ${order}
     LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return {
    items: dataResult.map(formatUser),
    pagination: { page, limit, total: countResult.count },
  };
}

/**
 * Get user by ID
 */
async function getUserById(id) {
  const user = await db.queryOne(
    `SELECT u.id, u.email, u.phone, u.first_name, u.last_name, u.full_name,
            u.role, u.status, u.email_verified, u.phone_verified,
            u.two_factor_enabled, u.avatar_url, u.metadata, u.preferences,
            u.last_login_at, u.last_login_ip, u.created_at, u.updated_at,
            p.headline, p.bio, p.location, p.country, p.city, p.timezone,
            p.website, p.company, p.position, p.industry, p.education,
            p.experience, p.skills, p.interests, p.social_links,
            p.completion_percentage
     FROM users u
     LEFT JOIN profiles p ON p.user_id = u.id
     WHERE u.id = $1 AND u.deleted_at IS NULL`,
    [id]
  );

  if (!user) throw new NotFoundError('User not found');
  return formatUserDetail(user);
}

/**
 * Create a user (admin action)
 */
async function createUser({ firstName, lastName, email, phone, password, role, status, emailVerified }) {
  const existing = await db.queryOne('SELECT id FROM users WHERE email = $1', [email]);
  if (existing) throw new ConflictError('Email already registered');

  const passwordHash = await hashPassword(password);

  const user = await db.transaction(async (client) => {
    const result = await client.query(
      `INSERT INTO users (email, phone, password_hash, first_name, last_name, role, status, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, first_name, last_name, role, status, email_verified, created_at`,
      [email, phone || null, passwordHash, firstName, lastName, role || 'guest', status || 'active', emailVerified || false]
    );

    await client.query(
      `INSERT INTO profiles (user_id, headline, location, country, city)
       VALUES ($1, $2, 'Kigali', 'Rwanda', 'Kigali')`,
      [result.rows[0].id, `${(role || 'guest').charAt(0).toUpperCase() + (role || 'guest').slice(1)} at NCG`]
    );

    await client.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE name = $2`,
      [result.rows[0].id, role || 'guest']
    );

    return result.rows[0];
  });

  return formatUser(user);
}

/**
 * Update user (admin)
 */
async function updateUser(id, updates) {
  const allowed = ['email', 'phone', 'first_name', 'last_name', 'role', 'status', 'email_verified', 'phone_verified', 'avatar_url'];
  const fields = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (allowed.includes(key) && value !== undefined) {
      fields.push(`${key} = $${i++}`);
      values.push(value);
    }
  }

  if (fields.length === 0) throw new BadRequestError('No valid fields to update');

  values.push(id);
  const result = await db.queryOne(
    `UPDATE users SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${i} AND deleted_at IS NULL
     RETURNING id, email, first_name, last_name, role, status, email_verified`,
    values
  );

  if (!result) throw new NotFoundError('User not found');
  return formatUser(result);
}

/**
 * Soft-delete user
 */
async function deleteUser(id) {
  const result = await db.queryOne(
    `UPDATE users SET deleted_at = NOW(), status = 'deleted'
     WHERE id = $1 AND deleted_at IS NULL
     RETURNING id`,
    [id]
  );
  if (!result) throw new NotFoundError('User not found');

  // Revoke sessions
  await db.query(`DELETE FROM sessions WHERE user_id = $1`, [id]);

  return { message: 'User deleted successfully' };
}

/**
 * Suspend user
 */
async function suspendUser(id) {
  const result = await db.queryOne(
    `UPDATE users SET status = 'suspended', updated_at = NOW()
     WHERE id = $1 AND deleted_at IS NULL
     RETURNING id, status`,
    [id]
  );
  if (!result) throw new NotFoundError('User not found');
  await db.query(`DELETE FROM sessions WHERE user_id = $1`, [id]);
  return result;
}

/**
 * Activate user
 */
async function activateUser(id) {
  const result = await db.queryOne(
    `UPDATE users SET status = 'active', updated_at = NOW()
     WHERE id = $1 AND deleted_at IS NULL
     RETURNING id, status`,
    [id]
  );
  if (!result) throw new NotFoundError('User not found');
  return result;
}

/**
 * Get dashboard stats
 */
async function getStats() {
  const result = await db.queryOne(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'active')::int AS active,
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE status = 'suspended')::int AS suspended,
      COUNT(*) FILTER (WHERE email_verified = TRUE)::int AS verified,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS new_last_7_days,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS new_last_30_days
    FROM users WHERE deleted_at IS NULL
  `);

  const byRole = await db.queryMany(`
    SELECT role, COUNT(*)::int AS count
    FROM users WHERE deleted_at IS NULL
    GROUP BY role ORDER BY count DESC
  `);

  return { ...result, byRole };
}

function formatUser(row) {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: row.full_name || `${row.first_name} ${row.last_name}`,
    phone: row.phone,
    role: row.role,
    status: row.status,
    emailVerified: row.email_verified,
    avatarUrl: row.avatar_url,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    activeSessions: row.active_sessions,
  };
}

function formatUserDetail(row) {
  return {
    ...formatUser(row),
    phoneVerified: row.phone_verified,
    twoFactorEnabled: row.two_factor_enabled,
    lastLoginIp: row.last_login_ip,
    updatedAt: row.updated_at,
    metadata: row.metadata,
    preferences: row.preferences,
    profile: {
      headline: row.headline,
      bio: row.bio,
      location: row.location,
      country: row.country,
      city: row.city,
      timezone: row.timezone,
      website: row.website,
      company: row.company,
      position: row.position,
      industry: row.industry,
      education: row.education,
      experience: row.experience,
      skills: row.skills,
      interests: row.interests,
      socialLinks: row.social_links,
      completionPercentage: row.completion_percentage,
    },
  };
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
  getStats,
};