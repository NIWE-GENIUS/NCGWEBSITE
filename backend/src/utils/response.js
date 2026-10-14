// backend/src/utils/response.js
// Standardized API responses

/**
 * Success response
 */
function success(res, data = null, message = 'Success', statusCode = 200, meta = null) {
  const body = {
    success: true,
    message,
    data,
  };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

/**
 * Created response (201)
 */
function created(res, data = null, message = 'Created successfully') {
  return success(res, data, message, 201);
}

/**
 * No content (204)
 */
function noContent(res) {
  return res.status(204).send();
}

/**
 * Error response
 */
function error(res, message = 'Something went wrong', statusCode = 500, code = 'ERROR', details = null) {
  const body = {
    success: false,
    message,
    code,
  };
  if (details) body.details = details;
  return res.status(statusCode).json(body);
}

/**
 * Paginated response
 */
function paginated(res, items, pagination, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    data: items,
    meta: {
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit),
        hasNext: pagination.page * pagination.limit < pagination.total,
        hasPrev: pagination.page > 1,
      },
    },
  });
}

module.exports = {
  success,
  created,
  noContent,
  error,
  paginated,
};