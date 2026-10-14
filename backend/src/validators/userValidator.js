// backend/src/validators/userValidator.js
const { body, param, query } = require('express-validator');

const ROLES = ['student', 'professional', 'entrepreneur', 'intern', 'partner', 'investor', 'mentor', 'guest', 'admin', 'super_admin'];
const STATUSES = ['pending', 'active', 'suspended', 'inactive', 'deleted'];

const listUsersValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('role').optional().isIn(ROLES),
  query('status').optional().isIn(STATUSES),
];

const createUserValidator = [
 body('firstName').trim().notEmpty().withMessage('First name required').isLength({ min: 1, max: 100 }),
body('lastName').trim().notEmpty().withMessage('Last name required').isLength({ min: 1, max: 100 }),
body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(ROLES).withMessage('Invalid role'),
  body('status').optional().isIn(STATUSES).withMessage('Invalid status'),
  body('phone').optional().trim(),
  body('emailVerified').optional().isBoolean(),
];

const updateUserValidator = [
  param('id').isUUID().withMessage('Invalid user ID'),
  body('email').optional().trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('firstName').optional().trim().isLength({ min: 2, max: 100 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 100 }),
  body('role').optional().isIn(ROLES),
  body('status').optional().isIn(STATUSES),
];

const userIdValidator = [param('id').isUUID().withMessage('Invalid user ID')];

const updateProfileValidator = [
  body('headline').optional().trim().isLength({ max: 200 }),
  body('bio').optional().trim().isLength({ max: 5000 }),
  body('location').optional().trim().isLength({ max: 200 }),
  body('country').optional().trim().isLength({ max: 100 }),
  body('city').optional().trim().isLength({ max: 100 }),
  body('website').optional().trim().isURL().withMessage('Website must be a valid URL'),
  body('company').optional().trim().isLength({ max: 200 }),
  body('position').optional().trim().isLength({ max: 200 }),
  body('industry').optional().trim().isLength({ max: 100 }),
  body('education').optional().isArray(),
  body('experience').optional().isArray(),
  body('skills').optional().isArray(),
  body('interests').optional().isArray(),
  body('socialLinks').optional().isObject(),
];

module.exports = {
  listUsersValidator,
  createUserValidator,
  updateUserValidator,
  userIdValidator,
  updateProfileValidator,
};