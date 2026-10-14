// backend/src/routes/upload.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/uploadController');
const { requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { uploadSingle, uploadMultiple } = require('../middleware/upload');

router.use(requireAuth, authorize('admin', 'super_admin'));

router.post('/single', uploadSingle, ctrl.uploadOne);
router.post('/multiple', uploadMultiple, ctrl.uploadMany);
router.get('/list', ctrl.listMedia);

module.exports = router;