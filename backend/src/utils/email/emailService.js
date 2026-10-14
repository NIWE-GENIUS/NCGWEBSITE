// backend/src/utils/email/emailService.js
const nodemailer = require('nodemailer');
const config = require('../../config');
const logger = require('../logger');

// Create transporter once
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });

  return transporter;
}

/**
 * Send an email
 * @param {object} opts - { to, subject, html, text, replyTo }
 */
async function sendEmail({ to, subject, html, text, replyTo }) {
  try {
    const info = await getTransporter().sendMail({
      from: `"${config.email.fromName}" <${config.email.fromAddress}>`,
      to: Array.isArray(to) ? to.join(',') : to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
      replyTo,
    });

    logger.info('Email sent', { to, subject, messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    logger.error('Email send failed', { to, subject, error: err.message });
    return { success: false, error: err.message };
  }
}

module.exports = { sendEmail };