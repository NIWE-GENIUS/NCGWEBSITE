// backend/src/routes/content.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contentController');
const { requireAuth } = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { body, param } = require('express-validator');

const idV = [param('id').isUUID()];

// ============================================================
// PUBLIC
// ============================================================
router.get('/testimonials', ctrl.listTestimonials);
router.get('/faqs', ctrl.listFaqs);
router.get('/gallery', ctrl.listGallery);

// ============================================================
// ADMIN — Testimonials
// ============================================================
router.get('/admin/testimonials', requireAuth, authorize('admin', 'super_admin'), ctrl.listTestimonialsAdmin);
router.post('/admin/testimonials', requireAuth, authorize('admin', 'super_admin'), [body('name').trim().notEmpty(), body('content').trim().notEmpty()], validate, ctrl.createTestimonial);
router.put('/admin/testimonials/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.updateTestimonial);
router.delete('/admin/testimonials/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.deleteTestimonial);

// ADMIN — FAQs
router.get('/admin/faqs', requireAuth, authorize('admin', 'super_admin'), ctrl.listFaqsAdmin);
router.post('/admin/faqs', requireAuth, authorize('admin', 'super_admin'), [body('question').trim().notEmpty(), body('answer').trim().notEmpty()], validate, ctrl.createFaq);
router.put('/admin/faqs/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.updateFaq);
router.delete('/admin/faqs/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.deleteFaq);

// ADMIN — Gallery
router.post('/admin/gallery', requireAuth, authorize('admin', 'super_admin'), [body('imageUrl').trim().notEmpty()], validate, ctrl.createGallery);
router.put('/admin/gallery/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.updateGallery);
router.delete('/admin/gallery/:id', requireAuth, authorize('admin', 'super_admin'), idV, validate, ctrl.deleteGallery);

module.exports = router;