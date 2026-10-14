// backend/src/routes/contact.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contactController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { body, param } = require('express-validator');

const idV = [param('id').isUUID()];
const submitV = [
  body('name').trim().notEmpty().isLength({ min: 2, max: 200 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('message').trim().notEmpty().isLength({ min: 10, max: 5000 }),
  body('subject').optional().trim(),
  body('phone').optional().trim(),
  body('purpose').optional().isIn(['general', 'support', 'partnership', 'collaboration', 'donation', 'careers', 'media', 'training', 'investment', 'complaint', 'feedback', 'other']),
];

// Public submit
router.post('/', optionalAuth, submitV, validate, ctrl.submit);

// Admin
router.get('/admin/list', requireAuth, authorize('admin', 'super_admin'), ctrl.list);
router.get('/admin/stats', requireAuth, authorize('admin', 'super_admin'), ctrl.stats);
router.get('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.getById);
router.put('/admin/:id/status', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.updateStatus);
router.post('/admin/:id/reply', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.reply);
router.post('/admin/:id/notes', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.addNote);
router.delete('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.remove);

module.exports = router;