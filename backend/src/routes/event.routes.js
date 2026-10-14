// backend/src/routes/event.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/eventController');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { body, param } = require('express-validator');

const idV = [param('id').isUUID()];
const regV = [body('name').trim().notEmpty(), body('email').trim().isEmail().normalizeEmail()];

router.get('/', ctrl.listPublic);
router.get('/slug/:slug', ctrl.getBySlug);
router.post('/:id/register', optionalAuth, idV, regV, validate, ctrl.register);

router.get('/admin/list', requireAuth, authorize('admin', 'super_admin'), ctrl.listAdmin);
router.post('/admin', requireAuth, authorize('admin', 'super_admin'), ctrl.create);
router.put('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.update);
router.delete('/admin/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.remove);
router.get('/admin/:id/registrations', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.listRegistrations);

module.exports = router;