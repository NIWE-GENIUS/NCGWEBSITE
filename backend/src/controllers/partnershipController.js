// backend/src/controllers/partnershipController.js
const service = require('../services/partnershipService');
const { success, created, paginated } = require('../utils/response');

async function listPublic(req, res, next) {
  try { const { items, pagination } = await service.listPublic(req.query); return paginated(res, items, pagination, 'Partners retrieved'); }
  catch (err) { next(err); }
}
async function getBySlug(req, res, next) {
  try { return success(res, await service.getBySlug(req.params.slug), 'Partner retrieved'); }
  catch (err) { next(err); }
}
async function apply(req, res, next) {
  try { const r = await service.submitApplication(req.body); return created(res, r, r.message); }
  catch (err) { next(err); }
}
async function listAdmin(req, res, next) {
  try { const { items, pagination } = await service.listAdmin(req.query); return paginated(res, items, pagination, 'Partners retrieved'); }
  catch (err) { next(err); }
}
async function getById(req, res, next) {
  try { return success(res, await service.getById(req.params.id), 'Partner retrieved'); }
  catch (err) { next(err); }
}
async function create(req, res, next) {
  try { return created(res, await service.create(req.body), 'Partner created'); }
  catch (err) { next(err); }
}
async function update(req, res, next) {
  try { return success(res, await service.update(req.params.id, req.body), 'Partner updated'); }
  catch (err) { next(err); }
}
async function remove(req, res, next) {
  try { const r = await service.remove(req.params.id); return success(res, r, r.message); }
  catch (err) { next(err); }
}
async function listApplications(req, res, next) {
  try { const { items, pagination } = await service.listApplications(req.query); return paginated(res, items, pagination, 'Applications retrieved'); }
  catch (err) { next(err); }
}
async function getApplication(req, res, next) {
  try { return success(res, await service.getApplication(req.params.id), 'Application retrieved'); }
  catch (err) { next(err); }
}
async function reviewApplication(req, res, next) {
  try {
    const r = await service.reviewApplication(req.params.id, {
      adminId: req.user.id,
      status: req.body.status,
      notes: req.body.notes,
    });
    return success(res, r, 'Application reviewed');
  } catch (err) { next(err); }
}

module.exports = { listPublic, getBySlug, apply, listAdmin, getById, create, update, remove, listApplications, getApplication, reviewApplication };