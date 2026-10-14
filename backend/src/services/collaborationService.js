// backend/src/services/collaborationService.js
const db = require('../database');
const { NotFoundError, BadRequestError } = require('../utils/errors');
const { getPagination, getSorting } = require('../utils/pagination');
const { uniqueSlug } = require('../utils/slugify');

const ALLOWED_SORT = ['created_at', 'start_date', 'title'];

async function listPublic(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'created_at', 'DESC');
  const conditions = [`status IN ('active','completed')`];
  const values = [];
  let i = 1;
  if (query.type) { conditions.push(`type = $${i++}`); values.push(query.type); }
  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM collaborations ${where}`, values);
  const rows = await db.queryMany(
    `SELECT id, slug, title, type, description, status, start_date, end_date FROM collaborations
     ${where} ORDER BY ${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );
  return { items: rows.map(formatCollab), pagination: { page, limit, total: count.count } };
}

async function getBySlug(slug) {
  const c = await db.queryOne(`SELECT * FROM collaborations WHERE slug = $1`, [slug]);
  if (!c) throw new NotFoundError('Collaboration not found');
  const updates = await db.queryMany(`SELECT * FROM collaboration_updates WHERE collaboration_id = $1 ORDER BY created_at DESC`, [c.id]);
  return { ...formatCollabDetail(c), updates: updates.map((u) => ({ id: u.id, title: u.title, description: u.description, progress: u.progress, createdAt: u.created_at })) };
}

async function submitRequest(data) {
  const r = await db.queryOne(
    `INSERT INTO collaboration_requests (title, description, collaboration_type, requester_name, requester_email, requester_phone, organization, proposal, expected_outcome, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'submitted') RETURNING id, request_id, status, created_at`,
    [data.title, data.description, data.collaborationType || null, data.requesterName, data.requesterEmail, data.requesterPhone || null, data.organization || null, data.proposal || null, data.expectedOutcome || null]
  );
  return { id: r.id, requestId: r.request_id, status: r.status, message: 'Collaboration request submitted' };
}

async function listAdmin(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const conditions = ['1=1'];
  const values = [];
  let i = 1;
  if (query.status) { conditions.push(`status = $${i++}`); values.push(query.status); }
  if (query.search) { conditions.push(`title ILIKE $${i++}`); values.push(`%${query.search}%`); }
  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM collaborations ${where}`, values);
  const rows = await db.queryMany(`SELECT * FROM collaborations ${where} ORDER BY created_at DESC LIMIT $${i} OFFSET $${i + 1}`, [...values, limit, offset]);
  return { items: rows.map(formatCollabDetail), pagination: { page, limit, total: count.count } };
}

async function create(data) {
  const slug = await uniqueSlug(data.slug || data.title, async (s) => !!(await db.queryOne('SELECT id FROM collaborations WHERE slug = $1', [s])));
  const r = await db.queryOne(
    `INSERT INTO collaborations (slug, title, type, description, status, start_date, end_date, lead_contact, team, milestones, documents)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [slug, data.title, data.type || null, data.description || null, data.status || 'proposed', data.startDate || null, data.endDate || null, data.leadContact || null, JSON.stringify(data.team || []), JSON.stringify(data.milestones || []), JSON.stringify(data.documents || [])]
  );
  return formatCollabDetail(r);
}

async function update(id, data) {
  const map = { title: 'title', type: 'type', description: 'description', status: 'status', startDate: 'start_date', endDate: 'end_date', leadContact: 'lead_contact' };
  const fields = [];
  const values = [];
  let i = 1;
  for (const [k, col] of Object.entries(map)) { if (data[k] !== undefined) { fields.push(`${col} = $${i++}`); values.push(data[k]); } }
  if (data.team) { fields.push(`team = $${i++}`); values.push(JSON.stringify(data.team)); }
  if (!fields.length) { const r = await db.queryOne(`SELECT * FROM collaborations WHERE id = $1`, [id]); if (!r) throw new NotFoundError('Not found'); return formatCollabDetail(r); }
  values.push(id);
  const r = await db.queryOne(`UPDATE collaborations SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
  if (!r) throw new NotFoundError('Not found');
  return formatCollabDetail(r);
}

async function remove(id) {
  const r = await db.queryOne(`DELETE FROM collaborations WHERE id = $1 RETURNING id`, [id]);
  if (!r) throw new NotFoundError('Not found');
  return { message: 'Collaboration deleted' };
}

async function listRequests(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const conditions = ['1=1'];
  const values = [];
  let i = 1;
  if (query.status) { conditions.push(`status = $${i++}`); values.push(query.status); }
  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM collaboration_requests ${where}`, values);
  const rows = await db.queryMany(`SELECT * FROM collaboration_requests ${where} ORDER BY created_at DESC LIMIT $${i} OFFSET $${i + 1}`, [...values, limit, offset]);
  return { items: rows.map(formatRequest), pagination: { page, limit, total: count.count } };
}

async function reviewRequest(id, { adminId, status }) {
  const r = await db.queryOne(`UPDATE collaboration_requests SET status = $1, assigned_to = $2, reviewed_at = NOW() WHERE id = $3 RETURNING *`, [status, adminId, id]);
  if (!r) throw new NotFoundError('Request not found');
  return formatRequest(r);
}

function formatCollab(r) { return { id: r.id, slug: r.slug, title: r.title, type: r.type, description: r.description, status: r.status, startDate: r.start_date, endDate: r.end_date }; }
function formatCollabDetail(r) { return { ...formatCollab(r), leadContact: r.lead_contact, team: r.team, milestones: r.milestones, documents: r.documents, createdAt: r.created_at }; }
function formatRequest(r) { return { id: r.id, requestId: r.request_id, title: r.title, description: r.description, collaborationType: r.collaboration_type, requesterName: r.requester_name, requesterEmail: r.requester_email, requesterPhone: r.requester_phone, organization: r.organization, proposal: r.proposal, expectedOutcome: r.expected_outcome, status: r.status, reviewedAt: r.reviewed_at, createdAt: r.created_at }; }

module.exports = { listPublic, getBySlug, submitRequest, listAdmin, create, update, remove, listRequests, reviewRequest };