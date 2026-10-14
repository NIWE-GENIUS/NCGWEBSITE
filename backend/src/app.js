// backend/src/app.js
// Express application setup

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const routes = require('./routes');
const { errorHandler, notFound, requestLogger } = require('./middleware');

const app = express();

// ============================================================
// SECURITY
// ============================================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow /uploads to be served
}));

// ============================================================
// STATIC FILES (uploads)
// ============================================================
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), {
  maxAge: '7d',
  etag: true,
}));

// ============================================================
// CORS
// ============================================================
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // In development, allow any localhost origin
    if (process.env.NODE_ENV === 'development' && /^http:\/\/localhost:\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin not allowed — ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Limit'],
}));

// ============================================================
// RATE LIMITING
// ============================================================
// ============================================================
// RATE LIMITING — Production-grade with multiple tiers
// ============================================================

// Tier 1: Global limiter — very generous, mostly a DDoS guard
const globalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,          // 60 seconds
  max: config.rateLimit.max,                     // 100,000 requests
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for these paths (health checks should never be limited)
  skip: (req) => {
    return req.path === '/health' || req.path === '/api/health';
  },
  // Return JSON instead of HTML
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP. Please slow down.',
      code: 'TOO_MANY_REQUESTS',
      retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
    });
  },
});

// Tier 2: Burst limiter — catches rapid-fire bursts within 1 second
const burstLimiter = rateLimit({
  windowMs: config.rateLimit.burstWindowMs,      // 1 second
  max: config.rateLimit.burstMax,                // 500 requests/sec
  standardHeaders: false,
  legacyHeaders: false,
  skip: (req) => req.path === '/health' || req.path === '/api/health',
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Request burst detected. Slow down.',
      code: 'BURST_LIMIT',
    });
  },
});

// Tier 3: Auth limiter — protects login/register/reset from brute force
const authLimiter = rateLimit({
  windowMs: config.rateLimit.authWindowMs,       // 15 minutes
  max: config.rateLimit.authMax,                 // 200 attempts
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests — only count failures
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again later.',
      code: 'TOO_MANY_AUTH_ATTEMPTS',
    });
  },
});

// Apply burst limiter globally (very permissive)
app.use('/api', burstLimiter);

// Apply global limiter
app.use('/api', globalLimiter);

// Apply auth limiter ONLY to auth-sensitive endpoints
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);

// ============================================================
// BODY PARSING & COMPRESSION
// ============================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// ============================================================
// LOGGING
// ============================================================
app.use(requestLogger);

// ============================================================
// TRUST PROXY (for correct req.ip behind reverse proxy)
// ============================================================
app.set('trust proxy', 1);

// ============================================================
// ROOT HEALTH CHECK (before /api prefix)
// ============================================================
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'NCG Platform API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// API ROUTES
// ============================================================
app.use('/api', routes);

// ============================================================
// 404 & ERROR HANDLING (must be last)
// ============================================================
app.use(notFound);
app.use(errorHandler);

module.exports = app;