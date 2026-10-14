// backend/src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(requireAuth, authorize('admin', 'super_admin'));

router.get('/dashboard', ctrl.dashboard);

module.exports = router;