// backend/src/routes/application.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/applicationController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { body, param } = require('express-validator');

const submitV = [
  body('programId').isUUID().withMessage('Valid program ID required'),
  body('cohortId').optional({ checkFalsy: true }).isUUID(),
  body('trackId').optional({ checkFalsy: true }).isUUID(),
  body('motivation').optional().trim().isLength({ max: 5000 }),
  body('personalInfo').optional().isObject(),
  body('education').optional().isArray(),
  body('experience').optional().isArray(),
];

router.post('/', optionalAuth, submitV, validate, ctrl.submit);

router.use(requireAuth);
router.get('/mine', ctrl.listMine);
router.get('/mine/:id', [param('id').isUUID()], validate, ctrl.getMine);
router.post('/mine/:id/withdraw', [param('id').isUUID()], validate, ctrl.withdraw);

router.get('/admin/list', authorize('admin', 'super_admin'), ctrl.listAdmin);
router.get('/admin/stats', authorize('admin', 'super_admin'), ctrl.stats);
router.get('/admin/:id', authorize('admin', 'super_admin'), [param('id').isUUID()], validate, ctrl.getAdminById);
router.put('/admin/:id/review', authorize('admin', 'super_admin'), [param('id').isUUID(), body('status').isString()], validate, ctrl.review);

module.exports = router;