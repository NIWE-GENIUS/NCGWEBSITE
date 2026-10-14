// backend/src/middleware/errorHandler.js
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

function errorHandler(err, req, res, next) {
  // Default
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let code = err.code || 'INTERNAL_ERROR';
  let details = err.details || null;

  // PostgreSQL errors
  if (err.code === '23505') {
    statusCode = 409;
    message = 'Resource already exists';
    code = 'DUPLICATE_ERROR';
    details = err.detail;
  } else if (err.code === '23503') {
    statusCode = 400;
    message = 'Related resource not found';
    code = 'FOREIGN_KEY_ERROR';
    details = err.detail;
  } else if (err.code === '23502') {
    statusCode = 400;
    message = 'Required field missing';
    code = 'NOT_NULL_VIOLATION';
    details = err.column;
  } else if (err.code === '22P02') {
    statusCode = 400;
    message = 'Invalid input format';
    code = 'INVALID_INPUT';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  }

  // Log non-operational errors
  if (!err.isOperational || statusCode >= 500) {
    logger.error(message, {
      statusCode,
      code,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.warn(message, {
      statusCode,
      code,
      path: req.path,
      method: req.method,
    });
  }

  const body = {
    success: false,
    message,
    code,
  };

  if (details) body.details = details;

  // Include stack in development
  if (process.env.NODE_ENV === 'development' && err.stack) {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
}

module.exports = errorHandler;