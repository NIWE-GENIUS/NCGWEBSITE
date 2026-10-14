// backend/src/utils/email/index.js
const { sendEmail } = require('./emailService');
const templates = require('./authTemplates');

module.exports = {
  sendEmail,
  templates,
};