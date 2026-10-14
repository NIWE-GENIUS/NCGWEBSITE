// backend/src/services/searchService.js
const db = require('../database');

async function search(query, { types, limit = 20 } = {}) {
  if (!query || query.trim().length < 2) return { results: [], query };

  const q = `%${query.trim()}%`;
  const requestedTypes = types && types.length ? types : ['team', 'programs', 'projects', 'blog', 'events'];
  const results = [];

  if (requestedTypes.includes('team')) {
    const rows = await db.queryMany(
      `SELECT id, slug, full_name AS title, position AS subtitle, bio_short AS excerpt, profile_image_url AS image
       FROM team_members WHERE published = TRUE AND deleted_at IS NULL
         AND (full_name ILIKE $1 OR position ILIKE $1 OR bio_short ILIKE $1)
       LIMIT $2`, [q, limit]
    );
    rows.forEach((r) => results.push({ type: 'team', id: r.id, slug: r.slug, title: r.title, subtitle: r.subtitle, excerpt: r.excerpt, image: r.image, url: `/team/${r.slug}` }));
  }

  if (requestedTypes.includes('programs')) {
    const rows = await db.queryMany(
      `SELECT id, slug, name AS title, tagline AS subtitle, description_short AS excerpt, image_url AS image
       FROM programs WHERE published = TRUE
         AND (name ILIKE $1 OR tagline ILIKE $1 OR description_short ILIKE $1)
       LIMIT $2`, [q, limit]
    );
    rows.forEach((r) => results.push({ type: 'program', id: r.id, slug: r.slug, title: r.title, subtitle: r.subtitle, excerpt: r.excerpt, image: r.image, url: `/programs/${r.slug}` }));
  }

  if (requestedTypes.includes('projects')) {
    const rows = await db.queryMany(
      `SELECT id, slug, title, category AS subtitle, description_short AS excerpt, hero_image_url AS image
       FROM projects WHERE published = TRUE
         AND (title ILIKE $1 OR description_short ILIKE $1)
       LIMIT $2`, [q, limit]
    );
    rows.forEach((r) => results.push({ type: 'project', id: r.id, slug: r.slug, title: r.title, subtitle: r.subtitle, excerpt: r.excerpt, image: r.image, url: `/projects/${r.slug}` }));
  }

  if (requestedTypes.includes('blog')) {
    const rows = await db.queryMany(
      `SELECT id, slug, title, excerpt, featured_image AS image, published_at
       FROM blog_posts WHERE status = 'published'
         AND (title ILIKE $1 OR excerpt ILIKE $1 OR content ILIKE $1)
       LIMIT $2`, [q, limit]
    );
    rows.forEach((r) => results.push({ type: 'blog', id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt, image: r.image, url: `/blog/${r.slug}`, publishedAt: r.published_at }));
  }

  if (requestedTypes.includes('events')) {
    const rows = await db.queryMany(
      `SELECT id, slug, title, category AS subtitle, description AS excerpt, image_url AS image, start_date
       FROM events WHERE status = 'published'
         AND (title ILIKE $1 OR description ILIKE $1)
       LIMIT $2`, [q, limit]
    );
    rows.forEach((r) => results.push({ type: 'event', id: r.id, slug: r.slug, title: r.title, subtitle: r.subtitle, excerpt: r.excerpt, image: r.image, url: `/events/${r.slug}`, startDate: r.start_date }));
  }

  // Log search
  try {
    await db.query(`INSERT INTO search_history (query, results_count) VALUES ($1, $2)`, [query, results.length]);
  } catch (_) {}

  return { query, count: results.length, results };
}

module.exports = { search };