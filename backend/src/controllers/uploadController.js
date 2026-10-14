// backend/src/controllers/uploadController.js
const db = require('../database');
const { success, created } = require('../utils/response');
const { BadRequestError } = require('../utils/errors');

function buildUrl(file) {
  const rel = file.path.replace(/\\/g, '/').split('/uploads/')[1];
  return `/uploads/${rel}`;
}

async function uploadOne(req, res, next) {
  try {
    if (!req.file) throw new BadRequestError('No file uploaded');
    const url = buildUrl(req.file);

    await db.query(
      `INSERT INTO media_library (file_name, file_url, file_type, file_size, uploaded_by)
       VALUES ($1, $2, $3, $4, $5)`,
      [req.file.originalname, url, req.file.mimetype, req.file.size, req.user?.id || null]
    );

    return created(res, {
      url,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    }, 'File uploaded');
  } catch (err) { next(err); }
}

async function uploadMany(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) throw new BadRequestError('No files uploaded');
    const results = await Promise.all(req.files.map(async (file) => {
      const url = buildUrl(file);
      await db.query(
        `INSERT INTO media_library (file_name, file_url, file_type, file_size, uploaded_by)
         VALUES ($1, $2, $3, $4, $5)`,
        [file.originalname, url, file.mimetype, file.size, req.user?.id || null]
      );
      return { url, filename: file.filename, originalName: file.originalname, mimeType: file.mimetype, size: file.size };
    }));
    return created(res, results, 'Files uploaded');
  } catch (err) { next(err); }
}

async function listMedia(req, res, next) {
  try {
    const rows = await db.queryMany(`SELECT * FROM media_library ORDER BY created_at DESC LIMIT 100`);
    return success(res, rows, 'Media list');
  } catch (err) { next(err); }
}

module.exports = { uploadOne, uploadMany, listMedia };