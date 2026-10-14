// backend/src/routes/donation.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/donationController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { body, param } = require('express-validator');

const donateV = [
  body('name').trim().notEmpty(),
  body('email').trim().isEmail().normalizeEmail(),
  body('amount').isFloat({ min: 1 }),
  body('currency').optional().isLength({ min: 3, max: 3 }),
  body('donationType').optional().isIn(['one_time', 'recurring', 'pledge']),
  body('frequency').optional().isIn(['monthly', 'quarterly', 'annually']),
];

// Public
router.post('/', optionalAuth, donateV, validate, ctrl.donate);
router.get('/campaigns', ctrl.listCampaigns);
router.get('/designations', ctrl.listDesignations);
router.get('/recognition-levels', ctrl.listRecognitionLevels);

// Admin
router.get('/admin/list', requireAuth, authorize('admin', 'super_admin'), ctrl.listAdmin);
router.get('/admin/stats', requireAuth, authorize('admin', 'super_admin'), ctrl.stats);
router.put('/admin/:id/status', requireAuth, authorize('admin', 'super_admin'), [param('id').isUUID(), body('status').isIn(['pending', 'processing', 'succeeded', 'failed', 'refunded', 'cancelled'])], validate, ctrl.updateStatus);

module.exports = router;