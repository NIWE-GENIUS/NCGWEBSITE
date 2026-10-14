// backend/src/services/adminService.js
const db = require('../database');

async function getDashboardStats() {
  const [users, team, programs, projects, messages, donations, blog, events] = await Promise.all([
    db.queryOne(`
      SELECT COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE status = 'active')::int AS active,
             COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS new_30
      FROM users WHERE deleted_at IS NULL
    `),
    db.queryOne(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE published = TRUE)::int AS published FROM team_members WHERE deleted_at IS NULL`),
    db.queryOne(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE published = TRUE)::int AS published FROM programs`),
    db.queryOne(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE published = TRUE)::int AS published FROM projects`),
    db.queryOne(`
      SELECT COUNT(*)::int AS total,
             COUNT(*) FILTER (WHERE status = 'unread')::int AS unread,
             COUNT(*) FILTER (WHERE status = 'replied')::int AS replied
      FROM contact_messages
    `),
    db.queryOne(`
      SELECT COUNT(*)::int AS total,
             COALESCE(SUM(amount) FILTER (WHERE payment_status = 'succeeded'), 0) AS total_amount
      FROM donations
    `),
    db.queryOne(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'published')::int AS published FROM blog_posts`),
    db.queryOne(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'published')::int AS published FROM events`),
  ]);

  return { users, team, programs, projects, messages, donations, blog, events };
}

async function getRecentActivity(limit = 20) {
  const rows = await db.queryMany(
    `SELECT al.id, al.action, al.entity_type, al.entity_id, al.created_at,
            u.first_name, u.last_name, u.email
     FROM activity_logs al
     LEFT JOIN users u ON u.id = al.user_id
     ORDER BY al.created_at DESC LIMIT $1`,
    [limit]
  );
  return rows.map((r) => ({
    id: r.id, action: r.action, entityType: r.entity_type, entityId: r.entity_id,
    user: r.first_name ? `${r.first_name} ${r.last_name}` : null,
    email: r.email, createdAt: r.created_at,
  }));
}

async function logActivity({ userId, action, entityType, entityId, details, ip, userAgent }) {
  try {
    await db.query(
      `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId || null, action, entityType || null, entityId || null, JSON.stringify(details || {}), ip || null, userAgent || null]
    );
  } catch (err) {
    console.error('Activity log failed', err.message);
  }
}

module.exports = { getDashboardStats, getRecentActivity, logActivity };