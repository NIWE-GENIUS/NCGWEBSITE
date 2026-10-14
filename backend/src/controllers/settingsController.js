// backend/src/controllers/settingsController.js
const service = require('../services/settingsService');
const { success } = require('../utils/response');

async function getCompany(req, res, next) {
  try { return success(res, await service.getCompanyInfo(), 'Company info'); }
  catch (err) { next(err); }
}
async function updateCompany(req, res, next) {
  try { return success(res, await service.updateCompanyInfo(req.body), 'Company info updated'); }
  catch (err) { next(err); }
}
async function getPublicSettings(req, res, next) {
  try { return success(res, await service.getPublicSettings(), 'Public settings'); }
  catch (err) { next(err); }
}
async function getAllSettings(req, res, next) {
  try { return success(res, await service.getAllSettings(), 'All settings'); }
  catch (err) { next(err); }
}
async function upsertSetting(req, res, next) {
  try {
    const { key } = req.params;
    const { value, category, description, isPublic } = req.body;
    return success(res, await service.upsertSetting(key, value, { category, description, isPublic }), 'Setting updated');
  } catch (err) { next(err); }
}
async function getSeo(req, res, next) {
  try { return success(res, await service.getSeo(req.params.slug), 'SEO data'); }
  catch (err) { next(err); }
}
async function listSeo(req, res, next) {
  try { return success(res, await service.listSeo(), 'SEO list'); }
  catch (err) { next(err); }
}
async function upsertSeo(req, res, next) {
  try { return success(res, await service.upsertSeo(req.params.slug, req.body), 'SEO updated'); }
  catch (err) { next(err); }
}

module.exports = { getCompany, updateCompany, getPublicSettings, getAllSettings, upsertSetting, getSeo, listSeo, upsertSeo };