// backend/src/controllers/programController.js
const programService = require('../services/programService');
const { success, created, paginated } = require('../utils/response');

async function listPublic(req, res, next) {
  try {
    const { items, pagination } = await programService.listPublic(req.query);
    return paginated(res, items, pagination, 'Programs retrieved');
  } catch (err) { next(err); }
}

async function getBySlug(req, res, next) {
  try {
    const program = await programService.getBySlug(req.params.slug);
    return success(res, program, 'Program retrieved');
  } catch (err) { next(err); }
}

async function listAdmin(req, res, next) {
  try {
    const { items, pagination } = await programService.listAdmin(req.query);
    return paginated(res, items, pagination, 'Programs retrieved');
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const program = await programService.getById(req.params.id);
    return success(res, program, 'Program retrieved');
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const program = await programService.create(req.body);
    return created(res, program, 'Program created');
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const program = await programService.update(req.params.id, req.body);
    return success(res, program, 'Program updated');
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const result = await programService.remove(req.params.id);
    return success(res, result, result.message);
  } catch (err) { next(err); }
}

async function listCohorts(req, res, next) {
  try {
    const cohorts = await programService.listCohorts(req.params.id);
    return success(res, cohorts, 'Cohorts retrieved');
  } catch (err) { next(err); }
}

async function createCohort(req, res, next) {
  try {
    const cohort = await programService.createCohort(req.params.id, req.body);
    return created(res, cohort, 'Cohort created');
  } catch (err) { next(err); }
}

module.exports = {
  listPublic, getBySlug, listAdmin, getById,
  create, update, remove, listCohorts, createCohort,
};