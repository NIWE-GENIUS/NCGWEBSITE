// backend/src/routes/blog.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/blogController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { body, param } = require('express-validator');

const idV = [param('id').isUUID()];
const slugV = [param('slug').trim().notEmpty()];
const createV = [
  body('title').trim().notEmpty().isLength({ min: 2, max: 250 }),
  body('status').optional().isIn(['draft', 'scheduled', 'published', 'archived']),
];

// Public
router.get('/', ctrl.listPublic);
router.get('/categories', ctrl.listCategories);
router.get('/slug/:slug', slugV, validate, ctrl.getBySlug);
router.post('/:postId/comments', optionalAuth, [param('postId').isUUID(), body('content').trim().notEmpty().isLength({ max: 2000 })], validate, ctrl.addComment);

// Admin
router.get('/admin/list', requireAuth, authorize('admin', 'super_admin'), ctrl.listAdmin);
router.get('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.getById);
router.post('/admin', requireAuth, authorize('admin', 'super_admin'), createV, validate, ctrl.create);
router.put('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.update);
router.delete('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.remove);
router.post('/admin/categories', requireAuth, authorize('admin', 'super_admin'), body('name').trim().notEmpty(), validate, ctrl.createCategory);

module.exports = router;