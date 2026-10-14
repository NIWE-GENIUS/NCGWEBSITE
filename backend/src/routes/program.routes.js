// backend/src/routes/program.routes.js
const express = require('express');
const router = express.Router();

const programController = require('../controllers/programController');
const { requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const {
  listValidator, createValidator, updateValidator,
  idValidator, slugValidator, cohortValidator,
} = require('../validators/programValidator');

// ============================================================
// PUBLIC
// ============================================================
router.get('/', listValidator, validate, programController.listPublic);
router.get('/slug/:slug', slugValidator, validate, programController.getBySlug);

// ============================================================
// ADMIN
// ============================================================
router.get('/admin/list', requireAuth, authorize('admin', 'super_admin'), listValidator, validate, programController.listAdmin);
router.get('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idValidator, validate, programController.getById);
router.post('/admin', requireAuth, authorize('admin', 'super_admin'), createValidator, validate, programController.create);
router.put('/admin/:id', requireAuth, authorize('admin', 'super_admin'), updateValidator, validate, programController.update);
router.delete('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idValidator, validate, programController.remove);

// Cohorts
router.get('/admin/:id/cohorts', requireAuth, authorize('admin', 'super_admin'), idValidator, validate, programController.listCohorts);
router.post('/admin/:id/cohorts', requireAuth, authorize('admin', 'super_admin'), cohortValidator, validate, programController.createCohort);

module.exports = router;