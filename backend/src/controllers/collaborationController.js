// backend/src/controllers/collaborationController.js
const service = require('../services/collaborationService');
const { success, created, paginated } = require('../utils/response');

async function listPublic(req, res, next) {
  try {
    const { items, pagination } = await service.listPublic(req.query);
    return paginated(res, items, pagination, 'Collaborations retrieved');
  } catch (err) { next(err); }
}

async function getBySlug(req, res, next) {
  try {
    return success(res, await service.getBySlug(req.params.slug), 'Collaboration retrieved');
  } catch (err) { next(err); }
}

async function request(req, res, next) {
  try {
    const r = await service.submitRequest(req.body);
    return created(res, r, r.message);
  } catch (err) { next(err); }
}

async function listAdmin(req, res, next) {
  try {
    const { items, pagination } = await service.listAdmin(req.query);
    return paginated(res, items, pagination, 'Collaborations retrieved');
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    return created(res, await service.create(req.body), 'Collaboration created');
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    return success(res, await service.update(req.params.id, req.body), 'Updated');
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const r = await service.remove(req.params.id);
    return success(res, r, r.message);
  } catch (err) { next(err); }
}

async function listRequests(req, res, next) {
  try {
    const { items, pagination } = await service.listRequests(req.query);
    return paginated(res, items, pagination, 'Requests retrieved');
  } catch (err) { next(err); }
}

async function reviewRequest(req, res, next) {
  try {
    return success(
      res,
      await service.reviewRequest(req.params.id, { adminId: req.user.id, status: req.body.status }),
      'Request reviewed'
    );
  } catch (err) { next(err); }
}

module.exports = {
  listPublic, getBySlug, request,
  listAdmin, create, update, remove,
  listRequests, reviewRequest,
};