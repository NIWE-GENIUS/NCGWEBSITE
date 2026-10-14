// backend/src/controllers/notificationController.js
const service = require('../services/notificationService');
const { success, paginated, created } = require('../utils/response');

async function listMine(req, res, next) {
  try { const { items, pagination } = await service.listForUser(req.user.id, req.query); return paginated(res, items, pagination, 'Notifications retrieved'); }
  catch (err) { next(err); }
}
async function unreadCount(req, res, next) {
  try { return success(res, await service.unreadCount(req.user.id), 'Unread count'); }
  catch (err) { next(err); }
}
async function markRead(req, res, next) {
  try { return success(res, await service.markAsRead(req.user.id, req.params.id), 'Marked'); }
  catch (err) { next(err); }
}
async function markAllRead(req, res, next) {
  try { return success(res, await service.markAllAsRead(req.user.id), 'All marked'); }
  catch (err) { next(err); }
}
async function activeAnnouncements(req, res, next) {
  try { return success(res, await service.getActiveAnnouncements(req.query), 'Announcements retrieved'); }
  catch (err) { next(err); }
}
async function listAnnouncements(req, res, next) {
  try { const { items, pagination } = await service.listAnnouncements(req.query); return paginated(res, items, pagination, 'Announcements retrieved'); }
  catch (err) { next(err); }
}
async function createAnnouncement(req, res, next) {
  try { return created(res, await service.createAnnouncement(req.body, req.user.id), 'Announcement created'); }
  catch (err) { next(err); }
}
async function updateAnnouncement(req, res, next) {
  try { return success(res, await service.updateAnnouncement(req.params.id, req.body), 'Announcement updated'); }
  catch (err) { next(err); }
}
async function deleteAnnouncement(req, res, next) {
  try { const r = await service.deleteAnnouncement(req.params.id); return success(res, r, r.message); }
  catch (err) { next(err); }
}

module.exports = { listMine, unreadCount, markRead, markAllRead, activeAnnouncements, listAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };