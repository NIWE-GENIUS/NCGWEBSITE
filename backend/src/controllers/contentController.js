// backend/src/controllers/contentController.js
const service = require('../services/contentService');
const { success, created, paginated } = require('../utils/response');

// Testimonials
async function listTestimonials(req, res, next) {
  try { return success(res, await service.listTestimonials(req.query), 'Testimonials'); }
  catch (err) { next(err); }
}
async function listTestimonialsAdmin(req, res, next) {
  try { const { items, pagination } = await service.listTestimonialsAdmin(req.query); return paginated(res, items, pagination); }
  catch (err) { next(err); }
}
async function createTestimonial(req, res, next) {
  try { return created(res, await service.createTestimonial(req.body), 'Created'); }
  catch (err) { next(err); }
}
async function updateTestimonial(req, res, next) {
  try { return success(res, await service.updateTestimonial(req.params.id, req.body), 'Updated'); }
  catch (err) { next(err); }
}
async function deleteTestimonial(req, res, next) {
  try { const r = await service.deleteTestimonial(req.params.id); return success(res, r, r.message); }
  catch (err) { next(err); }
}

// FAQs
async function listFaqs(req, res, next) {
  try { return success(res, await service.listFaqs(req.query), 'FAQs'); }
  catch (err) { next(err); }
}
async function listFaqsAdmin(req, res, next) {
  try { const { items, pagination } = await service.listFaqsAdmin(req.query); return paginated(res, items, pagination); }
  catch (err) { next(err); }
}
async function createFaq(req, res, next) {
  try { return created(res, await service.createFaq(req.body), 'Created'); }
  catch (err) { next(err); }
}
async function updateFaq(req, res, next) {
  try { return success(res, await service.updateFaq(req.params.id, req.body), 'Updated'); }
  catch (err) { next(err); }
}
async function deleteFaq(req, res, next) {
  try { const r = await service.deleteFaq(req.params.id); return success(res, r, r.message); }
  catch (err) { next(err); }
}

// Gallery
async function listGallery(req, res, next) {
  try { const { items, pagination } = await service.listGallery(req.query); return paginated(res, items, pagination); }
  catch (err) { next(err); }
}
async function createGallery(req, res, next) {
  try { return created(res, await service.createGallery(req.body), 'Created'); }
  catch (err) { next(err); }
}
async function updateGallery(req, res, next) {
  try { return success(res, await service.updateGallery(req.params.id, req.body), 'Updated'); }
  catch (err) { next(err); }
}
async function deleteGallery(req, res, next) {
  try { const r = await service.deleteGallery(req.params.id); return success(res, r, r.message); }
  catch (err) { next(err); }
}

module.exports = {
  listTestimonials, listTestimonialsAdmin, createTestimonial, updateTestimonial, deleteTestimonial,
  listFaqs, listFaqsAdmin, createFaq, updateFaq, deleteFaq,
  listGallery, createGallery, updateGallery, deleteGallery,
};