// backend/src/controllers/donationController.js
const service = require('../services/donationService');
const { success, created, paginated } = require('../utils/response');

async function donate(req, res, next) {
  try {
    const r = await service.createDonation({ ...req.body, userId: req.user?.id });
    return created(res, r, r.message);
  } catch (err) { next(err); }
}
async function listCampaigns(req, res, next) {
  try { return success(res, await service.listCampaigns(), 'Campaigns retrieved'); }
  catch (err) { next(err); }
}
async function listDesignations(req, res, next) {
  try { return success(res, await service.listDesignations(), 'Designations retrieved'); }
  catch (err) { next(err); }
}
async function listRecognitionLevels(req, res, next) {
  try { return success(res, await service.listRecognitionLevels(), 'Recognition levels retrieved'); }
  catch (err) { next(err); }
}
async function listAdmin(req, res, next) {
  try { const { items, pagination } = await service.listAdmin(req.query); return paginated(res, items, pagination, 'Donations retrieved'); }
  catch (err) { next(err); }
}
async function updateStatus(req, res, next) {
  try { return success(res, await service.updateStatus(req.params.id, req.body.status), 'Status updated'); }
  catch (err) { next(err); }
}
async function stats(req, res, next) {
  try { return success(res, await service.stats(), 'Donation stats'); }
  catch (err) { next(err); }
}

module.exports = { donate, listCampaigns, listDesignations, listRecognitionLevels, listAdmin, updateStatus, stats };