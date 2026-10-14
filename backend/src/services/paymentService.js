// backend/src/services/paymentService.js
const db = require('../database');
const { NotFoundError } = require('../utils/errors');
const { getPagination } = require('../utils/pagination');
const logger = require('../utils/logger');

// Note: Real Stripe integration requires STRIPE_SECRET_KEY in .env
// For now, this module records payments manually and prepares the structure
// so that plugging in Stripe later is a 10-line change.

async function createPaymentIntent({ userId, amount, currency = 'RWF', referenceType, referenceId, metadata }) {
  const r = await db.queryOne(
    `INSERT INTO payments (user_id, amount, currency, payment_method, payment_gateway, status, reference_id, reference_type, metadata)
     VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8) RETURNING id, payment_id, amount, currency, status`,
    [userId || null, amount, currency, 'card', 'manual', referenceId || null, referenceType || null, JSON.stringify(metadata || {})]
  );

  // TODO: When Stripe is configured:
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // const intent = await stripe.paymentIntents.create({ amount: amount * 100, currency: currency.toLowerCase(), metadata: { paymentId: r.id } });
  // await db.query(`UPDATE payments SET transaction_id = $1 WHERE id = $2`, [intent.id, r.id]);
  // return { ...r, clientSecret: intent.client_secret };

  return { id: r.id, paymentId: r.payment_id, amount: r.amount, currency: r.currency, status: r.status };
}

async function confirmPayment(paymentId, { transactionId, status = 'succeeded', errorMessage }) {
  const r = await db.queryOne(
    `UPDATE payments SET status = $1, transaction_id = $2, error_message = $3, processed_at = NOW()
     WHERE id = $4 RETURNING *`,
    [status, transactionId || null, errorMessage || null, paymentId]
  );
  if (!r) throw new NotFoundError('Payment not found');

  // If this was a donation payment, mark donation as succeeded
  if (r.reference_type === 'donation' && r.reference_id) {
    await db.query(`UPDATE donations SET payment_status = $1, processed_at = NOW() WHERE id = $2`, [status, r.reference_id]);
  }
  return { id: r.id, status: r.status };
}

async function listAdmin(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const conditions = ['1=1'];
  const values = [];
  let i = 1;
  if (query.status) { conditions.push(`status = $${i++}`); values.push(query.status); }
  if (query.gateway) { conditions.push(`payment_gateway = $${i++}`); values.push(query.gateway); }
  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM payments ${where}`, values);
  const rows = await db.queryMany(`SELECT * FROM payments ${where} ORDER BY created_at DESC LIMIT $${i} OFFSET $${i + 1}`, [...values, limit, offset]);
  return {
    items: rows.map((r) => ({ id: r.id, paymentId: r.payment_id, userId: r.user_id, amount: r.amount, currency: r.currency, paymentMethod: r.payment_method, paymentGateway: r.payment_gateway, transactionId: r.transaction_id, status: r.status, referenceType: r.reference_type, referenceId: r.reference_id, createdAt: r.created_at })),
    pagination: { page, limit, total: count.count },
  };
}

async function refund(paymentId, { amount, reason, adminId }) {
  const payment = await db.queryOne(`SELECT * FROM payments WHERE id = $1`, [paymentId]);
  if (!payment) throw new NotFoundError('Payment not found');

  const refundAmount = amount || payment.amount;
  const r = await db.queryOne(
    `INSERT INTO refunds (payment_id, amount, reason, status, processed_by, processed_at)
     VALUES ($1, $2, $3, 'succeeded', $4, NOW()) RETURNING *`,
    [paymentId, refundAmount, reason || null, adminId]
  );
  await db.query(`UPDATE payments SET status = 'refunded' WHERE id = $1`, [paymentId]);

  if (payment.reference_type === 'donation' && payment.reference_id) {
    await db.query(`UPDATE donations SET payment_status = 'refunded' WHERE id = $1`, [payment.reference_id]);
  }
  return { id: r.id, amount: r.amount, status: r.status };
}

async function stats() {
  const r = await db.queryOne(`
    SELECT
      COUNT(*)::int AS total,
      COALESCE(SUM(amount) FILTER (WHERE status = 'succeeded'), 0) AS total_amount,
      COUNT(*) FILTER (WHERE status = 'succeeded')::int AS succeeded,
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE status = 'failed')::int AS failed,
      COUNT(*) FILTER (WHERE status = 'refunded')::int AS refunded
    FROM payments
  `);
  return r;
}

module.exports = { createPaymentIntent, confirmPayment, listAdmin, refund, stats };