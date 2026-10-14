// backend/src/controllers/blogController.js
const service = require('../services/blogService');
const { success, created, paginated } = require('../utils/response');

async function listPublic(req, res, next) {
  try { const { items, pagination } = await service.listPublic(req.query); return paginated(res, items, pagination, 'Posts retrieved'); }
  catch (err) { next(err); }
}
async function getBySlug(req, res, next) {
  try { return success(res, await service.getBySlug(req.params.slug), 'Post retrieved'); }
  catch (err) { next(err); }
}
async function listCategories(req, res, next) {
  try { return success(res, await service.listCategories(), 'Categories retrieved'); }
  catch (err) { next(err); }
}
async function listAdmin(req, res, next) {
  try { const { items, pagination } = await service.listAdmin(req.query); return paginated(res, items, pagination, 'Posts retrieved'); }
  catch (err) { next(err); }
}
async function getById(req, res, next) {
  try { return success(res, await service.getById(req.params.id), 'Post retrieved'); }
  catch (err) { next(err); }
}
async function create(req, res, next) {
  try { return created(res, await service.create(req.body, req.user.id), 'Post created'); }
  catch (err) { next(err); }
}
async function update(req, res, next) {
  try { return success(res, await service.update(req.params.id, req.body), 'Post updated'); }
  catch (err) { next(err); }
}
async function remove(req, res, next) {
  try { const r = await service.remove(req.params.id); return success(res, r, r.message); }
  catch (err) { next(err); }
}
async function createCategory(req, res, next) {
  try { return created(res, await service.createCategory(req.body), 'Category created'); }
  catch (err) { next(err); }
}
async function addComment(req, res, next) {
  try {
    const r = await service.addComment(req.params.postId, {
      userId: req.user?.id,
      content: req.body.content,
      parentId: req.body.parentId,
    });
    return created(res, r, 'Comment submitted for moderation');
  } catch (err) { next(err); }
}

module.exports = { listPublic, getBySlug, listCategories, listAdmin, getById, create, update, remove, createCategory, addComment };