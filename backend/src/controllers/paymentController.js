// backend/src/controllers/paymentController.js
const service = require('../services/paymentService');
const { success, created, paginated } = require('../utils/response');

async function createIntent(req, res, next) {
  try { return created(res, await service.createPaymentIntent({ ...req.body, userId: req.user?.id }), 'Payment intent created'); }
  catch (err) { next(err); }
}
async function confirm(req, res, next) {
  try { return success(res, await service.confirmPayment(req.params.id, req.body), 'Payment confirmed'); }
  catch (err) { next(err); }
}
async function listAdmin(req, res, next) {
  try { const { items, pagination } = await service.listAdmin(req.query); return paginated(res, items, pagination, 'Payments retrieved'); }
  catch (err) { next(err); }
}
async function refund(req, res, next) {
  try { return created(res, await service.refund(req.params.id, { ...req.body, adminId: req.user.id }), 'Refund issued'); }
  catch (err) { next(err); }
}
async function stats(req, res, next) {
  try { return success(res, await service.stats(), 'Payment stats'); }
  catch (err) { next(err); }
}

module.exports = { createIntent, confirm, listAdmin, refund, stats };