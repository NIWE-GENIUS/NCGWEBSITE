// backend/src/database/index.js
// Database client with helper methods

const pool = require('../config/database');

/**
 * Run a query with parameters
 */
async function query(text, params = []) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.LOG_LEVEL === 'debug') {
      console.log('Query executed', { text: text.slice(0, 80), duration, rows: result.rowCount });
    }
    return result;
  } catch (error) {
    console.error('Database query error:', { text, error: error.message });
    throw error;
  }
}

/**
 * Get a single row
 */
async function queryOne(text, params = []) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

/**
 * Get many rows
 */
async function queryMany(text, params = []) {
  const result = await query(text, params);
  return result.rows;
}

/**
 * Run inside a transaction
 */
async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Test the connection
 */
async function testConnection() {
  const result = await query('SELECT NOW() AS now, current_database() AS db');
  return result.rows[0];
}

module.exports = {
  pool,
  query,
  queryOne,
  queryMany,
  transaction,
  testConnection,
};