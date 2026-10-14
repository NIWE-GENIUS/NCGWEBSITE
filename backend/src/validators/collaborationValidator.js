// backend/src/validators/collaborationValidator.js
const { body, param } = require('express-validator');

const requestValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ min: 3, max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('requesterName').trim().notEmpty().withMessage('Name is required'),
  body('requesterEmail').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('requesterPhone').optional().trim(),
  body('organization').optional().trim(),
  body('collaborationType').optional().trim(),
  body('proposal').optional().trim(),
  body('expectedOutcome').optional().trim(),
];

const idValidator = [param('id').isUUID().withMessage('Invalid ID')];

module.exports = { requestValidator, idValidator };