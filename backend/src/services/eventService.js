// backend/src/services/eventService.js
const db = require('../database');
const { NotFoundError, BadRequestError, ConflictError } = require('../utils/errors');
const { getPagination, getSorting } = require('../utils/pagination');
const { uniqueSlug } = require('../utils/slugify');

const ALLOWED_SORT = ['start_date', 'created_at', 'title'];

async function listPublic(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'start_date', 'ASC');
  const conditions = [`status = 'published'`];
  const values = [];
  let i = 1;
  if (query.category) { conditions.push(`category = $${i++}`); values.push(query.category); }
  if (query.upcoming === 'true') conditions.push(`start_date >= NOW()`);
  if (query.past === 'true') conditions.push(`start_date < NOW()`);
  if (query.search) { conditions.push(`title ILIKE $${i++}`); values.push(`%${query.search}%`); }

  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM events ${where}`, values);
  const rows = await db.queryMany(
    `SELECT id, slug, title, description, category, start_date, end_date, location,
            is_virtual, meeting_url, capacity, registered_count, price, currency, image_url, featured
     FROM events ${where} ORDER BY ${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );
  return { items: rows.map(formatEvent), pagination: { page, limit, total: count.count } };
}

async function getBySlug(slug) {
  const e = await db.queryOne(`SELECT * FROM events WHERE slug = $1 AND status = 'published'`, [slug]);
  if (!e) throw new NotFoundError('Event not found');
  const speakers = await db.queryMany(`SELECT * FROM event_speakers WHERE event_id = $1`, [e.id]);
  return { ...formatEventDetail(e), speakers: speakers.map((s) => ({ id: s.id, name: s.name, bio: s.bio, imageUrl: s.image_url, company: s.company, position: s.position })) };
}

async function register(eventId, data) {
  const event = await db.queryOne(`SELECT id, capacity, registered_count, status FROM events WHERE id = $1`, [eventId]);
  if (!event) throw new NotFoundError('Event not found');
  if (event.status !== 'published') throw new BadRequestError('Event is not open for registration');
  if (event.capacity && event.registered_count >= event.capacity) throw new ConflictError('Event is full');

  const existing = data.userId
    ? await db.queryOne(`SELECT id FROM event_registrations WHERE event_id = $1 AND user_id = $2`, [eventId, data.userId])
    : null;
  if (existing) throw new ConflictError('You are already registered for this event');

  const r = await db.queryOne(
    `INSERT INTO event_registrations (event_id, user_id, name, email, phone, status) VALUES ($1,$2,$3,$4,$5,'registered') RETURNING *`,
    [eventId, data.userId || null, data.name, data.email, data.phone || null]
  );
  await db.query(`UPDATE events SET registered_count = registered_count + 1 WHERE id = $1`, [eventId]);
  return { id: r.id, status: r.status, message: 'Registered successfully' };
}

async function listAdmin(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'start_date', 'DESC');
  const conditions = ['1=1'];
  const values = [];
  let i = 1;
  if (query.status) { conditions.push(`status = $${i++}`); values.push(query.status); }
  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM events ${where}`, values);
  const rows = await db.queryMany(`SELECT * FROM events ${where} ORDER BY ${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`, [...values, limit, offset]);
  return { items: rows.map(formatEventDetail), pagination: { page, limit, total: count.count } };
}

async function create(data) {
  const slug = await uniqueSlug(data.slug || data.title, async (s) => !!(await db.queryOne('SELECT id FROM events WHERE slug = $1', [s])));
  const r = await db.queryOne(
    `INSERT INTO events (slug, title, description, category, start_date, end_date, location, is_virtual, meeting_url,
      capacity, price, currency, image_url, speakers, agenda, status, featured)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
    [slug, data.title, data.description || null, data.category || null, data.startDate, data.endDate || null, data.location || null, data.isVirtual || false, data.meetingUrl || null, data.capacity || null, data.price || 0, data.currency || 'RWF', data.imageUrl || null, JSON.stringify(data.speakers || []), JSON.stringify(data.agenda || []), data.status || 'draft', data.featured || false]
  );
  return formatEventDetail(r);
}

async function update(id, data) {
  const map = { title: 'title', description: 'description', category: 'category', startDate: 'start_date', endDate: 'end_date', location: 'location', isVirtual: 'is_virtual', meetingUrl: 'meeting_url', capacity: 'capacity', price: 'price', currency: 'currency', imageUrl: 'image_url', status: 'status', featured: 'featured' };
  const fields = [];
  const values = [];
  let i = 1;
  for (const [k, col] of Object.entries(map)) { if (data[k] !== undefined) { fields.push(`${col} = $${i++}`); values.push(data[k]); } }
  if (data.speakers !== undefined) { fields.push(`speakers = $${i++}`); values.push(JSON.stringify(data.speakers)); }
  if (data.agenda !== undefined) { fields.push(`agenda = $${i++}`); values.push(JSON.stringify(data.agenda)); }
  if (!fields.length) { const r = await db.queryOne(`SELECT * FROM events WHERE id = $1`, [id]); if (!r) throw new NotFoundError('Event not found'); return formatEventDetail(r); }
  values.push(id);
  const r = await db.queryOne(`UPDATE events SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
  if (!r) throw new NotFoundError('Event not found');
  return formatEventDetail(r);
}

async function remove(id) {
  const r = await db.queryOne(`DELETE FROM events WHERE id = $1 RETURNING id`, [id]);
  if (!r) throw new NotFoundError('Event not found');
  return { message: 'Event deleted' };
}

async function listRegistrations(eventId) {
  const rows = await db.queryMany(`SELECT * FROM event_registrations WHERE event_id = $1 ORDER BY registered_at DESC`, [eventId]);
  return rows.map((r) => ({ id: r.id, name: r.name, email: r.email, phone: r.phone, status: r.status, registeredAt: r.registered_at, checkedInAt: r.checked_in_at }));
}

function formatEvent(r) {
  return { id: r.id, slug: r.slug, title: r.title, description: r.description, category: r.category, startDate: r.start_date, endDate: r.end_date, location: r.location, isVirtual: r.is_virtual, meetingUrl: r.meeting_url, capacity: r.capacity, registeredCount: r.registered_count, price: r.price, currency: r.currency, imageUrl: r.image_url, featured: r.featured };
}
function formatEventDetail(r) { return { ...formatEvent(r), speakers: r.speakers, agenda: r.agenda, status: r.status, createdAt: r.created_at }; }

module.exports = { listPublic, getBySlug, register, listAdmin, create, update, remove, listRegistrations };