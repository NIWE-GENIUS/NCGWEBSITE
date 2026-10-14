// backend/src/routes/newsletter.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/newsletterController');
const { requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

const subscribeV = [
  body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('name').optional().trim(),
  body('source').optional().trim(),
  body('tags').optional().isArray(),
];

// Public
router.post('/subscribe', subscribeV, validate, ctrl.subscribe);
router.post('/unsubscribe', [body('email').trim().isEmail()], validate, ctrl.unsubscribe);

// Admin
router.get('/admin/list', requireAuth, authorize('admin', 'super_admin'), ctrl.list);
router.get('/admin/stats', requireAuth, authorize('admin', 'super_admin'), ctrl.stats);

module.exports = router;