// backend/src/routes/user.routes.js
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const {
  listUsersValidator,
  createUserValidator,
  updateUserValidator,
  userIdValidator,
} = require('../validators/userValidator');

// All user routes require authentication
router.use(requireAuth);

// Stats (admin only)
router.get('/stats', authorize('admin', 'super_admin'), userController.stats);

// List users (admin only)
router.get('/', authorize('admin', 'super_admin'), listUsersValidator, validate, userController.list);

// Create user (admin only)
router.post('/', authorize('admin', 'super_admin'), createUserValidator, validate, userController.create);

// Get user by ID (any authenticated — but a user can only see themselves unless admin)
router.get('/:id', userIdValidator, validate, (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin' && req.user.id !== req.params.id) {
    return res.status(403).json({ success: false, message: 'Forbidden', code: 'FORBIDDEN' });
  }
  next();
}, userController.getById);

// Update user (admin only)
router.put('/:id', authorize('admin', 'super_admin'), updateUserValidator, validate, userController.update);

// Suspend / activate (admin only)
router.post('/:id/suspend', authorize('admin', 'super_admin'), userIdValidator, validate, userController.suspend);
router.post('/:id/activate', authorize('admin', 'super_admin'), userIdValidator, validate, userController.activate);

// Delete (super admin only)
router.delete('/:id', authorize('super_admin'), userIdValidator, validate, userController.remove);

module.exports = router;