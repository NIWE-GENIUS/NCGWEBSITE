// backend/src/validators/blogValidator.js
const { body, param } = require('express-validator');

const createValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 2, max: 250 }),
  body('excerpt').optional().trim(),
  body('content').optional().trim(),
  body('featuredImage').optional().trim(),
  body('categoryId').optional({ checkFalsy: true }).isUUID(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'scheduled', 'published', 'archived']),
  body('readTime').optional().isInt({ min: 1 }),
  body('metaTitle').optional().trim(),
  body('metaDescription').optional().trim(),
];

const updateValidator = [
  param('id').isUUID().withMessage('Invalid ID'),
  ...createValidator.map((v) => v.optional()),
];

const idValidator = [param('id').isUUID().withMessage('Invalid ID')];
const slugValidator = [param('slug').trim().notEmpty()];

module.exports = { createValidator, updateValidator, idValidator, slugValidator };