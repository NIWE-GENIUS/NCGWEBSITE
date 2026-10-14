// backend/src/middleware/requestLogger.js
const morgan = require('morgan');

// Development: colorized and concise
const devFormat = ':method :url :status :response-time ms - :res[content-length]';

// Production: structured
const prodFormat = ':remote-addr - :method :url :status :response-time ms';

const requestLogger = morgan(
  process.env.NODE_ENV === 'production' ? prodFormat : devFormat
);

module.exports = requestLogger;