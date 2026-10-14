// backend/src/routes/team.routes.js
const express = require('express');
const router = express.Router();

const teamController = require('../controllers/teamController');
const { requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const {
  listValidator, createValidator, updateValidator, idValidator, slugValidator,
} = require('../validators/teamValidator');

// ============================================================
// PUBLIC — no auth required
// ============================================================
router.get('/', listValidator, validate, teamController.listPublic);
router.get('/slug/:slug', slugValidator, validate, teamController.getBySlug);

// ============================================================
// ADMIN — auth + role required
// ============================================================
router.get('/admin/list', requireAuth, authorize('admin', 'super_admin'), listValidator, validate, teamController.listAdmin);
router.get('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idValidator, validate, teamController.getById);
router.post('/admin', requireAuth, authorize('admin', 'super_admin'), createValidator, validate, teamController.create);
router.put('/admin/:id', requireAuth, authorize('admin', 'super_admin'), updateValidator, validate, teamController.update);
router.delete('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idValidator, validate, teamController.remove);

module.exports = router;