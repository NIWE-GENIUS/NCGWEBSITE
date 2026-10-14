// backend/src/utils/email/authTemplates.js
const { wrapBranded, CONTENT } = require('./brandedTemplate');

function welcomeEmail({ firstName }) {
  return wrapBranded(CONTENT.welcome({ firstName }), { preheader: `Welcome to NCG, ${firstName}!` });
}

function verificationEmail({ firstName, verificationUrl }) {
  return wrapBranded(CONTENT.verification({ firstName, verificationUrl }), { preheader: 'Verify your NCG email' });
}

function passwordResetEmail({ firstName, resetUrl }) {
  return wrapBranded(CONTENT.passwordReset({ firstName, resetUrl }), { preheader: 'Reset your NCG password' });
}

module.exports = { welcomeEmail, verificationEmail, passwordResetEmail };