// backend/src/controllers/teamController.js
const teamService = require('../services/teamService');
const { success, created, paginated } = require('../utils/response');

async function listPublic(req, res, next) {
  try {
    const { items, pagination } = await teamService.listPublic(req.query);
    return paginated(res, items, pagination, 'Team members retrieved');
  } catch (err) { next(err); }
}

async function getBySlug(req, res, next) {
  try {
    const member = await teamService.getBySlug(req.params.slug);
    return success(res, member, 'Team member retrieved');
  } catch (err) { next(err); }
}

async function listAdmin(req, res, next) {
  try {
    const { items, pagination } = await teamService.listAdmin(req.query);
    return paginated(res, items, pagination, 'Team members retrieved');
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const member = await teamService.getById(req.params.id);
    return success(res, member, 'Team member retrieved');
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const member = await teamService.create(req.body);
    return created(res, member, 'Team member created');
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const member = await teamService.update(req.params.id, req.body);
    return success(res, member, 'Team member updated');
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const result = await teamService.remove(req.params.id);
    return success(res, result, result.message);
  } catch (err) { next(err); }
}

module.exports = { listPublic, getBySlug, listAdmin, getById, create, update, remove };