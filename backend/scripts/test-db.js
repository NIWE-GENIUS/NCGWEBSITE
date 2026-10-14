// backend/scripts/test-db.js
// Standalone script to test DB connection

require('dotenv').config();
const db = require('../src/database');

async function main() {
  try {
    console.log('\n🔍 Testing PostgreSQL connection...\n');
    console.log('Config:');
    console.log('  Host:', process.env.DB_HOST);
    console.log('  Port:', process.env.DB_PORT);
    console.log('  Database:', process.env.DB_NAME);
    console.log('  User:', process.env.DB_USER);
    console.log('  Password:', process.env.DB_PASSWORD ? '(set, length ' + process.env.DB_PASSWORD.length + ')' : '(EMPTY)');
    console.log('');

    const info = await db.testConnection();
    console.log('✅ Connected to:', info.db);
    console.log('   Server time:', info.now);

    const tables = await db.queryOne(
      `SELECT COUNT(*)::int AS count FROM information_schema.tables 
       WHERE table_schema='public' AND table_type='BASE TABLE'`
    );
    console.log('📊 Tables:', tables.count);

    const users = await db.queryOne('SELECT COUNT(*)::int AS count FROM users');
    console.log('👥 Users:', users.count);

    const roles = await db.queryOne('SELECT COUNT(*)::int AS count FROM roles');
    console.log('🎭 Roles:', roles.count);

    const programs = await db.queryOne('SELECT COUNT(*)::int AS count FROM programs');
    console.log('📚 Programs:', programs.count);

    const sample = await db.queryMany(
      'SELECT email, role FROM users ORDER BY role LIMIT 5'
    );
    console.log('\n📋 Sample users:');
    sample.forEach((u) => console.log(`   - ${u.email} (${u.role})`));

    console.log('\n✅ All database tests passed!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database test failed:\n', error.message);
    console.error('\n💡 Debug info:');
    console.error('   DB_HOST:', JSON.stringify(process.env.DB_HOST));
    console.error('   DB_PORT:', JSON.stringify(process.env.DB_PORT));
    console.error('   DB_NAME:', JSON.stringify(process.env.DB_NAME));
    console.error('   DB_USER:', JSON.stringify(process.env.DB_USER));
    console.error('   DB_PASSWORD length:', (process.env.DB_PASSWORD || '').length);
    console.error('\nIf "database does not exist", your database is named:', process.env.DB_NAME);
    console.error('   Try connecting manually:');
    console.error('   "C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe" -U postgres -h localhost -d "' + process.env.DB_NAME + '"');
    process.exit(1);
  }
}

main();