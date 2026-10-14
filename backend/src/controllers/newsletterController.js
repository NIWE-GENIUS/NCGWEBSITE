// backend/src/controllers/newsletterController.js
const service = require('../services/newsletterService');
const { success, created, paginated } = require('../utils/response');

async function subscribe(req, res, next) {
  try { return created(res, await service.subscribe(req.body), 'Subscribed'); }
  catch (err) { next(err); }
}
async function unsubscribe(req, res, next) {
  try { return success(res, await service.unsubscribe(req.body.email), 'Unsubscribed'); }
  catch (err) { next(err); }
}
async function list(req, res, next) {
  try {
    const { items, pagination } = await service.list(req.query);
    return paginated(res, items, pagination, 'Subscribers retrieved');
  } catch (err) { next(err); }
}
async function stats(req, res, next) {
  try { return success(res, await service.stats(), 'Newsletter stats'); }
  catch (err) { next(err); }
}

module.exports = { subscribe, unsubscribe, list, stats };