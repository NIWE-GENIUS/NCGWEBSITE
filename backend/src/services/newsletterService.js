// backend/src/services/newsletterService.js
const db = require('../database');
const { getPagination } = require('../utils/pagination');
const { ConflictError, NotFoundError } = require('../utils/errors');
const { sendEmail } = require('../utils/email');
const { wrapBranded, CONTENT } = require('../utils/email/brandedTemplate');
const logger = require('../utils/logger');

async function subscribe({ email, name, source = 'website', tags = [] }) {
  const existing = await db.queryOne(
    `SELECT id, confirmed, unsubscribed_at FROM newsletter_subscribers WHERE email = $1`,
    [email]
  );

  if (existing && existing.confirmed && !existing.unsubscribed_at) {
    throw new ConflictError('This email is already subscribed');
  }

  const result = await db.queryOne(
    `INSERT INTO newsletter_subscribers (email, name, source, tags, confirmed, created_at)
     VALUES ($1, $2, $3, $4, TRUE, NOW())
     ON CONFLICT (email) DO UPDATE SET
       name = COALESCE(EXCLUDED.name, newsletter_subscribers.name),
       confirmed = TRUE,
       unsubscribed_at = NULL,
       updated_at = NOW()
     RETURNING id, email, name, created_at`,
    [email, name || null, source, JSON.stringify(tags)]
  );

  // Send welcome email
  sendEmail({
    to: email,
    subject: 'Welcome to NCG Updates!',
    html: wrapBranded(CONTENT.newsletterWelcome({ email }), {
      preheader: 'You are now subscribed to NCG updates.',
    }),
  }).catch((err) => logger.error('Newsletter welcome failed', { error: err.message }));

  return {
    id: result.id,
    email: result.email,
    message: 'Successfully subscribed. Check your inbox for a welcome email.',
  };
}

async function unsubscribe(email) {
  const result = await db.queryOne(
    `UPDATE newsletter_subscribers
     SET unsubscribed_at = NOW(), updated_at = NOW()
     WHERE email = $1 RETURNING id`,
    [email]
  );
  if (!result) throw new NotFoundError('Email not found');
  return { message: 'Successfully unsubscribed' };
}

async function list(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const conditions = ['1=1'];
  const values = [];
  let i = 1;

  if (query.confirmed === 'true') conditions.push(`confirmed = TRUE AND unsubscribed_at IS NULL`);
  if (query.search) {
    conditions.push(`(email ILIKE $${i} OR name ILIKE $${i})`);
    values.push(`%${query.search}%`); i++;
  }

  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM newsletter_subscribers ${where}`, values);
  const rows = await db.queryMany(
    `SELECT id, email, name, source, tags, confirmed, unsubscribed_at, created_at
     FROM newsletter_subscribers ${where}
     ORDER BY created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return {
    items: rows.map((r) => ({
      id: r.id, email: r.email, name: r.name, source: r.source, tags: r.tags,
      confirmed: r.confirmed, unsubscribedAt: r.unsubscribed_at, createdAt: r.created_at,
    })),
    pagination: { page, limit, total: count.count },
  };
}

async function activeSubscribers() {
  return db.queryMany(
    `SELECT email, name FROM newsletter_subscribers
     WHERE confirmed = TRUE AND unsubscribed_at IS NULL`
  );
}

async function stats() {
  return db.queryOne(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE confirmed = TRUE AND unsubscribed_at IS NULL)::int AS active,
      COUNT(*) FILTER (WHERE unsubscribed_at IS NOT NULL)::int AS unsubscribed,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS last_30_days
    FROM newsletter_subscribers
  `);
}

module.exports = { subscribe, unsubscribe, list, activeSubscribers, stats };