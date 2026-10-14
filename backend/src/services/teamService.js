// backend/src/services/teamService.js
const db = require('../database');
const { NotFoundError, ConflictError } = require('../utils/errors');
const { getPagination, getSorting } = require('../utils/pagination');
const { uniqueSlug } = require('../utils/slugify');

const ALLOWED_SORT = ['display_order', 'created_at', 'full_name', 'position'];

// ============================================================
// PUBLIC — LIST
// ============================================================
async function listPublic(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'display_order', 'ASC');

  const conditions = ['published = TRUE', 'deleted_at IS NULL'];
  const values = [];
  let i = 1;

  if (query.department) { conditions.push(`department = $${i++}`); values.push(query.department); }
  if (query.featured === 'true') conditions.push(`featured = TRUE`);
  if (query.search) {
    conditions.push(`(full_name ILIKE $${i} OR position ILIKE $${i} OR bio_short ILIKE $${i})`);
    values.push(`%${query.search}%`); i++;
  }

  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM team_members ${where}`, values);
  const rows = await db.queryMany(
    `SELECT id, slug, full_name, position, department, employment_type, email, phone,
            location, bio_short, profile_image_url, cover_image_url, social_links,
            featured, display_order, published, created_at
     FROM team_members ${where} ORDER BY ${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return { items: rows.map(formatTeamMember), pagination: { page, limit, total: count.count } };
}

async function getBySlug(slug) {
  const member = await db.queryOne(
    `SELECT * FROM team_members WHERE slug = $1 AND published = TRUE AND deleted_at IS NULL`,
    [slug]
  );
  if (!member) throw new NotFoundError('Team member not found');

  const [gallery, skills, socialLinks] = await Promise.all([
    db.queryMany(`SELECT id, image_url, caption, alt_text, display_order FROM team_member_gallery WHERE team_member_id = $1 ORDER BY display_order`, [member.id]),
    db.queryMany(`SELECT id, skill_name, proficiency, category, display_order FROM team_member_skills WHERE team_member_id = $1 ORDER BY display_order`, [member.id]),
    db.queryMany(`SELECT id, platform, url, display_order FROM team_member_social_links WHERE team_member_id = $1 ORDER BY display_order`, [member.id]),
  ]);

  return {
    ...formatTeamMemberDetail(member),
    gallery: gallery.map((g) => ({ id: g.id, imageUrl: g.image_url, caption: g.caption, altText: g.alt_text, displayOrder: g.display_order })),
    skills: skills.map((s) => ({ id: s.id, name: s.skill_name, proficiency: s.proficiency, category: s.category, displayOrder: s.display_order })),
    socialLinks: socialLinks.map((s) => ({ id: s.id, platform: s.platform, url: s.url, displayOrder: s.display_order })),
  };
}

// ============================================================
// ADMIN — LIST ALL
// ============================================================
async function listAdmin(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'display_order', 'ASC');

  const conditions = ['deleted_at IS NULL'];
  const values = [];
  let i = 1;

  if (query.published === 'true' || query.published === 'false') {
    conditions.push(`published = $${i++}`); values.push(query.published === 'true');
  }
  if (query.featured === 'true' || query.featured === 'false') {
    conditions.push(`featured = $${i++}`); values.push(query.featured === 'true');
  }
  if (query.search) {
    conditions.push(`(full_name ILIKE $${i} OR position ILIKE $${i} OR email ILIKE $${i})`);
    values.push(`%${query.search}%`); i++;
  }

  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM team_members ${where}`, values);
  const rows = await db.queryMany(
    `SELECT * FROM team_members ${where} ORDER BY ${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return { items: rows.map(formatTeamMemberDetail), pagination: { page, limit, total: count.count } };
}

async function getById(id) {
  const member = await db.queryOne(`SELECT * FROM team_members WHERE id = $1 AND deleted_at IS NULL`, [id]);
  if (!member) throw new NotFoundError('Team member not found');
  return formatTeamMemberDetail(member);
}

// ============================================================
// ADMIN — CREATE
// ============================================================
async function create(data) {
  if (!data.fullName || !data.position) {
    throw new Error('fullName and position are required');
  }

  const slug = await uniqueSlug(
    data.slug || data.fullName,
    async (s) => !!(await db.queryOne('SELECT id FROM team_members WHERE slug = $1', [s]))
  );

  const result = await db.queryOne(
    `INSERT INTO team_members (
      user_id, full_name, slug, position, department, employment_type,
      email, phone, location, bio_short, bio_full, mission_statement,
      profile_image_url, cover_image_url, social_links, skills, preferences,
      personal_ethics, education, experience, certifications, languages,
      portfolio_url, featured, display_order, published, meta_title, meta_description
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28
    ) RETURNING *`,
    [
      data.userId || null,
      data.fullName,
      slug,
      data.position,
      data.department || null,
      data.employmentType || 'full_time',
      data.email || null,
      data.phone || null,
      data.location || null,
      data.bioShort || null,
      data.bioFull || null,
      data.missionStatement || null,
      data.profileImageUrl || null,
      data.coverImageUrl || null,
      JSON.stringify(data.socialLinks || {}),
      JSON.stringify(data.skills || []),
      JSON.stringify(data.preferences || {}),
      data.personalEthics || null,
      JSON.stringify(data.education || []),
      JSON.stringify(data.experience || []),
      JSON.stringify(data.certifications || []),
      JSON.stringify(data.languages || []),
      data.portfolioUrl || null,
      data.featured === true,
      parseInt(data.displayOrder, 10) || 0,
      data.published !== false,
      data.metaTitle || null,
      data.metaDescription || null,
    ]
  );

  return formatTeamMemberDetail(result);
}

// ============================================================
// ADMIN — UPDATE
// ============================================================
async function update(id, data) {
  const map = {
    fullName: 'full_name', position: 'position', department: 'department',
    employmentType: 'employment_type', email: 'email', phone: 'phone',
    location: 'location', bioShort: 'bio_short', bioFull: 'bio_full',
    missionStatement: 'mission_statement', profileImageUrl: 'profile_image_url',
    coverImageUrl: 'cover_image_url', personalEthics: 'personal_ethics',
    portfolioUrl: 'portfolio_url', featured: 'featured',
    displayOrder: 'display_order', published: 'published',
    metaTitle: 'meta_title', metaDescription: 'meta_description',
  };
  const jsonMap = {
    socialLinks: 'social_links', skills: 'skills', preferences: 'preferences',
    education: 'education', experience: 'experience',
    certifications: 'certifications', languages: 'languages',
  };

  const fields = [];
  const values = [];
  let i = 1;

  for (const [key, col] of Object.entries(map)) {
    if (data[key] !== undefined) {
      fields.push(`${col} = $${i++}`);
      let value = data[key];
      if (key === 'displayOrder') value = parseInt(value, 10) || 0;
      values.push(value);
    }
  }
  for (const [key, col] of Object.entries(jsonMap)) {
    if (data[key] !== undefined) {
      fields.push(`${col} = $${i++}`);
      values.push(JSON.stringify(data[key]));
    }
  }

  if (!fields.length) return getById(id);

  values.push(id);
  const result = await db.queryOne(
    `UPDATE team_members SET ${fields.join(', ')}, updated_at = NOW()
     WHERE id = $${i} AND deleted_at IS NULL RETURNING *`,
    values
  );
  if (!result) throw new NotFoundError('Team member not found');
  return formatTeamMemberDetail(result);
}

async function remove(id) {
  const result = await db.queryOne(
    `UPDATE team_members SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
    [id]
  );
  if (!result) throw new NotFoundError('Team member not found');
  return { message: 'Team member deleted' };
}

function formatTeamMember(row) {
  return {
    id: row.id, slug: row.slug, fullName: row.full_name, position: row.position,
    department: row.department, employmentType: row.employment_type,
    email: row.email, phone: row.phone, location: row.location,
    bioShort: row.bio_short, profileImageUrl: row.profile_image_url,
    coverImageUrl: row.cover_image_url, socialLinks: row.social_links,
    featured: row.featured, displayOrder: row.display_order,
    published: row.published, createdAt: row.created_at,
  };
}

function formatTeamMemberDetail(row) {
  return {
    ...formatTeamMember(row),
    userId: row.user_id, bioFull: row.bio_full,
    missionStatement: row.mission_statement, skills: row.skills,
    preferences: row.preferences, personalEthics: row.personal_ethics,
    education: row.education, experience: row.experience,
    certifications: row.certifications, languages: row.languages,
    portfolioUrl: row.portfolio_url, metaTitle: row.meta_title,
    metaDescription: row.meta_description, updatedAt: row.updated_at,
  };
}

module.exports = { listPublic, getBySlug, listAdmin, getById, create, update, remove };