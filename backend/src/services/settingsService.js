// backend/src/services/settingsService.js
const db = require('../database');
const { NotFoundError } = require('../utils/errors');

// ============================================================
// COMPANY INFO
// ============================================================
async function getCompanyInfo() {
  const row = await db.queryOne(`SELECT * FROM company_info LIMIT 1`);
  if (!row) throw new NotFoundError('Company info not found');
  return formatCompany(row);
}

async function updateCompanyInfo(data) {
  const map = {
    legalName: 'legal_name', brandName: 'brand_name', tagline: 'tagline',
    positioning: 'positioning', descriptionShort: 'description_short',
    descriptionLong: 'description_long', mission: 'mission', vision: 'vision',
    primaryEmail: 'primary_email', supportEmail: 'support_email',
    careersEmail: 'careers_email', partnershipsEmail: 'partnerships_email',
    adminEmail: 'admin_email', phone: 'phone', whatsapp: 'whatsapp',
    location: 'location', country: 'country', currency: 'currency',
    timezone: 'timezone', logoUrl: 'logo_url', logoWhiteUrl: 'logo_white_url',
    faviconUrl: 'favicon_url', ogImageUrl: 'og_image_url',
  };
  const jsonMap = { values: 'values', address: 'address', socialLinks: 'social_links' };

  const fields = [];
  const values = [];
  let i = 1;
  for (const [k, col] of Object.entries(map)) {
    if (data[k] !== undefined) { fields.push(`${col} = $${i++}`); values.push(data[k]); }
  }
  for (const [k, col] of Object.entries(jsonMap)) {
    if (data[k] !== undefined) { fields.push(`${col} = $${i++}`); values.push(JSON.stringify(data[k])); }
  }
  if (!fields.length) return getCompanyInfo();

  const r = await db.queryOne(
    `UPDATE company_info SET ${fields.join(', ')}, updated_at = NOW() WHERE id = (SELECT id FROM company_info LIMIT 1) RETURNING *`,
    values
  );
  return formatCompany(r);
}

function formatCompany(row) {
  return {
    id: row.id, legalName: row.legal_name, brandName: row.brand_name,
    tagline: row.tagline, positioning: row.positioning,
    descriptionShort: row.description_short, descriptionLong: row.description_long,
    mission: row.mission, vision: row.vision, values: row.values,
    primaryEmail: row.primary_email, supportEmail: row.support_email,
    careersEmail: row.careers_email, partnershipsEmail: row.partnerships_email,
    adminEmail: row.admin_email, phone: row.phone, whatsapp: row.whatsapp,
    address: row.address, location: row.location, country: row.country,
    currency: row.currency, timezone: row.timezone, socialLinks: row.social_links,
    logoUrl: row.logo_url, logoWhiteUrl: row.logo_white_url,
    faviconUrl: row.favicon_url, ogImageUrl: row.og_image_url,
    foundedDate: row.founded_date, updatedAt: row.updated_at,
  };
}

// ============================================================
// SITE SETTINGS
// ============================================================
async function getPublicSettings() {
  const rows = await db.queryMany(`SELECT key, value FROM site_settings WHERE is_public = TRUE`);
  const out = {};
  rows.forEach((r) => { out[r.key] = r.value; });
  return out;
}

async function getAllSettings() {
  const rows = await db.queryMany(`SELECT * FROM site_settings ORDER BY category, key`);
  return rows.map((r) => ({ id: r.id, key: r.key, value: r.value, category: r.category, description: r.description, isPublic: r.is_public }));
}

async function upsertSetting(key, value, meta = {}) {
  const r = await db.queryOne(
    `INSERT INTO site_settings (key, value, category, description, is_public)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
     RETURNING *`,
    [key, JSON.stringify(value), meta.category || 'general', meta.description || null, meta.isPublic !== false]
  );
  return { id: r.id, key: r.key, value: r.value };
}

// ============================================================
// SEO
// ============================================================
async function getSeo(pageSlug) {
  const row = await db.queryOne(`SELECT * FROM seo_settings WHERE page_slug = $1`, [pageSlug]);
  if (!row) return null;
  return {
    pageSlug: row.page_slug, metaTitle: row.meta_title,
    metaDescription: row.meta_description, metaKeywords: row.meta_keywords,
    ogTitle: row.og_title, ogDescription: row.og_description, ogImage: row.og_image,
    twitterCard: row.twitter_card, canonicalUrl: row.canonical_url,
    structuredData: row.structured_data, robots: row.robots,
  };
}

async function listSeo() {
  const rows = await db.queryMany(`SELECT * FROM seo_settings ORDER BY page_slug`);
  return rows.map((r) => ({ pageSlug: r.page_slug, metaTitle: r.meta_title, metaDescription: r.meta_description, robots: r.robots }));
}

async function upsertSeo(pageSlug, data) {
  const r = await db.queryOne(
    `INSERT INTO seo_settings (page_slug, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, twitter_card, canonical_url, structured_data, robots)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     ON CONFLICT (page_slug) DO UPDATE SET
       meta_title = EXCLUDED.meta_title,
       meta_description = EXCLUDED.meta_description,
       meta_keywords = EXCLUDED.meta_keywords,
       og_title = EXCLUDED.og_title,
       og_description = EXCLUDED.og_description,
       og_image = EXCLUDED.og_image,
       twitter_card = EXCLUDED.twitter_card,
       canonical_url = EXCLUDED.canonical_url,
       structured_data = EXCLUDED.structured_data,
       robots = EXCLUDED.robots,
       updated_at = NOW()
     RETURNING *`,
    [
      pageSlug, data.metaTitle || null, data.metaDescription || null,
      data.metaKeywords || null, data.ogTitle || null, data.ogDescription || null,
      data.ogImage || null, data.twitterCard || 'summary_large_image',
      data.canonicalUrl || null, JSON.stringify(data.structuredData || {}),
      data.robots || 'index,follow',
    ]
  );
  return { pageSlug: r.page_slug, metaTitle: r.meta_title };
}

module.exports = {
  getCompanyInfo, updateCompanyInfo,
  getPublicSettings, getAllSettings, upsertSetting,
  getSeo, listSeo, upsertSeo,
};