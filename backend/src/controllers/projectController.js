// backend/src/controllers/projectController.js
const projectService = require('../services/projectService');
const { success, created, paginated } = require('../utils/response');

async function listPublic(req, res, next) {
  try {
    const { items, pagination } = await projectService.listPublic(req.query);
    return paginated(res, items, pagination, 'Projects retrieved');
  } catch (err) { next(err); }
}
async function getBySlug(req, res, next) {
  try { return success(res, await projectService.getBySlug(req.params.slug), 'Project retrieved'); }
  catch (err) { next(err); }
}
async function listAdmin(req, res, next) {
  try {
    const { items, pagination } = await projectService.listAdmin(req.query);
    return paginated(res, items, pagination, 'Projects retrieved');
  } catch (err) { next(err); }
}
async function getById(req, res, next) {
  try { return success(res, await projectService.getById(req.params.id), 'Project retrieved'); }
  catch (err) { next(err); }
}
async function create(req, res, next) {
  try { return created(res, await projectService.create(req.body), 'Project created'); }
  catch (err) { next(err); }
}
async function update(req, res, next) {
  try { return success(res, await projectService.update(req.params.id, req.body), 'Project updated'); }
  catch (err) { next(err); }
}
async function remove(req, res, next) {
  try { const r = await projectService.remove(req.params.id); return success(res, r, r.message); }
  catch (err) { next(err); }
}

module.exports = { listPublic, getBySlug, listAdmin, getById, create, update, remove };