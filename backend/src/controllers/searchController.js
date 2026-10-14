// backend/src/controllers/searchController.js
const service = require('../services/searchService');
const { success } = require('../utils/response');

async function search(req, res, next) {
  try {
    const q = req.query.q || '';
    const types = req.query.types ? req.query.types.split(',') : undefined;
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
    return success(res, await service.search(q, { types, limit }), 'Search results');
  } catch (err) { next(err); }
}

module.exports = { search };