// backend/src/services/contactService.js
const db = require('../database');
const { NotFoundError } = require('../utils/errors');
const { getPagination, getSorting } = require('../utils/pagination');
const { sendEmail } = require('../utils/email');
const { wrapBranded, CONTENT } = require('../utils/email/brandedTemplate');
const logger = require('../utils/logger');

const ALLOWED_SORT = ['created_at', 'priority', 'status'];

// ============================================================
// PUBLIC — SUBMIT
// ============================================================
async function submit({ name, email, phone, organization, position, purpose, subject, message, extraData, ip, userAgent, source, subscribe }) {
  const result = await db.queryOne(
    `INSERT INTO contact_messages (
      user_id, purpose, purpose_title, name, email, phone, organization, position,
      subject, message, extra_data, status, priority, ip_address, user_agent, source
    ) VALUES (NULL, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'unread', 'medium', $11, $12, $13)
    RETURNING id, message_id, name, email, purpose, subject, created_at`,
    [
      purpose || 'general', subject || null, name, email, phone || null,
      organization || null, position || null, subject || null, message,
      JSON.stringify({ ...(extraData || {}), subscribe: !!subscribe }),
      ip || null, userAgent || null, source || 'website',
    ]
  );

  // ============================================================
  // Subscribe user to newsletter if opted in
  // ============================================================
  if (subscribe) {
    await db.query(
      `INSERT INTO newsletter_subscribers (email, name, source, confirmed, created_at)
       VALUES ($1, $2, $3, TRUE, NOW())
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         confirmed = TRUE,
         unsubscribed_at = NULL,
         updated_at = NOW()`,
      [email, name, source || 'contact-form']
    ).catch(() => {});
  }

  // ============================================================
  // Email 1 — to ADMIN recipients (branded)
  // ============================================================
  const recipients = (process.env.CONTACT_RECIPIENTS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (recipients.length > 0) {
    sendEmail({
      to: recipients,
      subject: `[NCG Contact] ${subject || purpose} — ${name}`,
      html: wrapBranded(CONTENT.contactAdminNotification({
        name, email, phone, organization, purpose, subject, message,
        messageId: result.message_id, source: source || 'website',
      }), { preheader: `New message from ${name} (${email})` }),
      replyTo: email,
    }).catch((err) => logger.error('Admin contact email failed', { error: err.message }));

    // ============================================================
    // Email 2 — AUTO-REPLY to SENDER (branded)
    // ============================================================
    sendEmail({
      to: email,
      subject: 'Thank you for contacting NEXT Creatures Group',
      html: wrapBranded(CONTENT.contactAutoReply({
        name,
        messageId: result.message_id,
      }), { preheader: 'We received your message — we\'ll reply within 24-48 hours.' }),
    }).catch((err) => logger.error('Auto-reply failed', { error: err.message }));

    await db.query(
      `UPDATE contact_messages SET email_sent = TRUE, auto_reply_sent = TRUE WHERE id = $1`,
      [result.id]
    );
  }

  return {
    messageId: result.message_id,
    message: 'Thank you for contacting NCG. We will respond within 24–48 hours.',
    subscribed: !!subscribe,
  };
}

// ============================================================
// ADMIN — LIST
// ============================================================
async function list(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'created_at', 'DESC');

  const conditions = ['1=1'];
  const values = [];
  let i = 1;

  if (query.status) { conditions.push(`status = $${i++}`); values.push(query.status); }
  if (query.purpose) { conditions.push(`purpose = $${i++}`); values.push(query.purpose); }
  if (query.priority) { conditions.push(`priority = $${i++}`); values.push(query.priority); }
  if (query.search) {
    conditions.push(`(name ILIKE $${i} OR email ILIKE $${i} OR subject ILIKE $${i} OR message ILIKE $${i})`);
    values.push(`%${query.search}%`); i++;
  }

  const where = 'WHERE ' + conditions.join(' AND ');

  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM contact_messages ${where}`, values);
  const rows = await db.queryMany(
    `SELECT id, message_id, name, email, phone, organization, purpose, subject,
            status, priority, assigned_to, created_at
     FROM contact_messages ${where} ORDER BY ${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return {
    items: rows.map((r) => ({
      id: r.id, messageId: r.message_id, name: r.name, email: r.email,
      phone: r.phone, organization: r.organization, purpose: r.purpose,
      subject: r.subject, status: r.status, priority: r.priority,
      assignedTo: r.assigned_to, createdAt: r.created_at,
    })),
    pagination: { page, limit, total: count.count },
  };
}

async function getById(id) {
  const msg = await db.queryOne(`SELECT * FROM contact_messages WHERE id = $1`, [id]);
  if (!msg) throw new NotFoundError('Message not found');

  const [replies, notes] = await Promise.all([
    db.queryMany(`SELECT * FROM message_replies WHERE message_id = $1 ORDER BY created_at`, [id]),
    db.queryMany(
      `SELECT mn.*, u.first_name, u.last_name FROM message_notes mn
       LEFT JOIN users u ON u.id = mn.user_id WHERE mn.message_id = $1 ORDER BY mn.created_at`,
      [id]
    ),
  ]);

  return {
    id: msg.id, messageId: msg.message_id, name: msg.name, email: msg.email,
    phone: msg.phone, organization: msg.organization, position: msg.position,
    purpose: msg.purpose, subject: msg.subject, message: msg.message,
    extraData: msg.extra_data, status: msg.status, priority: msg.priority,
    assignedTo: msg.assigned_to, emailSent: msg.email_sent,
    autoReplySent: msg.auto_reply_sent, repliedAt: msg.replied_at,
    resolvedAt: msg.resolved_at, createdAt: msg.created_at,
    replies: replies.map((r) => ({ id: r.id, text: r.reply_text, sentVia: r.sent_via, emailStatus: r.email_status, createdAt: r.created_at })),
    notes: notes.map((n) => ({ id: n.id, note: n.note, author: n.first_name ? `${n.first_name} ${n.last_name}` : null, createdAt: n.created_at })),
  };
}

async function updateStatus(id, { status, priority, assignedTo }) {
  const updates = [];
  const values = [];
  let i = 1;
  if (status) { updates.push(`status = $${i++}`); values.push(status); }
  if (priority) { updates.push(`priority = $${i++}`); values.push(priority); }
  if (assignedTo !== undefined) { updates.push(`assigned_to = $${i++}`, `assigned_at = NOW()`); values.push(assignedTo); }
  if (status === 'replied') updates.push(`replied_at = NOW()`);
  if (status === 'resolved') updates.push(`resolved_at = NOW()`);
  if (!updates.length) return getById(id);
  values.push(id);
  const result = await db.queryOne(
    `UPDATE contact_messages SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
    values
  );
  if (!result) throw new NotFoundError('Message not found');
  return getById(id);
}

async function reply(id, { userId, replyText, sendEmail: doSend = true }) {
  const msg = await db.queryOne(`SELECT id, email, name, subject FROM contact_messages WHERE id = $1`, [id]);
  if (!msg) throw new NotFoundError('Message not found');

  const reply = await db.queryOne(
    `INSERT INTO message_replies (message_id, replied_by, reply_text, sent_via, email_status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [id, userId, replyText, doSend ? 'both' : 'in_app', doSend ? 'pending' : null]
  );

  if (doSend) {
    sendEmail({
      to: msg.email,
      subject: `Re: ${msg.subject || 'Your message to NCG'}`,
      html: wrapBranded(`
        <h2 style="margin:0 0 16px 0;font-family:'Space Grotesk',Arial,sans-serif;font-size:22px;color:#031B2A;">
          Re: ${msg.subject || 'Your message to NCG'}
        </h2>
        <p style="font-size:15px;line-height:1.7;color:#163247;margin:0 0 14px 0;">
          Hi ${msg.name},
        </p>
        <div style="font-size:15px;line-height:1.7;color:#163247;white-space:pre-wrap;margin:0 0 14px 0;">
          ${replyText}
        </div>
        <p style="font-size:15px;line-height:1.7;color:#163247;margin:20px 0 0 0;">
          Warm regards,<br>
          <strong>The NCG Team</strong>
        </p>
      `, { preheader: replyText.substring(0, 80) }),
    }).then(() => db.query(`UPDATE message_replies SET email_status = 'sent' WHERE id = $1`, [reply.id]))
      .catch(async (err) => {
        logger.error('Reply email failed', { error: err.message });
        await db.query(`UPDATE message_replies SET email_status = 'failed', email_error = $1 WHERE id = $2`, [err.message, reply.id]);
      });
  }

  await db.query(`UPDATE contact_messages SET status = 'replied', replied_at = NOW(), updated_at = NOW() WHERE id = $1`, [id]);
  return { id: reply.id, replyText, sentVia: reply.sent_via, createdAt: reply.created_at };
}

async function addNote(id, userId, note) {
  const result = await db.queryOne(
    `INSERT INTO message_notes (message_id, user_id, note) VALUES ($1, $2, $3) RETURNING *`,
    [id, userId, note]
  );
  return { id: result.id, note: result.note, createdAt: result.created_at };
}

async function remove(id) {
  const result = await db.queryOne(`DELETE FROM contact_messages WHERE id = $1 RETURNING id`, [id]);
  if (!result) throw new NotFoundError('Message not found');
  return { message: 'Message deleted' };
}

async function stats() {
  return db.queryOne(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'unread')::int AS unread,
      COUNT(*) FILTER (WHERE status = 'replied')::int AS replied,
      COUNT(*) FILTER (WHERE status = 'resolved')::int AS resolved,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS last_7_days
    FROM contact_messages
  `);
}

module.exports = { submit, list, getById, updateStatus, reply, addNote, remove, stats };