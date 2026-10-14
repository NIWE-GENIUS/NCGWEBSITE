// backend/src/services/partnershipService.js
const db = require('../database');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/errors');
const { getPagination, getSorting } = require('../utils/pagination');
const { uniqueSlug } = require('../utils/slugify');

const ALLOWED_SORT = ['display_order', 'created_at', 'name'];
const APP_STATUSES = ['submitted', 'under_review', 'meeting_scheduled', 'approved', 'rejected', 'withdrawn'];

// ============================================================
// PUBLIC — LIST PARTNERS
// ============================================================
async function listPublic(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'display_order', 'ASC');

  const conditions = [`status = 'active'`];
  const values = [];
  let i = 1;
  if (query.type) { conditions.push(`type = $${i++}`); values.push(query.type); }
  if (query.featured === 'true') conditions.push(`featured = TRUE`);

  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM partners ${where}`, values);
  const rows = await db.queryMany(
    `SELECT id, name, slug, type, logo_url, website, description, country, industry, featured, display_order
     FROM partners ${where} ORDER BY ${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );
  return { items: rows.map(formatPartner), pagination: { page, limit, total: count.count } };
}

async function getBySlug(slug) {
  const p = await db.queryOne(`SELECT * FROM partners WHERE slug = $1`, [slug]);
  if (!p) throw new NotFoundError('Partner not found');
  return formatPartnerDetail(p);
}

// ============================================================
// PUBLIC — SUBMIT APPLICATION
// ============================================================
async function submitApplication(data) {
  const result = await db.queryOne(
    `INSERT INTO partnership_applications (
      organization_name, organization_type, contact_name, contact_email, contact_phone,
      contact_position, website, area_of_collaboration, partnership_type, proposal,
      expected_outcome, documents, status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'submitted')
    RETURNING id, application_id, status, created_at`,
    [
      data.organizationName, data.organizationType || null, data.contactName, data.contactEmail,
      data.contactPhone || null, data.contactPosition || null, data.website || null,
      JSON.stringify(data.areaOfCollaboration || []), data.partnershipType || null,
      data.proposal || null, data.expectedOutcome || null,
      JSON.stringify(data.documents || []),
    ]
  );
  return {
    id: result.id, applicationId: result.application_id,
    status: result.status, message: 'Partnership application submitted',
  };
}

// ============================================================
// ADMIN — Partners CRUD
// ============================================================
async function listAdmin(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'display_order', 'ASC');

  const conditions = ['1=1'];
  const values = [];
  let i = 1;
  if (query.status) { conditions.push(`status = $${i++}`); values.push(query.status); }
  if (query.type) { conditions.push(`type = $${i++}`); values.push(query.type); }
  if (query.search) { conditions.push(`name ILIKE $${i++}`); values.push(`%${query.search}%`); }

  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM partners ${where}`, values);
  const rows = await db.queryMany(
    `SELECT * FROM partners ${where} ORDER BY ${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );
  return { items: rows.map(formatPartnerDetail), pagination: { page, limit, total: count.count } };
}

async function getById(id) {
  const p = await db.queryOne(`SELECT * FROM partners WHERE id = $1`, [id]);
  if (!p) throw new NotFoundError('Partner not found');
  return formatPartnerDetail(p);
}

async function create(data) {
  const slug = await uniqueSlug(
    data.slug || data.name,
    async (s) => !!(await db.queryOne('SELECT id FROM partners WHERE slug = $1', [s]))
  );
  const r = await db.queryOne(
    `INSERT INTO partners (name, slug, type, logo_url, website, description, country, industry,
      partnership_type, status, featured, display_order, partnership_start_date, partnership_end_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
    [
      data.name, slug, data.type || 'corporate', data.logoUrl || null, data.website || null,
      data.description || null, data.country || null, data.industry || null,
      data.partnershipType || null, data.status || 'prospect', data.featured || false,
      data.displayOrder || 0, data.partnershipStartDate || null, data.partnershipEndDate || null,
    ]
  );
  return formatPartnerDetail(r);
}

async function update(id, data) {
  const map = {
    name: 'name', type: 'type', logoUrl: 'logo_url', website: 'website',
    description: 'description', country: 'country', industry: 'industry',
    partnershipType: 'partnership_type', status: 'status', featured: 'featured',
    displayOrder: 'display_order', partnershipStartDate: 'partnership_start_date',
    partnershipEndDate: 'partnership_end_date',
  };
  const fields = [];
  const values = [];
  let i = 1;
  for (const [k, col] of Object.entries(map)) {
    if (data[k] !== undefined) { fields.push(`${col} = $${i++}`); values.push(data[k]); }
  }
  if (!fields.length) return getById(id);
  values.push(id);
  const r = await db.queryOne(
    `UPDATE partners SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
    values
  );
  if (!r) throw new NotFoundError('Partner not found');
  return formatPartnerDetail(r);
}

async function remove(id) {
  const r = await db.queryOne(`DELETE FROM partners WHERE id = $1 RETURNING id`, [id]);
  if (!r) throw new NotFoundError('Partner not found');
  return { message: 'Partner deleted' };
}

// ============================================================
// ADMIN — Applications
// ============================================================
async function listApplications(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const conditions = ['1=1'];
  const values = [];
  let i = 1;
  if (query.status) { conditions.push(`status = $${i++}`); values.push(query.status); }
  if (query.search) { conditions.push(`organization_name ILIKE $${i++}`); values.push(`%${query.search}%`); }

  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM partnership_applications ${where}`, values);
  const rows = await db.queryMany(
    `SELECT * FROM partnership_applications ${where} ORDER BY created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );
  return { items: rows.map(formatApp), pagination: { page, limit, total: count.count } };
}

async function getApplication(id) {
  const r = await db.queryOne(`SELECT * FROM partnership_applications WHERE id = $1`, [id]);
  if (!r) throw new NotFoundError('Application not found');
  return formatApp(r);
}

async function reviewApplication(id, { adminId, status, notes }) {
  if (!APP_STATUSES.includes(status)) throw new BadRequestError('Invalid status');
  const r = await db.queryOne(
    `UPDATE partnership_applications SET status = $1, reviewed_by = $2, reviewed_at = NOW(), decision_notes = $3
     WHERE id = $4 RETURNING *`,
    [status, adminId, notes || null, id]
  );
  if (!r) throw new NotFoundError('Application not found');
  return formatApp(r);
}

function formatPartner(r) {
  return {
    id: r.id, name: r.name, slug: r.slug, type: r.type, logoUrl: r.logo_url,
    website: r.website, description: r.description, country: r.country,
    industry: r.industry, featured: r.featured, displayOrder: r.display_order,
  };
}

function formatPartnerDetail(r) {
  return {
    ...formatPartner(r),
    partnershipType: r.partnership_type, status: r.status,
    partnershipStartDate: r.partnership_start_date, partnershipEndDate: r.partnership_end_date,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

function formatApp(r) {
  return {
    id: r.id, applicationId: r.application_id,
    organizationName: r.organization_name, organizationType: r.organization_type,
    contactName: r.contact_name, contactEmail: r.contact_email,
    contactPhone: r.contact_phone, contactPosition: r.contact_position,
    website: r.website, areaOfCollaboration: r.area_of_collaboration,
    partnershipType: r.partnership_type, proposal: r.proposal,
    expectedOutcome: r.expected_outcome, documents: r.documents,
    status: r.status, reviewedAt: r.reviewed_at, decisionNotes: r.decision_notes,
    createdAt: r.created_at,
  };
}

module.exports = {
  listPublic, getBySlug, submitApplication,
  listAdmin, getById, create, update, remove,
  listApplications, getApplication, reviewApplication,
};