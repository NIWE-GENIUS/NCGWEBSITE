// backend/src/routes/project.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/projectController');
const { requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { param, body } = require('express-validator');
const validate = require('../middleware/validate');

const idV = [param('id').isUUID()];
const slugV = [param('slug').trim().notEmpty()];
const createV = [
  body('title').trim().notEmpty().isLength({ min: 2, max: 200 }),
  body('category').optional().isIn(['software', 'ai', 'iot', 'automation', 'agritech', 'electrical', 'infrastructure', 'other']),
];

// Public
router.get('/', ctrl.listPublic);
router.get('/slug/:slug', slugV, validate, ctrl.getBySlug);

// Admin
router.get('/admin/list', requireAuth, authorize('admin', 'super_admin'), ctrl.listAdmin);
router.get('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.getById);
router.post('/admin', requireAuth, authorize('admin', 'super_admin'), createV, validate, ctrl.create);
router.put('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.update);
router.delete('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.remove);

module.exports = router;