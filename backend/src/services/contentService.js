// backend/src/services/contentService.js
const db = require('../database');
const { NotFoundError } = require('../utils/errors');
const { getPagination } = require('../utils/pagination');

// ============================================================
// TESTIMONIALS
// ============================================================
async function listTestimonials(query = {}) {
  const conditions = ['published = TRUE'];
  const values = [];
  if (query.featured === 'true') conditions.push(`featured = TRUE`);
  const where = 'WHERE ' + conditions.join(' AND ');
  const rows = await db.queryMany(
    `SELECT id, name, position, company, content, rating, image_url, featured, display_order
     FROM testimonials ${where} ORDER BY display_order LIMIT 50`,
    values
  );
  return rows.map(formatTestimonial);
}

async function listTestimonialsAdmin(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM testimonials`);
  const rows = await db.queryMany(`SELECT * FROM testimonials ORDER BY display_order LIMIT $1 OFFSET $2`, [limit, offset]);
  return { items: rows.map(formatTestimonial), pagination: { page, limit, total: count.count } };
}

async function createTestimonial(data) {
  const r = await db.queryOne(
    `INSERT INTO testimonials (name, position, company, content, rating, image_url, featured, display_order, published)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [data.name, data.position || null, data.company || null, data.content, data.rating || 5, data.imageUrl || null, data.featured || false, data.displayOrder || 0, data.published !== false]
  );
  return formatTestimonial(r);
}

async function updateTestimonial(id, data) {
  const map = { name: 'name', position: 'position', company: 'company', content: 'content', rating: 'rating', imageUrl: 'image_url', featured: 'featured', displayOrder: 'display_order', published: 'published' };
  const fields = [];
  const values = [];
  let i = 1;
  for (const [k, col] of Object.entries(map)) { if (data[k] !== undefined) { fields.push(`${col} = $${i++}`); values.push(data[k]); } }
  if (!fields.length) { const r = await db.queryOne(`SELECT * FROM testimonials WHERE id = $1`, [id]); return r ? formatTestimonial(r) : null; }
  values.push(id);
  const r = await db.queryOne(`UPDATE testimonials SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
  if (!r) throw new NotFoundError('Testimonial not found');
  return formatTestimonial(r);
}

async function deleteTestimonial(id) {
  await db.query(`DELETE FROM testimonials WHERE id = $1`, [id]);
  return { message: 'Deleted' };
}

function formatTestimonial(r) {
  return { id: r.id, name: r.name, position: r.position, company: r.company, content: r.content, rating: r.rating, imageUrl: r.image_url, featured: r.featured, displayOrder: r.display_order, published: r.published };
}

// ============================================================
// FAQS
// ============================================================
async function listFaqs(query = {}) {
  const conditions = ['published = TRUE'];
  const values = [];
  let i = 1;
  if (query.category) { conditions.push(`category = $${i++}`); values.push(query.category); }
  const where = 'WHERE ' + conditions.join(' AND ');
  const rows = await db.queryMany(`SELECT id, question, answer, category, display_order FROM faqs ${where} ORDER BY display_order LIMIT 100`, values);
  return rows.map(formatFaq);
}

async function listFaqsAdmin(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM faqs`);
  const rows = await db.queryMany(`SELECT * FROM faqs ORDER BY display_order LIMIT $1 OFFSET $2`, [limit, offset]);
  return { items: rows.map(formatFaq), pagination: { page, limit, total: count.count } };
}

async function createFaq(data) {
  const r = await db.queryOne(
    `INSERT INTO faqs (question, answer, category, display_order, published) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [data.question, data.answer, data.category || null, data.displayOrder || 0, data.published !== false]
  );
  return formatFaq(r);
}

async function updateFaq(id, data) {
  const map = { question: 'question', answer: 'answer', category: 'category', displayOrder: 'display_order', published: 'published' };
  const fields = [];
  const values = [];
  let i = 1;
  for (const [k, col] of Object.entries(map)) { if (data[k] !== undefined) { fields.push(`${col} = $${i++}`); values.push(data[k]); } }
  if (!fields.length) { const r = await db.queryOne(`SELECT * FROM faqs WHERE id = $1`, [id]); return r ? formatFaq(r) : null; }
  values.push(id);
  const r = await db.queryOne(`UPDATE faqs SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
  if (!r) throw new NotFoundError('FAQ not found');
  return formatFaq(r);
}

async function deleteFaq(id) {
  await db.query(`DELETE FROM faqs WHERE id = $1`, [id]);
  return { message: 'Deleted' };
}

function formatFaq(r) { return { id: r.id, question: r.question, answer: r.answer, category: r.category, displayOrder: r.display_order, published: r.published }; }

// ============================================================
// GALLERY
// ============================================================
async function listGallery(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const conditions = ['published = TRUE'];
  const values = [];
  let i = 1;
  if (query.category) { conditions.push(`category = $${i++}`); values.push(query.category); }
  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM gallery ${where}`, values);
  const rows = await db.queryMany(`SELECT * FROM gallery ${where} ORDER BY display_order LIMIT $${i} OFFSET $${i + 1}`, [...values, limit, offset]);
  return { items: rows.map(formatGallery), pagination: { page, limit, total: count.count } };
}

async function createGallery(data) {
  const r = await db.queryOne(
    `INSERT INTO gallery (title, description, image_url, thumbnail_url, category, tags, alt_text, display_order, published)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [data.title || null, data.description || null, data.imageUrl, data.thumbnailUrl || null, data.category || null, JSON.stringify(data.tags || []), data.altText || null, data.displayOrder || 0, data.published !== false]
  );
  return formatGallery(r);
}

async function updateGallery(id, data) {
  const map = { title: 'title', description: 'description', imageUrl: 'image_url', thumbnailUrl: 'thumbnail_url', category: 'category', altText: 'alt_text', displayOrder: 'display_order', published: 'published' };
  const fields = [];
  const values = [];
  let i = 1;
  for (const [k, col] of Object.entries(map)) { if (data[k] !== undefined) { fields.push(`${col} = $${i++}`); values.push(data[k]); } }
  if (data.tags) { fields.push(`tags = $${i++}`); values.push(JSON.stringify(data.tags)); }
  if (!fields.length) { const r = await db.queryOne(`SELECT * FROM gallery WHERE id = $1`, [id]); return r ? formatGallery(r) : null; }
  values.push(id);
  const r = await db.queryOne(`UPDATE gallery SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
  if (!r) throw new NotFoundError('Gallery item not found');
  return formatGallery(r);
}

async function deleteGallery(id) {
  await db.query(`DELETE FROM gallery WHERE id = $1`, [id]);
  return { message: 'Deleted' };
}

function formatGallery(r) { return { id: r.id, title: r.title, description: r.description, imageUrl: r.image_url, thumbnailUrl: r.thumbnail_url, category: r.category, tags: r.tags, altText: r.alt_text, displayOrder: r.display_order, published: r.published, createdAt: r.created_at }; }

module.exports = {
  listTestimonials, listTestimonialsAdmin, createTestimonial, updateTestimonial, deleteTestimonial,
  listFaqs, listFaqsAdmin, createFaq, updateFaq, deleteFaq,
  listGallery, createGallery, updateGallery, deleteGallery,
};