// backend/scripts/debug-db.js
// Debug script to see exactly what Node.js sends to PostgreSQL

require('dotenv').config();
const { Pool } = require('pg');

console.log('\n=== Debug Info ===');
console.log('cwd:', process.cwd());
console.log('DB_HOST:', JSON.stringify(process.env.DB_HOST));
console.log('DB_PORT:', JSON.stringify(process.env.DB_PORT));
console.log('DB_NAME:', JSON.stringify(process.env.DB_NAME));
console.log('DB_USER:', JSON.stringify(process.env.DB_USER));

const pwd = process.env.DB_PASSWORD || '';
console.log('DB_PASSWORD length:', pwd.length);
console.log('DB_PASSWORD first char:', JSON.stringify(pwd[0]));
console.log('DB_PASSWORD last char:', JSON.stringify(pwd[pwd.length - 1]));
console.log('DB_PASSWORD has quotes:', pwd.includes('"'));
console.log('DB_PASSWORD has leading space:', pwd !== pwd.trimStart());
console.log('DB_PASSWORD has trailing space:', pwd !== pwd.trimEnd());
console.log('DB_PASSWORD == "genius@123H":', pwd === 'genius@123H');
console.log('DB_PASSWORD == "genius@123h":', pwd === 'genius@123h');
console.log('DB_PASSWORD == "Genius@123H":', pwd === 'Genius@123H');
console.log('==================\n');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: pwd,
});

pool.query('SELECT current_database() AS db, current_user AS usr, NOW() AS now')
  .then((res) => {
    console.log('✅ SUCCESS:', res.rows[0]);
    pool.end();
  })
  .catch((err) => {
    console.error('❌ FAILED:', err.message);
    console.error('Full error:', err);
    pool.end();
  });