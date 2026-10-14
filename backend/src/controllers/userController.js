// backend/src/controllers/userController.js
const userService = require('../services/userService');
const { success, created, paginated } = require('../utils/response');

async function list(req, res, next) {
  try {
    const { items, pagination } = await userService.listUsers(req.query);
    return paginated(res, items, pagination, 'Users retrieved');
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    return success(res, user, 'User retrieved');
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    return created(res, user, 'User created successfully');
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return success(res, user, 'User updated successfully');
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const result = await userService.deleteUser(req.params.id);
    return success(res, result, result.message);
  } catch (err) { next(err); }
}

async function suspend(req, res, next) {
  try {
    const result = await userService.suspendUser(req.params.id);
    return success(res, result, 'User suspended');
  } catch (err) { next(err); }
}

async function activate(req, res, next) {
  try {
    const result = await userService.activateUser(req.params.id);
    return success(res, result, 'User activated');
  } catch (err) { next(err); }
}

async function stats(req, res, next) {
  try {
    const result = await userService.getStats();
    return success(res, result, 'User statistics');
  } catch (err) { next(err); }
}

module.exports = { list, getById, create, update, remove, suspend, activate, stats };