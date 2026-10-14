// backend/src/controllers/contactController.js
const contactService = require('../services/contactService');
const { success, created, paginated } = require('../utils/response');

async function submit(req, res, next) {
  try {
    const data = {
      ...req.body,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.user?.id,
    };
    const r = await contactService.submit(data);
    return created(res, r, r.message);
  } catch (err) { next(err); }
}
async function list(req, res, next) {
  try {
    const { items, pagination } = await contactService.list(req.query);
    return paginated(res, items, pagination, 'Messages retrieved');
  } catch (err) { next(err); }
}
async function getById(req, res, next) {
  try { return success(res, await contactService.getById(req.params.id), 'Message retrieved'); }
  catch (err) { next(err); }
}
async function updateStatus(req, res, next) {
  try { return success(res, await contactService.updateStatus(req.params.id, req.body), 'Status updated'); }
  catch (err) { next(err); }
}
async function reply(req, res, next) {
  try {
    const r = await contactService.reply(req.params.id, {
      userId: req.user.id,
      replyText: req.body.replyText,
      sendEmail: req.body.sendEmail !== false,
    });
    return created(res, r, 'Reply sent');
  } catch (err) { next(err); }
}
async function addNote(req, res, next) {
  try { return created(res, await contactService.addNote(req.params.id, req.user.id, req.body.note), 'Note added'); }
  catch (err) { next(err); }
}
async function remove(req, res, next) {
  try { const r = await contactService.remove(req.params.id); return success(res, r, r.message); }
  catch (err) { next(err); }
}
async function stats(req, res, next) {
  try { return success(res, await contactService.stats(), 'Message stats'); }
  catch (err) { next(err); }
}

module.exports = { submit, list, getById, updateStatus, reply, addNote, remove, stats };