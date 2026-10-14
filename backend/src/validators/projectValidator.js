// backend/src/validators/projectValidator.js
const { body, param } = require('express-validator');

const createValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 2, max: 200 }),
  body('category').optional().isIn(['software', 'ai', 'iot', 'automation', 'agritech', 'electrical', 'infrastructure', 'other']),
  body('descriptionShort').optional().trim(),
  body('descriptionLong').optional().trim(),
  body('problemStatement').optional().trim(),
  body('solution').optional().trim(),
  body('status').optional().isIn(['concept', 'prototype', 'mvp', 'launched', 'scaling', 'archived']),
  body('featured').optional().isBoolean(),
  body('published').optional().isBoolean(),
];

const updateValidator = [
  param('id').isUUID().withMessage('Invalid ID'),
  ...createValidator.map((v) => v.optional()),
];

const idValidator = [param('id').isUUID().withMessage('Invalid ID')];

module.exports = { createValidator, updateValidator, idValidator };