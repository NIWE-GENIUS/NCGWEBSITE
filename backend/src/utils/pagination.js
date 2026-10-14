// backend/src/utils/pagination.js

/**
 * Parse pagination query params
 */
function getPagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

/**
 * Parse sorting query params
 */
function getSorting(query, allowedFields = [], defaultField = 'created_at', defaultOrder = 'DESC') {
  const sortBy = allowedFields.includes(query.sortBy) ? query.sortBy : defaultField;
  const order = (query.order || defaultOrder).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  return { sortBy, order };
}

/**
 * Build WHERE clause from filters
 */
function buildWhereClause(filters = {}) {
  const conditions = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue;

    if (key.endsWith('_like')) {
      const field = key.slice(0, -5);
      conditions.push(`${field} ILIKE $${i}`);
      values.push(`%${value}%`);
    } else if (key.endsWith('_gte')) {
      const field = key.slice(0, -4);
      conditions.push(`${field} >= $${i}`);
      values.push(value);
    } else if (key.endsWith('_lte')) {
      const field = key.slice(0, -4);
      conditions.push(`${field} <= $${i}`);
      values.push(value);
    } else {
      conditions.push(`${key} = $${i}`);
      values.push(value);
    }
    i++;
  }

  return {
    clause: conditions.length ? 'WHERE ' + conditions.join(' AND ') : '',
    values,
    nextIndex: i,
  };
}

module.exports = { getPagination, getSorting, buildWhereClause };
/**
 * Build a safe ORDER BY clause
 */
function safeOrder(order) {
  return (order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
}

module.exports.safeOrder = safeOrder;