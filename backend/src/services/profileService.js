// backend/src/services/profileService.js
const db = require('../database');
const { NotFoundError } = require('../utils/errors');

/**
 * Get profile by user ID
 */
async function getByUserId(userId) {
  const profile = await db.queryOne(
    `SELECT p.*, u.email, u.first_name, u.last_name, u.avatar_url, u.role
     FROM profiles p
     JOIN users u ON u.id = p.user_id
     WHERE p.user_id = $1 AND p.deleted_at IS NULL`,
    [userId]
  );
  if (!profile) throw new NotFoundError('Profile not found');
  return formatProfile(profile);
}

/**
 * Update profile
 */
async function update(userId, updates) {
  const allowed = [
    'bio', 'headline', 'location', 'country', 'city', 'timezone', 'language',
    'website', 'company', 'position', 'industry', 'date_of_birth', 'gender',
    'education', 'experience', 'skills', 'interests', 'social_links', 'preferences',
  ];

  const fields = [];
  const values = [];
  let i = 1;

  for (const [key, value] of Object.entries(updates)) {
    if (allowed.includes(key) && value !== undefined) {
      fields.push(`${key} = $${i++}`);
      values.push(typeof value === 'object' ? JSON.stringify(value) : value);
    }
  }

  if (fields.length === 0) {
    return getByUserId(userId);
  }

  values.push(userId);
  const updated = await db.queryOne(
    `UPDATE profiles SET ${fields.join(', ')}, updated_at = NOW()
     WHERE user_id = $${i} AND deleted_at IS NULL
     RETURNING *`,
    values
  );

  if (!updated) throw new NotFoundError('Profile not found');

  // Recalculate completion percentage
  await recalcCompletion(userId);

  return getByUserId(userId);
}

/**
 * Recalculate profile completion
 */
async function recalcCompletion(userId) {
  const p = await db.queryOne('SELECT * FROM profiles WHERE user_id = $1', [userId]);
  if (!p) return 0;

  const fields = ['bio', 'headline', 'location', 'country', 'city', 'website', 'company', 'position', 'industry'];
  const arrays = ['education', 'experience', 'skills', 'interests'];

  let filled = 0;
  const total = fields.length + arrays.length;

  fields.forEach((f) => { if (p[f]) filled += 1; });
  arrays.forEach((f) => {
    const v = p[f];
    if (Array.isArray(v) && v.length > 0) filled += 1;
  });

  const percent = Math.round((filled / total) * 100);
  await db.query('UPDATE profiles SET completion_percentage = $1 WHERE user_id = $2', [percent, userId]);
  return percent;
}

/**
 * Upload avatar (metadata only — real upload will use Cloudinary later)
 */
async function setAvatar(userId, avatarUrl) {
  await db.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [avatarUrl, userId]);
  return { avatarUrl };
}

function formatProfile(row) {
  return {
    userId: row.user_id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    avatarUrl: row.avatar_url,
    role: row.role,
    headline: row.headline,
    bio: row.bio,
    location: row.location,
    country: row.country,
    city: row.city,
    timezone: row.timezone,
    language: row.language,
    website: row.website,
    company: row.company,
    position: row.position,
    industry: row.industry,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    education: row.education,
    experience: row.experience,
    skills: row.skills,
    interests: row.interests,
    socialLinks: row.social_links,
    preferences: row.preferences,
    completionPercentage: row.completion_percentage,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

module.exports = {
  getByUserId,
  update,
  recalcCompletion,
  setAvatar,
};