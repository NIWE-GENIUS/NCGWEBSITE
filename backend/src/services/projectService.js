// backend/src/services/projectService.js
const db = require('../database');
const { NotFoundError } = require('../utils/errors');
const { getPagination, getSorting } = require('../utils/pagination');
const { uniqueSlug } = require('../utils/slugify');

const ALLOWED_SORT = ['display_order', 'created_at', 'title', 'start_date'];

// ============================================================
// PUBLIC
// ============================================================
async function listPublic(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'display_order', 'ASC');

  const conditions = ['published = TRUE'];
  const values = [];
  let i = 1;

  if (query.category) { conditions.push(`category = $${i++}`); values.push(query.category); }
  if (query.status) { conditions.push(`status = $${i++}`); values.push(query.status); }
  if (query.featured === 'true') conditions.push(`featured = TRUE`);
  if (query.search) {
    conditions.push(`(title ILIKE $${i} OR description_short ILIKE $${i})`);
    values.push(`%${query.search}%`); i++;
  }

  const where = 'WHERE ' + conditions.join(' AND ');

  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM projects ${where}`, values);
  const rows = await db.queryMany(
    `SELECT id, slug, title, category, description_short, tech_stack, status,
            hero_image_url, client, start_date, end_date, featured,
            display_order, created_at
     FROM projects ${where} ORDER BY ${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return { items: rows.map(formatProject), pagination: { page, limit, total: count.count } };
}

async function getBySlug(slug) {
  const project = await db.queryOne(
    `SELECT * FROM projects WHERE slug = $1 AND published = TRUE`,
    [slug]
  );
  if (!project) throw new NotFoundError('Project not found');

  const [gallery, team, milestones, metrics] = await Promise.all([
    db.queryMany(`SELECT id, image_url, caption, alt_text, display_order FROM project_gallery WHERE project_id = $1 ORDER BY display_order`, [project.id]),
    db.queryMany(`SELECT pt.id, pt.role, u.id AS user_id, u.first_name, u.last_name, u.email, u.avatar_url
                  FROM project_team pt JOIN users u ON u.id = pt.user_id WHERE pt.project_id = $1`, [project.id]),
    db.queryMany(`SELECT * FROM project_milestones WHERE project_id = $1 ORDER BY due_date`, [project.id]),
    db.queryMany(`SELECT * FROM project_metrics WHERE project_id = $1 ORDER BY recorded_at DESC`, [project.id]),
  ]);

  return {
    ...formatProjectDetail(project),
    gallery: gallery.map((g) => ({ id: g.id, imageUrl: g.image_url, caption: g.caption, altText: g.alt_text, displayOrder: g.display_order })),
    team: team.map((t) => ({ id: t.id, role: t.role, userId: t.user_id, fullName: `${t.first_name} ${t.last_name}`, email: t.email, avatarUrl: t.avatar_url })),
    milestones: milestones.map((m) => ({ id: m.id, title: m.title, description: m.description, status: m.status, dueDate: m.due_date, completedAt: m.completed_at })),
    metrics: metrics.map((m) => ({ id: m.id, name: m.metric_name, value: m.metric_value, unit: m.metric_unit, recordedAt: m.recorded_at })),
  };
}

// ============================================================
// ADMIN
// ============================================================
async function listAdmin(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'display_order', 'ASC');

  const conditions = ['1=1'];
  const values = [];
  let i = 1;

  if (query.published === 'true' || query.published === 'false') { conditions.push(`published = $${i++}`); values.push(query.published === 'true'); }
  if (query.category) { conditions.push(`category = $${i++}`); values.push(query.category); }
  if (query.search) { conditions.push(`title ILIKE $${i++}`); values.push(`%${query.search}%`); }

  const where = 'WHERE ' + conditions.join(' AND ');

  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM projects ${where}`, values);
  const rows = await db.queryMany(
    `SELECT * FROM projects ${where} ORDER BY ${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return { items: rows.map(formatProjectDetail), pagination: { page, limit, total: count.count } };
}

async function getById(id) {
  const project = await db.queryOne(`SELECT * FROM projects WHERE id = $1`, [id]);
  if (!project) throw new NotFoundError('Project not found');
  return formatProjectDetail(project);
}

async function create(data) {
  const slug = await uniqueSlug(
    data.slug || data.title,
    async (s) => !!(await db.queryOne('SELECT id FROM projects WHERE slug = $1', [s]))
  );

  const result = await db.queryOne(
    `INSERT INTO projects (
      slug, title, category, description_short, description_long, problem_statement, solution,
      tech_stack, impact_metrics, status, hero_image_url, gallery, team_members,
      client, start_date, end_date, featured, display_order, published, meta_title, meta_description
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
    RETURNING *`,
    [
      slug, data.title, data.category || 'software', data.descriptionShort || null,
      data.descriptionLong || null, data.problemStatement || null, data.solution || null,
      JSON.stringify(data.techStack || []), JSON.stringify(data.impactMetrics || []),
      data.status || 'concept', data.heroImageUrl || null,
      JSON.stringify(data.gallery || []), JSON.stringify(data.teamMembers || []),
      data.client || null, data.startDate || null, data.endDate || null,
      data.featured || false, data.displayOrder || 0, data.published !== false,
      data.metaTitle || null, data.metaDescription || null,
    ]
  );
  return formatProjectDetail(result);
}

async function update(id, data) {
  const map = {
    title: 'title', category: 'category', descriptionShort: 'description_short',
    descriptionLong: 'description_long', problemStatement: 'problem_statement',
    solution: 'solution', status: 'status', heroImageUrl: 'hero_image_url',
    client: 'client', startDate: 'start_date', endDate: 'end_date',
    featured: 'featured', displayOrder: 'display_order', published: 'published',
    metaTitle: 'meta_title', metaDescription: 'meta_description',
  };
  const jsonMap = {
    techStack: 'tech_stack', impactMetrics: 'impact_metrics',
    gallery: 'gallery', teamMembers: 'team_members',
  };

  const fields = [];
  const values = [];
  let i = 1;

  for (const [k, col] of Object.entries(map)) {
    if (data[k] !== undefined) { fields.push(`${col} = $${i++}`); values.push(data[k]); }
  }
  for (const [k, col] of Object.entries(jsonMap)) {
    if (data[k] !== undefined) { fields.push(`${col} = $${i++}`); values.push(JSON.stringify(data[k])); }
  }

  if (!fields.length) return getById(id);

  values.push(id);
  const result = await db.queryOne(
    `UPDATE projects SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
    values
  );
  if (!result) throw new NotFoundError('Project not found');
  return formatProjectDetail(result);
}

async function remove(id) {
  const result = await db.queryOne(`DELETE FROM projects WHERE id = $1 RETURNING id`, [id]);
  if (!result) throw new NotFoundError('Project not found');
  return { message: 'Project deleted' };
}

function formatProject(row) {
  return {
    id: row.id, slug: row.slug, title: row.title, category: row.category,
    descriptionShort: row.description_short, techStack: row.tech_stack,
    status: row.status, heroImageUrl: row.hero_image_url, client: row.client,
    startDate: row.start_date, endDate: row.end_date, featured: row.featured,
    displayOrder: row.display_order, createdAt: row.created_at,
  };
}

function formatProjectDetail(row) {
  return {
    ...formatProject(row),
    descriptionLong: row.description_long,
    problemStatement: row.problem_statement,
    solution: row.solution,
    impactMetrics: row.impact_metrics,
    gallery: row.gallery,
    teamMembers: row.team_members,
    published: row.published,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    updatedAt: row.updated_at,
  };
}

module.exports = { listPublic, getBySlug, listAdmin, getById, create, update, remove };