// backend/src/controllers/eventController.js
const service = require('../services/eventService');
const { success, created, paginated } = require('../utils/response');

async function listPublic(req, res, next) {
  try { const { items, pagination } = await service.listPublic(req.query); return paginated(res, items, pagination, 'Events retrieved'); }
  catch (err) { next(err); }
}
async function getBySlug(req, res, next) {
  try { return success(res, await service.getBySlug(req.params.slug), 'Event retrieved'); }
  catch (err) { next(err); }
}
async function register(req, res, next) {
  try { const r = await service.register(req.params.id, { ...req.body, userId: req.user?.id }); return created(res, r, r.message); }
  catch (err) { next(err); }
}
async function listAdmin(req, res, next) {
  try { const { items, pagination } = await service.listAdmin(req.query); return paginated(res, items, pagination, 'Events retrieved'); }
  catch (err) { next(err); }
}
async function create(req, res, next) {
  try { return created(res, await service.create(req.body), 'Event created'); }
  catch (err) { next(err); }
}
async function update(req, res, next) {
  try { return success(res, await service.update(req.params.id, req.body), 'Event updated'); }
  catch (err) { next(err); }
}
async function remove(req, res, next) {
  try { const r = await service.remove(req.params.id); return success(res, r, r.message); }
  catch (err) { next(err); }
}
async function listRegistrations(req, res, next) {
  try { return success(res, await service.listRegistrations(req.params.id), 'Registrations retrieved'); }
  catch (err) { next(err); }
}

module.exports = { listPublic, getBySlug, register, listAdmin, create, update, remove, listRegistrations };