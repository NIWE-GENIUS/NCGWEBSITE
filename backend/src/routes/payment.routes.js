// backend/src/routes/payment.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { body, param } = require('express-validator');

const idV = [param('id').isUUID()];

router.post('/intent', optionalAuth, [body('amount').isFloat({ min: 1 })], validate, ctrl.createIntent);
router.post('/:id/confirm', optionalAuth, idV, validate, ctrl.confirm);

router.get('/admin/list', requireAuth, authorize('admin', 'super_admin'), ctrl.listAdmin);
router.get('/admin/stats', requireAuth, authorize('admin', 'super_admin'), ctrl.stats);
router.post('/admin/:id/refund', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.refund);

module.exports = router;