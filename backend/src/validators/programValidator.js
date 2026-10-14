// backend/src/validators/programValidator.js
const { body, param, query } = require('express-validator');

const CATEGORIES = ['bootcamp', 'internship', 'online', 'coaching', 'tutoring', 'workshop', 'other'];
const FORMATS = ['physical', 'online', 'hybrid'];
const LEVELS = ['beginner', 'intermediate', 'advanced', 'all_levels'];
const COHORT_STATUSES = ['planned', 'open', 'ongoing', 'completed', 'cancelled'];

const listValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isIn(CATEGORIES),
  query('format').optional().isIn(FORMATS),
  query('level').optional().isIn(LEVELS),
  query('featured').optional().isIn(['true', 'false']),
  query('registrationOpen').optional().isIn(['true', 'false']),
  query('search').optional().trim(),
];

const createValidator = [
  body('name').trim().notEmpty().withMessage('Name required').isLength({ min: 2, max: 200 }),
  body('tagline').optional().trim().isLength({ max: 300 }),
  body('category').isIn(CATEGORIES).withMessage('Invalid category'),
  body('descriptionShort').optional().trim(),
  body('descriptionLong').optional().trim(),
  body('duration').optional().trim(),
  body('format').optional().isIn(FORMATS),
  body('level').optional().isIn(LEVELS),
  body('price').optional().isFloat({ min: 0 }),
  body('currency').optional().isLength({ min: 3, max: 3 }),
  body('capacity').optional().isInt({ min: 0 }),
  body('certificateAvailable').optional().isBoolean(),
  body('registrationOpen').optional().isBoolean(),
  body('registrationDeadline').optional({ checkFalsy: true }).isISO8601(),
  body('imageUrl').optional({ checkFalsy: true }).trim().isURL(),
  body('icon').optional().trim(),
  body('requirements').optional().isArray(),
  body('curriculum').optional().isArray(),
  body('outcomes').optional().isArray(),
  body('featured').optional().isBoolean(),
  body('displayOrder').optional().isInt({ min: 0 }),
  body('published').optional().isBoolean(),
];

const updateValidator = [
  param('id').isUUID().withMessage('Invalid ID'),
  ...createValidator.map((v) => v.optional()),
];

const idValidator = [param('id').isUUID().withMessage('Invalid ID')];
const slugValidator = [param('slug').trim().notEmpty().withMessage('Slug required')];

const cohortValidator = [
  param('id').isUUID().withMessage('Invalid program ID'),
  body('name').trim().notEmpty().withMessage('Cohort name required'),
  body('startDate').optional({ checkFalsy: true }).isISO8601(),
  body('endDate').optional({ checkFalsy: true }).isISO8601(),
  body('capacity').optional().isInt({ min: 0 }),
  body('status').optional().isIn(COHORT_STATUSES),
  body('schedule').optional().isObject(),
  body('instructors').optional().isArray(),
];

module.exports = {
  listValidator, createValidator, updateValidator,
  idValidator, slugValidator, cohortValidator,
};