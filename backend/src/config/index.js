// backend/src/config/index.js
// Centralized configuration

require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || 'ncg-db',
    user: process.env.DB_USER || 'postgres',
    password: String(process.env.DB_PASSWORD || ''),
    ssl: process.env.DB_SSL === 'true',
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    fromName: process.env.EMAIL_FROM_NAME,
    fromAddress: process.env.EMAIL_FROM_ADDRESS,
    recipients: (process.env.CONTACT_RECIPIENTS || '').split(',').filter(Boolean),
  },

  company: {
    name: process.env.COMPANY_NAME,
    email: process.env.COMPANY_EMAIL,
    phone: process.env.COMPANY_PHONE,
    website: process.env.COMPANY_WEBSITE,
  },

 rateLimit: {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100000,
  authWindowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  authMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 200,
  burstWindowMs: parseInt(process.env.BURST_RATE_LIMIT_WINDOW_MS, 10) || 1000,
  burstMax: parseInt(process.env.BURST_RATE_LIMIT_MAX, 10) || 500,
},

  logLevel: process.env.LOG_LEVEL || 'info',
};