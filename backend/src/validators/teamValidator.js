// backend/src/validators/teamValidator.js
const { body, param, query } = require('express-validator');

const EMPLOYMENT_TYPES = ['full_time', 'part_time', 'contract', 'intern', 'volunteer', 'advisor'];

const listValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('department').optional().trim(),
  query('featured').optional().isIn(['true', 'false']),
  query('published').optional().isIn(['true', 'false']),
  query('search').optional().trim(),
];

const createValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name required').isLength({ min: 2, max: 200 }),
  body('position').trim().notEmpty().withMessage('Position required').isLength({ min: 2, max: 200 }),
  body('department').optional().trim(),
  body('employmentType').optional().isIn(EMPLOYMENT_TYPES),
  body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Invalid email'),
  body('phone').optional().trim(),
  body('location').optional().trim(),
  body('bioShort').optional().trim().isLength({ max: 300 }),
  body('bioFull').optional().trim(),
  body('missionStatement').optional().trim(),
  body('profileImageUrl').optional({ checkFalsy: true }).trim().isURL(),
  body('coverImageUrl').optional({ checkFalsy: true }).trim().isURL(),
  body('portfolioUrl').optional({ checkFalsy: true }).trim().isURL(),
  body('socialLinks').optional().isObject(),
  body('skills').optional().isArray(),
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

module.exports = { listValidator, createValidator, updateValidator, idValidator, slugValidator };