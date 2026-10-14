// backend/src/routes/broadcast.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/broadcastController');
const { requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { body } = require('express-validator');

router.use(requireAuth, authorize('admin', 'super_admin'));

router.post('/count', [body('recipients').optional().isArray()], validate, ctrl.count);
router.post('/send', [
  body('recipients').optional().isArray(),
  body('subject').trim().notEmpty(),
  body('content').trim().notEmpty(),
], validate, ctrl.send);

module.exports = router;