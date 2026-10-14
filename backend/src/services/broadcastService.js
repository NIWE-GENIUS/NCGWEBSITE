// backend/src/services/broadcastService.js
const db = require('../database');
const { sendEmail } = require('../utils/email');
const { wrapBranded, CONTENT } = require('../utils/email/brandedTemplate');
const logger = require('../utils/logger');

/**
 * Send a broadcast to users, subscribers, or both.
 * @param {object} opts
 * @param {string[]} opts.recipients - 'users', 'subscribers', 'applicants'
 * @param {string} opts.subject
 * @param {string} opts.content
 * @param {string[]} opts.roles - filter users by role (optional)
 * @param {string} opts.status - filter users by status (default 'active')
 */
async function sendBroadcast({ recipients, subject, content, roles, status = 'active' }) {
  const emailSet = new Set();

  // Users
  if (recipients.includes('users')) {
    const conditions = ['deleted_at IS NULL'];
    const values = [];
    let i = 1;
    if (status) { conditions.push(`status = $${i++}`); values.push(status); }
    if (roles && roles.length) { conditions.push(`role = ANY($${i++}::text[])`); values.push(roles); }
    const where = 'WHERE ' + conditions.join(' AND ');
    const users = await db.queryMany(`SELECT email, first_name FROM users ${where}`, values);
    users.forEach((u) => emailSet.add(JSON.stringify({ email: u.email, name: u.first_name })));
  }

  // Subscribers
  if (recipients.includes('subscribers')) {
    const subs = await db.queryMany(
      `SELECT email, name FROM newsletter_subscribers
       WHERE confirmed = TRUE AND unsubscribed_at IS NULL`
    );
    subs.forEach((s) => emailSet.add(JSON.stringify({ email: s.email, name: s.name })));
  }

  // Applicants (users who applied to programs)
  if (recipients.includes('applicants')) {
    const apps = await db.queryMany(`
      SELECT DISTINCT u.email, u.first_name
      FROM applications a
      JOIN users u ON u.id = a.user_id
      WHERE a.status IN ('submitted', 'under_review', 'accepted', 'shortlisted')
        AND u.deleted_at IS NULL
    `);
    apps.forEach((a) => emailSet.add(JSON.stringify({ email: a.email, name: a.first_name })));
  }

  const recipientList = Array.from(emailSet).map((s) => JSON.parse(s));

  // Send emails in batches (avoid rate limits)
  let sent = 0;
  let failed = 0;
  const BATCH_SIZE = 20;

  for (let i = 0; i < recipientList.length; i += BATCH_SIZE) {
    const batch = recipientList.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (r) => {
        try {
          const result = await sendEmail({
            to: r.email,
            subject,
            html: wrapBranded(CONTENT.broadcast({
              subject,
              content,
              recipientName: r.name,
            }), { preheader: content.substring(0, 100) }),
          });
          if (result.success) sent++; else failed++;
        } catch (_) { failed++; }
      })
    );
    // Small delay between batches
    if (i + BATCH_SIZE < recipientList.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  logger.info('Broadcast complete', { total: recipientList.length, sent, failed });

  // Log broadcast
  await db.query(
    `INSERT INTO broadcasts (name, subject, content, recipient_count, status, sent_at, created_at)
     VALUES ($1, $2, $3, $4, 'sent', NOW(), NOW())`,
    [subject, subject, content, recipientList.length]
  ).catch(() => {});

  return {
    total: recipientList.length,
    sent,
    failed,
    message: `Broadcast sent to ${sent} recipients (${failed} failed)`,
  };
}

async function countRecipients({ recipients, roles, status = 'active' }) {
  const counts = { users: 0, subscribers: 0, applicants: 0 };

  if (recipients.includes('users')) {
    const conditions = ['deleted_at IS NULL'];
    const values = [];
    let i = 1;
    if (status) { conditions.push(`status = $${i++}`); values.push(status); }
    if (roles && roles.length) { conditions.push(`role = ANY($${i++}::text[])`); values.push(roles); }
    const where = 'WHERE ' + conditions.join(' AND ');
    const r = await db.queryOne(`SELECT COUNT(*)::int AS c FROM users ${where}`, values);
    counts.users = r.c;
  }

  if (recipients.includes('subscribers')) {
    const r = await db.queryOne(
      `SELECT COUNT(*)::int AS c FROM newsletter_subscribers
       WHERE confirmed = TRUE AND unsubscribed_at IS NULL`
    );
    counts.subscribers = r.c;
  }

  if (recipients.includes('applicants')) {
    const r = await db.queryOne(
      `SELECT COUNT(DISTINCT u.id)::int AS c FROM applications a
       JOIN users u ON u.id = a.user_id
       WHERE a.status IN ('submitted', 'under_review', 'accepted', 'shortlisted')
         AND u.deleted_at IS NULL`
    );
    counts.applicants = r.c;
  }

  return counts;
}

module.exports = { sendBroadcast, countRecipients };