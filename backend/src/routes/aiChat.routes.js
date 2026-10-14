// backend/src/routes/aiChat.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/aiChatController');
const { optionalAuth } = require('../middleware/auth');

router.post('/chat', optionalAuth, ctrl.chat);

module.exports = router;