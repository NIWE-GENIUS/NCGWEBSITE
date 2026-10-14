// backend/src/controllers/broadcastController.js
const service = require('../services/broadcastService');
const { success, created } = require('../utils/response');

async function count(req, res, next) {
  try {
    const { recipients = ['users'], roles, status } = req.body;
    const counts = await service.countRecipients({ recipients, roles, status });
    const total = counts.users + counts.subscribers + counts.applicants;
    return success(res, { counts, total }, 'Recipient count');
  } catch (err) { next(err); }
}

async function send(req, res, next) {
  try {
    const { recipients = ['users'], subject, content, roles, status } = req.body;
    if (!subject || !content) {
      return res.status(400).json({ success: false, message: 'Subject and content required' });
    }
    const result = await service.sendBroadcast({ recipients, subject, content, roles, status });
    return created(res, result, result.message);
  } catch (err) { next(err); }
}

module.exports = { count, send };