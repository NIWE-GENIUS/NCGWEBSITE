// backend/src/utils/tokens.js
const crypto = require('crypto');

/**
 * Generate a random hex token
 */
function generateToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Generate a numeric OTP code
 */
function generateNumericCode(length = 6) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

/**
 * Calculate expiry timestamp
 * @param {number} amount - number of units
 * @param {string} unit - 'hours' | 'minutes' | 'days' | 'seconds'
 */
function expiresIn(amount, unit = 'hours') {
  const ms = {
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
  }[unit];
  return new Date(Date.now() + amount * ms);
}

module.exports = {
  generateToken,
  generateNumericCode,
  expiresIn,
};