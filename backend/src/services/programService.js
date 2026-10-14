// backend/src/services/programService.js
const db = require('../database');
const { NotFoundError, BadRequestError } = require('../utils/errors');
const { getPagination, getSorting } = require('../utils/pagination');
const { uniqueSlug } = require('../utils/slugify');

const ALLOWED_SORT = ['display_order', 'created_at', 'name', 'price'];

// ============================================================
// PUBLIC — LIST PUBLISHED PROGRAMS
// ============================================================
async function listPublic(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'display_order', 'ASC');

  const conditions = ['published = TRUE'];
  const values = [];
  let i = 1;

  if (query.category) { conditions.push(`category = $${i++}`); values.push(query.category); }
  if (query.format) { conditions.push(`format = $${i++}`); values.push(query.format); }
  if (query.level) { conditions.push(`level = $${i++}`); values.push(query.level); }
  if (query.featured === 'true') conditions.push(`featured = TRUE`);
  if (query.registrationOpen === 'true') conditions.push(`registration_open = TRUE`);
  if (query.search) {
    conditions.push(`(name ILIKE $${i} OR tagline ILIKE $${i} OR description_short ILIKE $${i})`);
    values.push(`%${query.search}%`); i++;
  }

  const where = 'WHERE ' + conditions.join(' AND ');

  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM programs ${where}`, values);
  const rows = await db.queryMany(
    `SELECT id, slug, name, tagline, category, description_short, duration, format, level,
            price, currency, capacity, certificate_available, registration_open,
            registration_deadline, image_url, icon, featured, display_order, created_at
     FROM programs ${where} ORDER BY ${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return {
    items: rows.map(formatProgram),
    pagination: { page, limit, total: count.count },
  };
}

// ============================================================
// PUBLIC — GET BY SLUG (with tracks, cohorts, modules)
// ============================================================
async function getBySlug(slug) {
  const program = await db.queryOne(
    `SELECT * FROM programs WHERE slug = $1 AND published = TRUE`,
    [slug]
  );
  if (!program) throw new NotFoundError('Program not found');

  const [tracks, cohorts] = await Promise.all([
    db.queryMany(`SELECT * FROM program_tracks WHERE program_id = $1 ORDER BY display_order`, [program.id]),
    db.queryMany(`SELECT * FROM program_cohorts WHERE program_id = $1 ORDER BY start_date DESC`, [program.id]),
  ]);

  const trackIds = tracks.map((t) => t.id);
  let modules = [];
  if (trackIds.length > 0) {
    modules = await db.queryMany(
      `SELECT * FROM program_modules WHERE track_id = ANY($1::uuid[]) ORDER BY display_order`,
      [trackIds]
    );
  }

  return {
    ...formatProgramDetail(program),
    tracks: tracks.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      duration: t.duration,
      modules: modules.filter((m) => m.track_id === t.id).map(formatModule),
      displayOrder: t.display_order,
    })),
    cohorts: cohorts.map(formatCohort),
  };
}

// ============================================================
// ADMIN — LIST ALL
// ============================================================
async function listAdmin(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'display_order', 'ASC');

  const conditions = ['1=1'];
  const values = [];
  let i = 1;

  if (query.published === 'true' || query.published === 'false') {
    conditions.push(`published = $${i++}`); values.push(query.published === 'true');
  }
  if (query.category) { conditions.push(`category = $${i++}`); values.push(query.category); }
  if (query.search) {
    conditions.push(`name ILIKE $${i++}`); values.push(`%${query.search}%`);
  }

  const where = 'WHERE ' + conditions.join(' AND ');

  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM programs ${where}`, values);
  const rows = await db.queryMany(
    `SELECT * FROM programs ${where} ORDER BY ${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return {
    items: rows.map(formatProgramDetail),
    pagination: { page, limit, total: count.count },
  };
}

// ============================================================
// ADMIN — GET BY ID
// ============================================================
async function getById(id) {
  const program = await db.queryOne(`SELECT * FROM programs WHERE id = $1`, [id]);
  if (!program) throw new NotFoundError('Program not found');
  return formatProgramDetail(program);
}

// ============================================================
// ADMIN — CREATE
// ============================================================
async function create(data) {
  const slug = await uniqueSlug(
    data.slug || data.name,
    async (s) => !!(await db.queryOne('SELECT id FROM programs WHERE slug = $1', [s]))
  );

  const result = await db.queryOne(
    `INSERT INTO programs (
      slug, name, tagline, category, description_short, description_long,
      duration, format, level, price, currency, capacity,
      certificate_available, registration_open, registration_deadline,
      image_url, icon, requirements, curriculum, outcomes,
      featured, display_order, published, meta_title, meta_description
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
      $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
    ) RETURNING *`,
    [
      slug, data.name, data.tagline || null, data.category, data.descriptionShort || null,
      data.descriptionLong || null, data.duration || null, data.format || 'hybrid',
      data.level || 'all_levels', data.price || 0, data.currency || 'RWF',
      data.capacity || null, data.certificateAvailable !== false,
      data.registrationOpen !== false, data.registrationDeadline || null,
      data.imageUrl || null, data.icon || null,
      JSON.stringify(data.requirements || []),
      JSON.stringify(data.curriculum || []),
      JSON.stringify(data.outcomes || []),
      data.featured || false, data.displayOrder || 0, data.published !== false,
      data.metaTitle || null, data.metaDescription || null,
    ]
  );

  return formatProgramDetail(result);
}

// ============================================================
// ADMIN — UPDATE
// ============================================================
async function update(id, data) {
  const map = {
    name: 'name', tagline: 'tagline', category: 'category',
    descriptionShort: 'description_short', descriptionLong: 'description_long',
    duration: 'duration', format: 'format', level: 'level', price: 'price',
    currency: 'currency', capacity: 'capacity',
    certificateAvailable: 'certificate_available', registrationOpen: 'registration_open',
    registrationDeadline: 'registration_deadline', imageUrl: 'image_url',
    icon: 'icon', featured: 'featured', displayOrder: 'display_order',
    published: 'published', metaTitle: 'meta_title', metaDescription: 'meta_description',
  };
  const jsonMap = {
    requirements: 'requirements', curriculum: 'curriculum', outcomes: 'outcomes',
  };

  const fields = [];
  const values = [];
  let i = 1;

  for (const [key, dbCol] of Object.entries(map)) {
    if (data[key] !== undefined) {
      fields.push(`${dbCol} = $${i++}`);
      values.push(data[key]);
    }
  }
  for (const [key, dbCol] of Object.entries(jsonMap)) {
    if (data[key] !== undefined) {
      fields.push(`${dbCol} = $${i++}`);
      values.push(JSON.stringify(data[key]));
    }
  }

  if (fields.length === 0) return getById(id);

  values.push(id);
  const result = await db.queryOne(
    `UPDATE programs SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${i} RETURNING *`,
    values
  );
  if (!result) throw new NotFoundError('Program not found');
  return formatProgramDetail(result);
}

// ============================================================
// ADMIN — DELETE
// ============================================================
async function remove(id) {
  const result = await db.queryOne(
    `DELETE FROM programs WHERE id = $1 RETURNING id`,
    [id]
  );
  if (!result) throw new NotFoundError('Program not found');
  return { message: 'Program deleted' };
}

// ============================================================
// ADMIN — CREATE COHORT
// ============================================================
async function createCohort(programId, data) {
  const program = await db.queryOne(`SELECT id FROM programs WHERE id = $1`, [programId]);
  if (!program) throw new NotFoundError('Program not found');

  const result = await db.queryOne(
    `INSERT INTO program_cohorts (program_id, name, start_date, end_date, capacity, status, schedule, instructors)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      programId, data.name, data.startDate || null, data.endDate || null,
      data.capacity || null, data.status || 'planned',
      JSON.stringify(data.schedule || {}), JSON.stringify(data.instructors || []),
    ]
  );
  return formatCohort(result);
}

async function listCohorts(programId) {
  const rows = await db.queryMany(
    `SELECT * FROM program_cohorts WHERE program_id = $1 ORDER BY start_date DESC`,
    [programId]
  );
  return rows.map(formatCohort);
}

// ============================================================
// FORMATTERS
// ============================================================
function formatProgram(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    category: row.category,
    descriptionShort: row.description_short,
    duration: row.duration,
    format: row.format,
    level: row.level,
    price: row.price,
    currency: row.currency,
    capacity: row.capacity,
    certificateAvailable: row.certificate_available,
    registrationOpen: row.registration_open,
    registrationDeadline: row.registration_deadline,
    imageUrl: row.image_url,
    icon: row.icon,
    featured: row.featured,
    displayOrder: row.display_order,
    createdAt: row.created_at,
  };
}

function formatProgramDetail(row) {
  return {
    ...formatProgram(row),
    descriptionLong: row.description_long,
    requirements: row.requirements,
    curriculum: row.curriculum,
    outcomes: row.outcomes,
    published: row.published,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    updatedAt: row.updated_at,
  };
}

function formatCohort(row) {
  return {
    id: row.id,
    programId: row.program_id,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    capacity: row.capacity,
    enrolledCount: row.enrolled_count,
    status: row.status,
    schedule: row.schedule,
    instructors: row.instructors,
    createdAt: row.created_at,
  };
}

function formatModule(row) {
  return {
    id: row.id,
    trackId: row.track_id,
    title: row.title,
    description: row.description,
    duration: row.duration,
    lessons: row.lessons,
    resources: row.resources,
    displayOrder: row.display_order,
  };
}

module.exports = {
  listPublic,
  getBySlug,
  listAdmin,
  getById,
  create,
  update,
  remove,
  createCohort,
  listCohorts,
};