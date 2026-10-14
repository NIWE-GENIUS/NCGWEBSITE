// backend/src/routes/partnership.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/partnershipController');
const { requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { body, param } = require('express-validator');

const applyV = [
  body('organizationName').trim().notEmpty(),
  body('contactName').trim().notEmpty(),
  body('contactEmail').trim().isEmail().normalizeEmail(),
  body('contactPhone').optional().trim(),
  body('website').optional({ checkFalsy: true }).trim().isURL(),
  body('areaOfCollaboration').optional().isArray(),
  body('proposal').optional().trim(),
  body('expectedOutcome').optional().trim(),
];
const idV = [param('id').isUUID()];

// Public
router.get('/', ctrl.listPublic);
router.get('/slug/:slug', ctrl.getBySlug);
router.post('/apply', applyV, validate, ctrl.apply);

// Admin
router.get('/admin/list', requireAuth, authorize('admin', 'super_admin'), ctrl.listAdmin);
router.get('/admin/applications', requireAuth, authorize('admin', 'super_admin'), ctrl.listApplications);
router.get('/admin/applications/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.getApplication);
router.put('/admin/applications/:id/review', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.reviewApplication);
router.get('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.getById);
router.post('/admin', requireAuth, authorize('admin', 'super_admin'), ctrl.create);
router.put('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.update);
router.delete('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.remove);

module.exports = router;