// backend/src/config/database.js
// PostgreSQL connection pool — production-grade configuration

const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'ncg-db',
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''),

  // SSL for production
  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : false,

  // ============================================================
  // POOL SIZE — tuned for scale
  // ============================================================
  // max: how many clients can be checked out at once.
  // Rule of thumb: (CPU cores × 2) + effective_spindle_count
  // For a 4-core server: ~9-10. For heavy concurrent API: 50-100.
  // On managed Postgres (Supabase/Neon), check your connection limit!
  max: parseInt(process.env.DB_POOL_MAX, 10) || 50,

  // min: keep this many connections warm (avoid cold starts)
  min: parseInt(process.env.DB_POOL_MIN, 10) || 5,

  // idleTimeoutMillis: close idle clients after 30s (frees DB resources)
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT, 10) || 30000,

  // connectionTimeoutMillis: fail fast if DB is unreachable
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT, 10) || 10000,

  // statement_timeout: kill any single query running >30s
  statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT, 10) || 30000,

  // query_timeout: client-side query timeout
  query_timeout: parseInt(process.env.DB_QUERY_TIMEOUT, 10) || 30000,

  // application_name: useful for DB monitoring
  application_name: 'ncg-platform-api',

  // allowExitOnIdle: exit process if all clients idle (dev only)
  allowExitOnIdle: !isProduction,
});

// ============================================================
// LOGGING & MONITORING
// ============================================================
pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL pool error:', err.message);
  if (isProduction) {
    // In production, log to your monitoring system (Sentry, LogRocket, etc.)
  }
});

pool.on('connect', () => {
  if (!isProduction) {
    // Silenced in production to avoid log spam
    // console.log('PostgreSQL pool: new client connected');
  }
});

pool.on('acquire', () => {
  // Fired when a client is checked out — useful for monitoring pool pressure
});

pool.on('remove', () => {
  // Fired when a client is removed from the pool
});

// ============================================================
// HELPER — Pool stats for /api/health
// ============================================================
function poolStats() {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
    max: pool.options.max,
    min: pool.options.min,
  };
}

module.exports = pool;
module.exports.poolStats = poolStats;