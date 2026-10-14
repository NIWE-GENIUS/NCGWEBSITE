// src/controllers/navigationController.js
const service = require('../services/navigationService');
const { success, created } = require('../utils/response');

// ============================================================
// NAVIGATION
// ============================================================
async function getNav(req, res, next) {
  try {
    const location = req.query.location || 'header';
    return success(res, await service.getNavigation(location), 'Navigation retrieved');
  } catch (err) { next(err); }
}

async function listNavAdmin(req, res, next) {
  try {
    return success(res, await service.listNavigationAdmin(req.query.location), 'Navigation list');
  } catch (err) { next(err); }
}

async function createNav(req, res, next) {
  try {
    return created(res, await service.createNav(req.body), 'Navigation item created');
  } catch (err) { next(err); }
}

async function updateNav(req, res, next) {
  try {
    return success(res, await service.updateNav(req.params.id, req.body), 'Navigation item updated');
  } catch (err) { next(err); }
}

async function deleteNav(req, res, next) {
  try {
    const r = await service.deleteNav(req.params.id);
    return success(res, r, r.message);
  } catch (err) { next(err); }
}

// ============================================================
// FOOTER LINKS
// ============================================================
async function getFooter(req, res, next) {
  try {
    return success(res, await service.getFooterLinks(), 'Footer links retrieved');
  } catch (err) { next(err); }
}

async function listFooterAdmin(req, res, next) {
  try {
    return success(res, await service.listFooterAdmin(), 'Footer list');
  } catch (err) { next(err); }
}

async function createFooter(req, res, next) {
  try {
    return created(res, await service.createFooterLink(req.body), 'Footer link created');
  } catch (err) { next(err); }
}

async function updateFooter(req, res, next) {
  try {
    return success(res, await service.updateFooterLink(req.params.id, req.body), 'Footer link updated');
  } catch (err) { next(err); }
}

async function deleteFooter(req, res, next) {
  try {
    const r = await service.deleteFooterLink(req.params.id);
    return success(res, r, r.message);
  } catch (err) { next(err); }
}

// ============================================================
// LEGAL PAGES
// ============================================================
async function listLegal(req, res, next) {
  try {
    return success(res, await service.listLegal(), 'Legal pages retrieved');
  } catch (err) { next(err); }
}

async function getLegal(req, res, next) {
  try {
    return success(res, await service.getLegal(req.params.slug), 'Legal page retrieved');
  } catch (err) { next(err); }
}

async function upsertLegal(req, res, next) {
  try {
    return success(
      res,
      await service.upsertLegal(req.params.slug, req.body, req.user.id),
      'Legal page updated'
    );
  } catch (err) { next(err); }
}

module.exports = {
  // Navigation
  getNav,
  listNavAdmin,
  createNav,
  updateNav,
  deleteNav,
  // Footer
  getFooter,
  listFooterAdmin,
  createFooter,
  updateFooter,
  deleteFooter,
  // Legal
  listLegal,
  getLegal,
  upsertLegal,
};