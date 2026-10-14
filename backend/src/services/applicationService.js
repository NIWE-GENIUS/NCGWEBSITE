// backend/src/services/applicationService.js
const db = require('../database');
const { NotFoundError, BadRequestError, ConflictError } = require('../utils/errors');
const { getPagination, getSorting } = require('../utils/pagination');
const { sendEmail } = require('../utils/email');
const logger = require('../utils/logger');

const ALLOWED_SORT = ['created_at', 'submitted_at', 'status'];
const STATUSES = ['draft', 'submitted', 'under_review', 'shortlisted', 'interview', 'accepted', 'rejected', 'waitlisted', 'withdrawn'];

// ============================================================
// PUBLIC — SUBMIT APPLICATION
// ============================================================
async function submit({ userId, programId, cohortId, trackId, personalInfo, education, experience, motivation, documents, extraData }) {
  const program = await db.queryOne(`SELECT id, name, slug FROM programs WHERE id = $1 AND published = TRUE`, [programId]);
  if (!program) throw new NotFoundError('Program not found or not open for applications');

  // Prevent duplicate applications for same program (unless withdrawn/rejected)
  if (userId) {
    const existing = await db.queryOne(
      `SELECT id, status FROM applications WHERE user_id = $1 AND program_id = $2 AND status NOT IN ('withdrawn', 'rejected')`,
      [userId, programId]
    );
    if (existing) throw new ConflictError('You already have an active application for this program');
  }

  const result = await db.queryOne(
    `INSERT INTO applications (
      user_id, program_id, cohort_id, track_id, status,
      personal_info, education, experience, motivation, documents, extra_data, submitted_at
    ) VALUES ($1,$2,$3,$4,'submitted',$5,$6,$7,$8,$9,$10,NOW())
    RETURNING id, application_id, status, submitted_at, program_id`,
    [
      userId || null, programId, cohortId || null, trackId || null,
      JSON.stringify(personalInfo || {}),
      JSON.stringify(education || []),
      JSON.stringify(experience || []),
      motivation || null,
      JSON.stringify(documents || []),
      JSON.stringify(extraData || {}),
    ]
  );

  // Notify applicant (if user with email)
  if (userId) {
    const user = await db.queryOne(`SELECT email, first_name FROM users WHERE id = $1`, [userId]);
    if (user) {
      sendEmail({
        to: user.email,
        subject: `Application received — ${program.name}`,
        html: `<h1>Application received</h1>
          <p>Hi ${user.first_name},</p>
          <p>We received your application for <strong>${program.name}</strong>.</p>
          <p><strong>Application ID:</strong> ${result.application_id}</p>
          <p>We will review it and get back to you soon.</p>
          <p>— NCG Team</p>`,
      }).catch((err) => logger.error('Application email failed', { error: err.message }));
    }
  }

  return {
    id: result.id,
    applicationId: result.application_id,
    status: result.status,
    submittedAt: result.submitted_at,
    message: 'Application submitted successfully',
  };
}

// ============================================================
// USER — MY APPLICATIONS
// ============================================================
async function listMine(userId, query = {}) {
  const { page, limit, offset } = getPagination(query);
  const conditions = ['a.user_id = $1'];
  const values = [userId];
  let i = 2;

  if (query.status) { conditions.push(`a.status = $${i++}`); values.push(query.status); }

  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM applications a ${where}`, values);
  const rows = await db.queryMany(
    `SELECT a.id, a.application_id, a.status, a.submitted_at, a.reviewed_at, a.decision,
            p.name AS program_name, p.slug AS program_slug, p.category AS program_category
     FROM applications a
     JOIN programs p ON p.id = a.program_id
     ${where} ORDER BY a.created_at DESC LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return { items: rows.map(formatApp), pagination: { page, limit, total: count.count } };
}

async function getMyApplication(userId, id) {
  const app = await db.queryOne(
    `SELECT a.*, p.name AS program_name, p.slug AS program_slug
     FROM applications a JOIN programs p ON p.id = a.program_id
     WHERE a.id = $1 AND a.user_id = $2`,
    [id, userId]
  );
  if (!app) throw new NotFoundError('Application not found');
  return formatAppDetail(app);
}

async function withdraw(userId, id) {
  const app = await db.queryOne(
    `SELECT id, status FROM applications WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  if (!app) throw new NotFoundError('Application not found');
  if (['accepted', 'rejected'].includes(app.status)) throw new BadRequestError('Cannot withdraw this application');

  await db.query(`UPDATE applications SET status = 'withdrawn', updated_at = NOW() WHERE id = $1`, [id]);
  return { message: 'Application withdrawn' };
}

// ============================================================
// ADMIN
// ============================================================
async function listAdmin(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'created_at', 'DESC');

  const conditions = ['1=1'];
  const values = [];
  let i = 1;

  if (query.status) { conditions.push(`a.status = $${i++}`); values.push(query.status); }
  if (query.programId) { conditions.push(`a.program_id = $${i++}`); values.push(query.programId); }
  if (query.search) {
    conditions.push(`(u.email ILIKE $${i} OR u.first_name ILIKE $${i} OR u.last_name ILIKE $${i} OR a.application_id ILIKE $${i})`);
    values.push(`%${query.search}%`); i++;
  }

  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(
    `SELECT COUNT(*)::int AS count FROM applications a LEFT JOIN users u ON u.id = a.user_id ${where}`,
    values
  );
  const rows = await db.queryMany(
    `SELECT a.id, a.application_id, a.status, a.submitted_at, a.decision, a.reviewed_at,
            p.name AS program_name, p.id AS program_id,
            u.id AS user_id, u.email, u.first_name, u.last_name, u.phone
     FROM applications a
     JOIN programs p ON p.id = a.program_id
     LEFT JOIN users u ON u.id = a.user_id
     ${where} ORDER BY a.${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return { items: rows.map(formatAdminApp), pagination: { page, limit, total: count.count } };
}

async function getAdminById(id) {
  const app = await db.queryOne(
    `SELECT a.*, p.name AS program_name, p.slug AS program_slug,
            u.email, u.first_name, u.last_name, u.phone
     FROM applications a
     JOIN programs p ON p.id = a.program_id
     LEFT JOIN users u ON u.id = a.user_id
     WHERE a.id = $1`,
    [id]
  );
  if (!app) throw new NotFoundError('Application not found');
  return formatAdminAppDetail(app);
}

async function review(id, { adminId, status, decision, decisionNotes }) {
  if (!STATUSES.includes(status)) throw new BadRequestError('Invalid status');

  const result = await db.queryOne(
    `UPDATE applications
     SET status = $1, decision = $2, decision_notes = $3, reviewed_by = $4, reviewed_at = NOW(), updated_at = NOW()
     WHERE id = $5 RETURNING *`,
    [status, decision || status, decisionNotes || null, adminId, id]
  );
  if (!result) throw new NotFoundError('Application not found');

  // Notify applicant
  if (result.user_id) {
    const user = await db.queryOne(`SELECT email, first_name FROM users WHERE id = $1`, [result.user_id]);
    const program = await db.queryOne(`SELECT name FROM programs WHERE id = $1`, [result.program_id]);
    if (user) {
      sendEmail({
        to: user.email,
        subject: `Application update — ${program?.name || 'Program'}`,
        html: `<h1>Application status update</h1>
          <p>Hi ${user.first_name},</p>
          <p>Your application for <strong>${program?.name}</strong> is now: <strong>${status}</strong>.</p>
          ${decisionNotes ? `<p><em>${decisionNotes}</em></p>` : ''}
          <p>— NCG Team</p>`,
      }).catch((err) => logger.error('Application status email failed', { error: err.message }));
    }
  }

  return formatAdminAppDetail(result);
}

async function stats() {
  const r = await db.queryOne(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'submitted')::int AS submitted,
      COUNT(*) FILTER (WHERE status = 'under_review')::int AS under_review,
      COUNT(*) FILTER (WHERE status = 'accepted')::int AS accepted,
      COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS last_30_days
    FROM applications
  `);
  return r;
}

function formatApp(r) {
  return {
    id: r.id, applicationId: r.application_id, status: r.status,
    submittedAt: r.submitted_at, reviewedAt: r.reviewed_at, decision: r.decision,
    program: { name: r.program_name, slug: r.program_slug, category: r.program_category },
  };
}

function formatAppDetail(r) {
  return {
    ...formatApp(r),
    personalInfo: r.personal_info, education: r.education, experience: r.experience,
    motivation: r.motivation, documents: r.documents, extraData: r.extra_data,
    decisionNotes: r.decision_notes, updatedAt: r.updated_at,
  };
}

function formatAdminApp(r) {
  return {
    id: r.id, applicationId: r.application_id, status: r.status,
    submittedAt: r.submitted_at, decision: r.decision,
    program: { id: r.program_id, name: r.program_name },
    applicant: r.user_id ? { id: r.user_id, email: r.email, firstName: r.first_name, lastName: r.last_name, phone: r.phone } : null,
  };
}

function formatAdminAppDetail(r) {
  return {
    ...formatAdminApp(r),
    personalInfo: r.personal_info, education: r.education, experience: r.experience,
    motivation: r.motivation, documents: r.documents, extraData: r.extra_data,
    decisionNotes: r.decision_notes, reviewedAt: r.reviewed_at, updatedAt: r.updated_at,
  };
}

module.exports = { submit, listMine, getMyApplication, withdraw, listAdmin, getAdminById, review, stats };