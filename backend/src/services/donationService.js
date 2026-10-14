// backend/src/services/donationService.js
const db = require('../database');
const { NotFoundError, BadRequestError } = require('../utils/errors');
const { getPagination, getSorting } = require('../utils/pagination');
const { sendEmail } = require('../utils/email');
const { wrapBranded, CONTENT } = require('../utils/email/brandedTemplate');
const logger = require('../utils/logger');

const ALLOWED_SORT = ['created_at', 'amount'];

// Thresholds
const MAJOR_DONATION_THRESHOLD = 500000;     // 500,000 RWF = major gift
const URGENT_DONATION_THRESHOLD = 1000000;   // 1,000,000 RWF = urgent/priority
const ADMIN_ROLES = ['admin', 'super_admin'];

// ============================================================
// HELPER — Notify all admins
// ============================================================
async function notifyAdmins({ type, title, message, data = {}, priority = 'medium' }) {
  try {
    const result = await db.query(
      `INSERT INTO notifications (user_id, type, title, message, data, is_read)
       SELECT id, $1, $2, $3, $4, FALSE
       FROM users
       WHERE role = ANY($5::text[]) AND deleted_at IS NULL`,
      [type, title, message, JSON.stringify({ ...data, priority }), ADMIN_ROLES]
    );
    logger.info('Admin notification created', { type, count: result.rowCount });
  } catch (err) {
    logger.error('Failed to notify admins', { error: err.message });
  }
}

// ============================================================
// PUBLIC — CREATE DONATION
// ============================================================
async function createDonation(data) {
  // ===== 1. Find or create donor =====
  let donor = await db.queryOne('SELECT id FROM donors WHERE email = $1', [data.email]);
  if (!donor) {
    donor = await db.queryOne(
      `INSERT INTO donors (user_id, name, email, phone, type, organization, address, is_anonymous, communication_preferences)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        data.userId || null, data.name, data.email, data.phone || null,
        data.donorType || 'individual', data.organization || null,
        JSON.stringify(data.address || {}), data.isAnonymous || false,
        JSON.stringify({ newsletter: data.newsletterOptIn !== false }),
      ]
    );
  }

  // ===== 2. Create the donation =====
  const donation = await db.queryOne(
    `INSERT INTO donations (
      donor_id, user_id, amount, currency, donation_type, frequency, designation,
      program_id, project_id, campaign_id, payment_method, payment_status,
      is_anonymous, cover_fees, honoree_name, honoree_type, notify_family, message
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
    RETURNING id, donation_id, amount, currency, payment_status, created_at`,
    [
      donor.id, data.userId || null, data.amount, data.currency || 'RWF',
      data.donationType || 'one_time', data.frequency || null,
      data.designation || 'General Fund', data.programId || null,
      data.projectId || null, data.campaignId || null,
      data.paymentMethod || 'card', data.paymentStatus || 'pending',
      data.isAnonymous || false, data.coverFees || false,
      data.honoreeName || null, data.honoreeType || null,
      data.notifyFamily || false, data.message || null,
    ]
  );

  // ===== 3. Determine priority for admin alert =====
  const amount = Number(data.amount);
  let priority = 'medium';
  let alertType = 'donation_received';
  let titlePrefix = 'New Donation Received';

  if (amount >= URGENT_DONATION_THRESHOLD) {
    priority = 'urgent';
    alertType = 'major_donation';
    titlePrefix = '🎉 MAJOR Donation Received';
  } else if (amount >= MAJOR_DONATION_THRESHOLD) {
    priority = 'high';
    alertType = 'major_donation';
    titlePrefix = 'Major Donation Received';
  }

  // ===== 4. Notify admins (in-app notification) =====
  await notifyAdmins({
    type: alertType,
    title: titlePrefix,
    message: `${data.isAnonymous ? 'Anonymous donor' : data.name} donated ${amount.toLocaleString()} ${data.currency || 'RWF'} to ${data.designation || 'General Fund'}`,
    data: {
      donationId: donation.donation_id,
      donationDbId: donation.id,
      amount,
      currency: data.currency || 'RWF',
      donorName: data.isAnonymous ? 'Anonymous' : data.name,
      donorEmail: data.email,
      designation: data.designation,
      paymentMethod: data.paymentMethod,
      isMajor: amount >= MAJOR_DONATION_THRESHOLD,
      link: `/admin/donations`,
    },
    priority,
  });

  // ===== 5. Send branded thank-you email to DONOR =====
  sendEmail({
    to: data.email,
    subject: `Thank you for your donation to NCG — ${donation.donation_id}`,
    html: wrapBranded(`
      <h2 style="margin:0 0 16px 0;font-family:'Space Grotesk',Arial,sans-serif;font-size:24px;color:#031B2A;">
        Thank you, ${data.name}!
      </h2>
      <p style="font-size:15px;line-height:1.7;color:#163247;margin:0 0 14px 0;">
        Your generous donation of <strong>${amount.toLocaleString()} ${data.currency || 'RWF'}</strong>
        to <strong>${data.designation || 'General Fund'}</strong> has been received.
      </p>
      <div style="background:#F5F9FB;border-left:4px solid #8BCB2A;padding:16px 20px;border-radius:8px;margin:20px 0;">
        <p style="margin:0;font-size:13px;color:#6D7E89;">Your donation ID</p>
        <p style="margin:4px 0 0 0;font-family:'Courier New',monospace;font-size:16px;color:#064B7A;font-weight:700;">${donation.donation_id}</p>
      </div>
      <p style="font-size:15px;line-height:1.7;color:#163247;margin:0 0 14px 0;">
        Your gift directly supports:
      </p>
      <ul style="font-size:15px;line-height:1.9;color:#163247;padding-left:20px;margin:0 0 14px 0;">
        <li>Technology training for students</li>
        <li>Innovation projects across Africa</li>
        <li>Youth empowerment programs</li>
      </ul>
      <p style="font-size:15px;line-height:1.7;color:#163247;margin:20px 0 0 0;">
        We'll send you a tax receipt shortly.<br>
        Warm regards,<br>
        <strong>The NCG Team</strong>
      </p>
    `, { preheader: `Thank you for your donation of ${amount.toLocaleString()} ${data.currency || 'RWF'}` }),
  }).catch((err) => logger.error('Donation thank-you email failed', { error: err.message }));

  // ===== 6. Send branded notification email to ADMINS =====
  const adminEmails = (process.env.DONATION_ALERT_RECIPIENTS || process.env.CONTACT_RECIPIENTS || '')
    .split(',').map((s) => s.trim()).filter(Boolean);

  if (adminEmails.length > 0) {
    sendEmail({
      to: adminEmails,
      subject: `${titlePrefix} — ${amount.toLocaleString()} ${data.currency || 'RWF'}`,
      html: wrapBranded(`
        <h2 style="margin:0 0 16px 0;font-family:'Space Grotesk',Arial,sans-serif;font-size:22px;color:#031B2A;">
          ${titlePrefix}
        </h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#163247;margin-bottom:20px;">
          <tr><td style="padding:8px 0;border-bottom:1px solid #EDF2F5;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;">Donor</strong><br>${data.isAnonymous ? 'Anonymous' : data.name}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #EDF2F5;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;">Email</strong><br>${data.email}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #EDF2F5;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;">Amount</strong><br><span style="font-size:20px;color:#064B7A;font-weight:700;">${amount.toLocaleString()} ${data.currency || 'RWF'}</span></td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #EDF2F5;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;">Designation</strong><br>${data.designation || 'General Fund'}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #EDF2F5;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;">Method</strong><br>${data.paymentMethod || 'card'}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #EDF2F5;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;">Donation ID</strong><br><code style="font-family:'Courier New',monospace;color:#064B7A;">${donation.donation_id}</code></td></tr>
          ${data.message ? `<tr><td style="padding:8px 0;"><strong style="color:#6D7E89;font-size:12px;text-transform:uppercase;">Message</strong><br><em>${data.message}</em></td></tr>` : ''}
        </table>
        <p style="text-align:center;margin:20px 0 0 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/donations" style="display:inline-block;background:#8BCB2A;color:#031B2A;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:700;font-size:14px;">
            View in Admin Panel
          </a>
        </p>
      `, { preheader: `${titlePrefix}: ${amount.toLocaleString()} ${data.currency || 'RWF'}` }),
      replyTo: data.email,
    }).catch((err) => logger.error('Admin donation alert email failed', { error: err.message }));
  }

  return {
    donationId: donation.donation_id,
    id: donation.id,
    amount: donation.amount,
    currency: donation.currency,
    status: donation.payment_status,
    message: 'Thank you for your donation!',
  };
}

// ============================================================
// PUBLIC — CAMPAIGNS, DESIGNATIONS, RECOGNITION
// ============================================================
async function listCampaigns() {
  const rows = await db.queryMany(
    `SELECT id, name, slug, description, goal_amount, raised_amount, start_date, end_date, status, featured, image_url
     FROM donation_campaigns WHERE status = 'active' ORDER BY featured DESC, created_at DESC`
  );
  return rows.map((c) => ({
    id: c.id, name: c.name, slug: c.slug, description: c.description,
    goalAmount: c.goal_amount, raisedAmount: c.raised_amount,
    progress: c.goal_amount > 0 ? Math.round((c.raised_amount / c.goal_amount) * 100) : 0,
    startDate: c.start_date, endDate: c.end_date, featured: c.featured, imageUrl: c.image_url,
  }));
}

async function listDesignations() {
  const rows = await db.queryMany(`SELECT * FROM donation_designations WHERE active = TRUE ORDER BY display_order`);
  return rows.map((d) => ({ id: d.id, name: d.name, description: d.description, category: d.category }));
}

async function listRecognitionLevels() {
  const rows = await db.queryMany(`SELECT * FROM recognition_levels ORDER BY min_amount`);
  return rows.map((r) => ({ id: r.id, name: r.name, minAmount: r.min_amount, benefits: r.benefits, color: r.color, icon: r.icon }));
}

// ============================================================
// ADMIN — LIST
// ============================================================
async function listAdmin(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'created_at', 'DESC');

  const conditions = ['1=1'];
  const values = [];
  let i = 1;

  if (query.status) { conditions.push(`d.payment_status = $${i++}`); values.push(query.status); }
  if (query.designation) { conditions.push(`d.designation = $${i++}`); values.push(query.designation); }
  if (query.search) {
    conditions.push(`(dn.name ILIKE $${i} OR dn.email ILIKE $${i} OR d.donation_id ILIKE $${i})`);
    values.push(`%${query.search}%`); i++;
  }

  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(
    `SELECT COUNT(*)::int AS count FROM donations d JOIN donors dn ON dn.id = d.donor_id ${where}`,
    values
  );
  const rows = await db.queryMany(
    `SELECT d.id, d.donation_id, d.amount, d.currency, d.donation_type, d.frequency,
            d.designation, d.payment_method, d.payment_status, d.is_anonymous,
            d.created_at, dn.name AS donor_name, dn.email AS donor_email
     FROM donations d JOIN donors dn ON dn.id = d.donor_id
     ${where} ORDER BY d.${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return {
    items: rows.map((r) => ({
      id: r.id, donationId: r.donation_id, amount: r.amount, currency: r.currency,
      donationType: r.donation_type, frequency: r.frequency,
      designation: r.designation, paymentMethod: r.payment_method,
      paymentStatus: r.payment_status, isAnonymous: r.is_anonymous,
      donorName: r.donor_name, donorEmail: r.donor_email, createdAt: r.created_at,
    })),
    pagination: { page, limit, total: count.count },
  };
}

async function updateStatus(id, status) {
  const result = await db.queryOne(
    `UPDATE donations SET payment_status = $1, processed_at = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  );
  if (!result) throw new NotFoundError('Donation not found');
  return { id: result.id, status: result.payment_status };
}

async function stats() {
  const r = await db.queryOne(`
    SELECT
      COUNT(*)::int AS total_count,
      COALESCE(SUM(amount) FILTER (WHERE payment_status = 'succeeded'), 0) AS total_amount,
      COUNT(*) FILTER (WHERE payment_status = 'succeeded')::int AS succeeded_count,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS last_30_days,
      COALESCE(AVG(amount) FILTER (WHERE payment_status = 'succeeded'), 0) AS avg_amount
    FROM donations
  `);
  const recent = await db.queryMany(
    `SELECT d.donation_id, d.amount, d.currency, d.designation, d.created_at, dn.name
     FROM donations d JOIN donors dn ON dn.id = d.donor_id
     ORDER BY d.created_at DESC LIMIT 10`
  );
  return { ...r, recent };
}

module.exports = {
  createDonation, listCampaigns, listDesignations, listRecognitionLevels,
  listAdmin, updateStatus, stats,
};