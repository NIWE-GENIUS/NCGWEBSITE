// src/routes/navigation.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/navigationController');
const { requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { param, body } = require('express-validator');

const idV = [param('id').isUUID().withMessage('Invalid ID')];

// ============================================================
// PUBLIC
// ============================================================
router.get('/navigation', ctrl.getNav);
router.get('/footer', ctrl.getFooter);
router.get('/legal', ctrl.listLegal);
router.get('/legal/:slug', ctrl.getLegal);

// ============================================================
// ADMIN — Navigation
// ============================================================
router.get('/admin/navigation', requireAuth, authorize('admin', 'super_admin'), ctrl.listNavAdmin);
router.post('/admin/navigation', requireAuth, authorize('admin', 'super_admin'),
  [body('label').trim().notEmpty(), body('url').trim().notEmpty()],
  validate, ctrl.createNav);
router.put('/admin/navigation/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.updateNav);
router.delete('/admin/navigation/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.deleteNav);

// ============================================================
// ADMIN — Footer
// ============================================================
router.get('/admin/footer', requireAuth, authorize('admin', 'super_admin'), ctrl.listFooterAdmin);
router.post('/admin/footer', requireAuth, authorize('admin', 'super_admin'),
  [body('section').trim().notEmpty(), body('label').trim().notEmpty(), body('url').trim().notEmpty()],
  validate, ctrl.createFooter);
router.put('/admin/footer/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.updateFooter);
router.delete('/admin/footer/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.deleteFooter);

// ============================================================
// ADMIN — Legal
// ============================================================
router.put('/admin/legal/:slug', requireAuth, authorize('admin', 'super_admin'), ctrl.upsertLegal);

module.exports = router;