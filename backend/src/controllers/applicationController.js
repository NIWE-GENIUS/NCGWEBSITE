// backend/src/controllers/applicationController.js
const service = require('../services/applicationService');
const { success, created, paginated } = require('../utils/response');

async function submit(req, res, next) {
  try {
    const r = await service.submit({ ...req.body, userId: req.user?.id });
    return created(res, r, r.message);
  } catch (err) { next(err); }
}
async function listMine(req, res, next) {
  try { const { items, pagination } = await service.listMine(req.user.id, req.query); return paginated(res, items, pagination, 'Applications retrieved'); }
  catch (err) { next(err); }
}
async function getMine(req, res, next) {
  try { return success(res, await service.getMyApplication(req.user.id, req.params.id), 'Application retrieved'); }
  catch (err) { next(err); }
}
async function withdraw(req, res, next) {
  try { const r = await service.withdraw(req.user.id, req.params.id); return success(res, r, r.message); }
  catch (err) { next(err); }
}
async function listAdmin(req, res, next) {
  try { const { items, pagination } = await service.listAdmin(req.query); return paginated(res, items, pagination, 'Applications retrieved'); }
  catch (err) { next(err); }
}
async function getAdminById(req, res, next) {
  try { return success(res, await service.getAdminById(req.params.id), 'Application retrieved'); }
  catch (err) { next(err); }
}
async function review(req, res, next) {
  try {
    const r = await service.review(req.params.id, {
      adminId: req.user.id,
      status: req.body.status,
      decision: req.body.decision,
      decisionNotes: req.body.decisionNotes,
    });
    return success(res, r, 'Application reviewed');
  } catch (err) { next(err); }
}
async function stats(req, res, next) {
  try { return success(res, await service.stats(), 'Application stats'); }
  catch (err) { next(err); }
}

module.exports = { submit, listMine, getMine, withdraw, listAdmin, getAdminById, review, stats };