// backend/src/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { BadRequestError } = require('../utils/errors');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

['images', 'documents', 'avatars'].forEach((sub) => {
  const dir = path.join(UPLOAD_DIR, sub);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let sub = 'documents';
    if (file.mimetype.startsWith('image/')) sub = 'images';
    if (req.uploadType === 'avatar') sub = 'avatars';
    cb(null, path.join(UPLOAD_DIR, sub));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const unique = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    cb(null, `${base}-${unique}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  // Accept almost everything — 50MB limit is the only real constraint
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,  // 50 MB
    files: 20,                    // max 20 files per request
  },
});

module.exports = {
  upload,
  uploadSingle: upload.single('file'),
  uploadMultiple: upload.array('files', 20),
  UPLOAD_DIR,
};