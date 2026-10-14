// backend/src/validators/contactValidator.js
const { body, param } = require('express-validator');

const submitValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 200 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().trim(),
  body('organization').optional().trim(),
  body('subject').optional().trim(),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 5000 }),
  body('purpose').optional().isIn([
    'general', 'support', 'partnership', 'collaboration', 'donation',
    'careers', 'media', 'training', 'investment', 'complaint', 'feedback', 'other'
  ]),
];

const idValidator = [param('id').isUUID().withMessage('Invalid ID')];

module.exports = { submitValidator, idValidator };