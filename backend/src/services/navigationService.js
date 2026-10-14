// backend/src/services/navigationService.js
const db = require('../database');
const { NotFoundError } = require('../utils/errors');

// ============================================================
// NAVIGATION
// ============================================================
async function getNavigation(location = 'header') {
  const rows = await db.queryMany(
    `SELECT * FROM navigation WHERE location = $1 AND is_visible = TRUE ORDER BY display_order`,
    [location]
  );

  // Build tree (parent-child)
  const byId = {};
  rows.forEach((r) => { byId[r.id] = { id: r.id, label: r.label, url: r.url, icon: r.icon, target: r.target, metadata: r.metadata, children: [] }; });
  const roots = [];
  rows.forEach((r) => {
    if (r.parent_id && byId[r.parent_id]) byId[r.parent_id].children.push(byId[r.id]);
    else roots.push(byId[r.id]);
  });
  return roots;
}

async function listNavigationAdmin(location) {
  const conditions = location ? ['location = $1'] : [];
  const values = location ? [location] : [];
  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const rows = await db.queryMany(`SELECT * FROM navigation ${where} ORDER BY location, display_order`, values);
  return rows.map((r) => ({ id: r.id, location: r.location, label: r.label, url: r.url, icon: r.icon, parentId: r.parent_id, displayOrder: r.display_order, isVisible: r.is_visible, target: r.target, metadata: r.metadata }));
}

async function createNav(data) {
  const r = await db.queryOne(
    `INSERT INTO navigation (location, label, url, icon, parent_id, display_order, is_visible, target, metadata)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [data.location || 'header', data.label, data.url, data.icon || null, data.parentId || null, data.displayOrder || 0, data.isVisible !== false, data.target || '_self', JSON.stringify(data.metadata || {})]
  );
  return { id: r.id, label: r.label, url: r.url };
}

async function updateNav(id, data) {
  const map = { location: 'location', label: 'label', url: 'url', icon: 'icon', parentId: 'parent_id', displayOrder: 'display_order', isVisible: 'is_visible', target: 'target' };
  const fields = [];
  const values = [];
  let i = 1;
  for (const [k, col] of Object.entries(map)) { if (data[k] !== undefined) { fields.push(`${col} = $${i++}`); values.push(data[k]); } }
  if (!fields.length) return null;
  values.push(id);
  const r = await db.queryOne(`UPDATE navigation SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
  if (!r) throw new NotFoundError('Nav item not found');
  return { id: r.id, label: r.label, url: r.url };
}

async function deleteNav(id) {
  await db.query(`DELETE FROM navigation WHERE id = $1`, [id]);
  return { message: 'Deleted' };
}

// ============================================================
// FOOTER LINKS
// ============================================================
async function getFooterLinks() {
  const rows = await db.queryMany(`SELECT * FROM footer_links WHERE is_visible = TRUE ORDER BY section, display_order`);
  const grouped = {};
  rows.forEach((r) => {
    if (!grouped[r.section]) grouped[r.section] = [];
    grouped[r.section].push({ id: r.id, label: r.label, url: r.url, displayOrder: r.display_order });
  });
  return grouped;
}

async function listFooterAdmin() {
  const rows = await db.queryMany(`SELECT * FROM footer_links ORDER BY section, display_order`);
  return rows.map((r) => ({ id: r.id, section: r.section, label: r.label, url: r.url, displayOrder: r.display_order, isVisible: r.is_visible }));
}

async function createFooterLink(data) {
  const r = await db.queryOne(
    `INSERT INTO footer_links (section, label, url, display_order, is_visible) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [data.section, data.label, data.url, data.displayOrder || 0, data.isVisible !== false]
  );
  return { id: r.id, section: r.section, label: r.label, url: r.url };
}

async function updateFooterLink(id, data) {
  const map = { section: 'section', label: 'label', url: 'url', displayOrder: 'display_order', isVisible: 'is_visible' };
  const fields = [];
  const values = [];
  let i = 1;
  for (const [k, col] of Object.entries(map)) { if (data[k] !== undefined) { fields.push(`${col} = $${i++}`); values.push(data[k]); } }
  if (!fields.length) return null;
  values.push(id);
  const r = await db.queryOne(`UPDATE footer_links SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
  if (!r) throw new NotFoundError('Footer link not found');
  return { id: r.id, label: r.label };
}

async function deleteFooterLink(id) {
  await db.query(`DELETE FROM footer_links WHERE id = $1`, [id]);
  return { message: 'Deleted' };
}

// ============================================================
// LEGAL PAGES
// ============================================================
async function listLegal() {
  const rows = await db.queryMany(`SELECT id, slug, title, version, effective_date, published FROM legal_pages WHERE published = TRUE ORDER BY slug`);
  return rows.map((r) => ({ id: r.id, slug: r.slug, title: r.title, version: r.version, effectiveDate: r.effective_date }));
}

async function getLegal(slug) {
  const r = await db.queryOne(`SELECT * FROM legal_pages WHERE slug = $1 AND published = TRUE`, [slug]);
  if (!r) throw new NotFoundError('Legal page not found');
  return { id: r.id, slug: r.slug, title: r.title, content: r.content, version: r.version, effectiveDate: r.effective_date, updatedAt: r.updated_at };
}

async function upsertLegal(slug, data, userId) {
  const existing = await db.queryOne(`SELECT id FROM legal_pages WHERE slug = $1`, [slug]);
  if (existing) {
    const r = await db.queryOne(
      `UPDATE legal_pages SET title = $1, content = $2, version = version + 1, effective_date = $3, published = $4, updated_by = $5, updated_at = NOW()
       WHERE slug = $6 RETURNING *`,
      [data.title, data.content, data.effectiveDate || null, data.published !== false, userId, slug]
    );
    return { slug: r.slug, version: r.version };
  } else {
    const r = await db.queryOne(
      `INSERT INTO legal_pages (slug, title, content, version, effective_date, published, updated_by)
       VALUES ($1,$2,$3,1,$4,$5,$6) RETURNING *`,
      [slug, data.title, data.content, data.effectiveDate || null, data.published !== false, userId]
    );
    return { slug: r.slug, version: r.version };
  }
}

module.exports = {
  getNavigation, listNavigationAdmin, createNav, updateNav, deleteNav,
  getFooterLinks, listFooterAdmin, createFooterLink, updateFooterLink, deleteFooterLink,
  listLegal, getLegal, upsertLegal,
};