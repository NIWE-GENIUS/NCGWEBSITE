// backend/src/routes/collaboration.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/collaborationController');
const { requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { body, param } = require('express-validator');

const reqV = [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('requesterName').trim().notEmpty(),
  body('requesterEmail').trim().isEmail().normalizeEmail(),
];
const idV = [param('id').isUUID()];

router.get('/', ctrl.listPublic);
router.get('/slug/:slug', ctrl.getBySlug);
router.post('/request', reqV, validate, ctrl.request);

router.get('/admin/list', requireAuth, authorize('admin', 'super_admin'), ctrl.listAdmin);
router.get('/admin/requests', requireAuth, authorize('admin', 'super_admin'), ctrl.listRequests);
router.put('/admin/requests/:id/review', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.reviewRequest);
router.post('/admin', requireAuth, authorize('admin', 'super_admin'), ctrl.create);
router.put('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.update);
router.delete('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.remove);

module.exports = router;