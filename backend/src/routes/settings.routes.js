// backend/src/routes/settings.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/settingsController');
const { requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Public
router.get('/company', ctrl.getCompany);
router.get('/public', ctrl.getPublicSettings);
router.get('/seo/:slug', ctrl.getSeo);

// Admin
router.put('/company', requireAuth, authorize('admin', 'super_admin'), ctrl.updateCompany);
router.get('/all', requireAuth, authorize('admin', 'super_admin'), ctrl.getAllSettings);
router.put('/:key', requireAuth, authorize('admin', 'super_admin'), ctrl.upsertSetting);
router.get('/seo', requireAuth, authorize('admin', 'super_admin'), ctrl.listSeo);
router.put('/seo/:slug', requireAuth, authorize('admin', 'super_admin'), ctrl.upsertSeo);

module.exports = router;