// backend/src/routes/notification.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { param } = require('express-validator');

// Public — active announcements
router.get('/announcements/active', ctrl.activeAnnouncements);

// Auth required
router.use(requireAuth);
router.get('/', ctrl.listMine);
router.get('/unread-count', ctrl.unreadCount);
router.put('/:id/read', [param('id').isUUID()], validate, ctrl.markRead);
router.put('/read-all', ctrl.markAllRead);

// Admin
router.get('/admin/announcements', authorize('admin', 'super_admin'), ctrl.listAnnouncements);
router.post('/admin/announcements', authorize('admin', 'super_admin'), ctrl.createAnnouncement);
router.put('/admin/announcements/:id', authorize('admin', 'super_admin'), [param('id').isUUID()], validate, ctrl.updateAnnouncement);
router.delete('/admin/announcements/:id', authorize('admin', 'super_admin'), [param('id').isUUID()], validate, ctrl.deleteAnnouncement);

module.exports = router;