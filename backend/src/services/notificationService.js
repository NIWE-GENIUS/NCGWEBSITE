// backend/src/services/notificationService.js
const db = require('../database');
const { getPagination } = require('../utils/pagination');

async function listForUser(userId, query = {}) {
  const { page, limit, offset } = getPagination(query);

  const conditions = ['user_id = $1'];
  const values = [userId];
  let i = 2;

  if (query.unread === 'true') conditions.push('is_read = FALSE');
  if (query.type) { conditions.push(`type = $${i++}`); values.push(query.type); }

  const where = 'WHERE ' + conditions.join(' AND ');

  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM notifications ${where}`, values);
  const rows = await db.queryMany(
    `SELECT id, type, title, message, data, link, is_read, read_at, created_at
     FROM notifications ${where} ORDER BY created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return {
    items: rows.map((r) => ({
      id: r.id, type: r.type, title: r.title, message: r.message,
      data: r.data, link: r.link, isRead: r.is_read, readAt: r.read_at, createdAt: r.created_at,
    })),
    pagination: { page, limit, total: count.count },
  };
}

async function markAsRead(userId, notificationId) {
  await db.query(
    `UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = $1 AND user_id = $2`,
    [notificationId, userId]
  );
  return { message: 'Marked as read' };
}

async function markAllAsRead(userId) {
  await db.query(`UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE user_id = $1 AND is_read = FALSE`, [userId]);
  return { message: 'All marked as read' };
}

async function create({ userId, type, title, message, data, link }) {
  const r = await db.queryOne(
    `INSERT INTO notifications (user_id, type, title, message, data, link) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [userId, type, title, message || null, JSON.stringify(data || {}), link || null]
  );
  return { id: r.id, type: r.type, title: r.title };
}

async function unreadCount(userId) {
  const r = await db.queryOne(`SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND is_read = FALSE`, [userId]);
  return { count: r.count };
}

// ============================================================
// ANNOUNCEMENTS (public)
// ============================================================
async function getActiveAnnouncements(query = {}) {
  const conditions = [`status = 'active'`, `(start_date IS NULL OR start_date <= NOW())`, `(end_date IS NULL OR end_date >= NOW())`];
  const values = [];
  let i = 1;

  if (query.type) { conditions.push(`type = $${i++}`); values.push(query.type); }

  const rows = await db.queryMany(
    `SELECT id, title, content, type, style, icon, dismissible, cta_text, cta_url
     FROM announcements WHERE ${conditions.join(' AND ')}
     ORDER BY priority DESC, created_at DESC LIMIT 5`,
    values
  );
  return rows.map((r) => ({
    id: r.id, title: r.title, content: r.content, type: r.type, style: r.style,
    icon: r.icon, dismissible: r.dismissible, ctaText: r.cta_text, ctaUrl: r.cta_url,
  }));
}

// Admin
async function listAnnouncements(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM announcements`);
  const rows = await db.queryMany(`SELECT * FROM announcements ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset]);
  return { items: rows, pagination: { page, limit, total: count.count } };
}

async function createAnnouncement(data, userId) {
  const r = await db.queryOne(
    `INSERT INTO announcements (title, content, type, style, icon, target_audience, target_pages,
      start_date, end_date, dismissible, cta_text, cta_url, priority, status, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
    [
      data.title, data.content, data.type || 'banner', data.style || 'info',
      data.icon || null, JSON.stringify(data.targetAudience || []),
      JSON.stringify(data.targetPages || []), data.startDate || null, data.endDate || null,
      data.dismissible !== false, data.ctaText || null, data.ctaUrl || null,
      data.priority || 0, data.status || 'draft', userId,
    ]
  );
  return r;
}

async function updateAnnouncement(id, data) {
  const map = {
    title: 'title', content: 'content', type: 'type', style: 'style',
    icon: 'icon', startDate: 'start_date', endDate: 'end_date',
    dismissible: 'dismissible', ctaText: 'cta_text', ctaUrl: 'cta_url',
    priority: 'priority', status: 'status',
  };
  const fields = [];
  const values = [];
  let i = 1;
  for (const [k, col] of Object.entries(map)) {
    if (data[k] !== undefined) { fields.push(`${col} = $${i++}`); values.push(data[k]); }
  }
  if (!fields.length) return null;
  values.push(id);
  const r = await db.queryOne(`UPDATE announcements SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, values);
  return r;
}

async function deleteAnnouncement(id) {
  await db.query(`DELETE FROM announcements WHERE id = $1`, [id]);
  return { message: 'Announcement deleted' };
}

module.exports = {
  listForUser, markAsRead, markAllAsRead, create, unreadCount,
  getActiveAnnouncements, listAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
};