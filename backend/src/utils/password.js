// backend/src/utils/password.js
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Hash a plaintext password
 */
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare plaintext password with hash
 */
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Check password strength
 * Returns { valid, score, message }
 */
function checkPasswordStrength(password) {
  let score = 0;
  const checks = {
    length: password.length >= 12,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  Object.values(checks).forEach((v) => { if (v) score += 1; });

  const valid = password.length >= 12 && score >= 4;

  return {
    valid,
    score,
    checks,
    message: valid
      ? 'Password is strong'
      : 'Password must be at least 12 characters and contain uppercase, lowercase, number, and special character',
  };
}

module.exports = {
  hashPassword,
  verifyPassword,
  checkPasswordStrength,
};