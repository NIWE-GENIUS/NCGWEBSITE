// backend/src/middleware/auth.js
const { verifyAccessToken, extractBearerToken } = require('../utils/jwt');
const { UnauthorizedError } = require('../utils/errors');
const db = require('../database');

/**
 * Require authentication — verifies JWT and loads user
 */
async function requireAuth(req, res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) throw new UnauthorizedError('Missing authentication token');

    const decoded = verifyAccessToken(token);

    // Confirm user still exists and is active
    const user = await db.queryOne(
      `SELECT id, email, role, status FROM users WHERE id = $1 AND deleted_at IS NULL`,
      [decoded.id]
    );
    if (!user) throw new UnauthorizedError('User no longer exists');
    if (user.status === 'suspended' || user.status === 'inactive') {
      throw new UnauthorizedError('Account is ' + user.status);
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Optional auth — loads user if token present, but doesn't require it
 */
async function optionalAuth(req, res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) return next();

    const decoded = verifyAccessToken(token);
    const user = await db.queryOne(
      `SELECT id, email, role, status FROM users WHERE id = $1 AND deleted_at IS NULL`,
      [decoded.id]
    );
    if (user) {
      req.user = user;
      req.token = token;
    }
    next();
  } catch (err) {
    next();
  }
}

module.exports = { requireAuth, optionalAuth };