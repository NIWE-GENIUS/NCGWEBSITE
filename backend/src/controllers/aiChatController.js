// backend/src/controllers/aiChatController.js
const service = require('../services/aiChatService');
const { success } = require('../utils/response');

async function chat(req, res, next) {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ success: false, message: 'Message too long (max 1000 chars)' });
    }

    const reply = await service.generateReply(message, { user: req.user });
    return success(res, reply, 'Reply generated');
  } catch (err) {
    next(err);
  }
}

module.exports = { chat };