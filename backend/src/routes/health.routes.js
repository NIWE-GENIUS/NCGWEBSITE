// backend/src/routes/health.routes.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const asyncHandler = require('../utils/asyncHandler');

// ============================================================
// GET /api/health — Full health check (includes pool stats)
// ============================================================
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const info = await db.testConnection();
    const pool = require('../config/database');

    res.json({
      success: true,
      message: 'NCG Platform API is healthy',
      data: {
        status: 'ok',
        database: info.db,
        serverTime: info.now,
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        pool: {
          total: pool.totalCount,
          idle: pool.idleCount,
          waiting: pool.waitingCount,
          max: pool.options.max,
          min: pool.options.min,
        },
      },
    });
  })
);

// ============================================================
// GET /api/health/live — Liveness probe (no DB check)
// ============================================================
router.get('/live', (req, res) => {
  res.json({ success: true, status: 'alive' });
});

// ============================================================
// GET /api/health/ready — Readiness probe (DB ping)
// ============================================================
router.get(
  '/ready',
  asyncHandler(async (req, res) => {
    await db.query('SELECT 1');
    res.json({ success: true, status: 'ready' });
  })
);

// ============================================================
// GET /api/health/pool — Pool stats only (for monitoring)
// ============================================================
router.get('/pool', (req, res) => {
  const pool = require('../config/database');
  res.json({
    success: true,
    data: {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount,
      max: pool.options.max,
      min: pool.options.min,
    },
  });
});

module.exports = router;