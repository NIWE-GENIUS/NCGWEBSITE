// backend/src/server.js
// Entry point — starts the HTTP server

require('dotenv').config();

const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const db = require('./database');

const PORT = config.port;

async function start() {
  try {
    // Verify database connection on startup
    const info = await db.testConnection();
    logger.info('Database connected', { database: info.db, time: info.now });

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`NCG Platform API running`, {
        port: PORT,
        env: config.env,
        url: config.apiBaseUrl,
      });
      console.log(`\n🚀 NCG Platform API`);
      console.log(`   Environment: ${config.env}`);
      console.log(`   Port:        ${PORT}`);
      console.log(`   API:         ${config.apiBaseUrl}/api`);
      console.log(`   Health:      ${config.apiBaseUrl}/api/health`);
      console.log(`   Docs:        ${config.apiBaseUrl}/api\n`);
    });

    // ============================================================
    // Graceful shutdown
    // ============================================================
    const shutdown = async (signal) => {
      logger.info(`${signal} received — shutting down gracefully`);
      server.close(async () => {
        logger.info('HTTP server closed');
        await db.pool.end();
        logger.info('Database pool closed');
        process.exit(0);
      });
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection', { reason: String(reason) });
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
      process.exit(1);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  }
}

start();