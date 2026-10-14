// backend/src/utils/slugify.js

/**
 * Convert a string to a URL-friendly slug
 * "Smart Irrigation System" → "smart-irrigation-system"
 */
function slugify(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')     // remove non-alphanumeric
    .replace(/\s+/g, '-')             // spaces to hyphens
    .replace(/-+/g, '-')              // collapse hyphens
    .replace(/^-+|-+$/g, '');         // trim hyphens
}

/**
 * Create a unique slug by appending a counter
 * @param {function} checkExists - async (slug) => boolean
 */
async function uniqueSlug(base, checkExists, maxAttempts = 20) {
  let slug = slugify(base);
  if (!slug) slug = 'item';

  let candidate = slug;
  let counter = 1;

  while (await checkExists(candidate)) {
    candidate = `${slug}-${counter}`;
    counter++;
    if (counter > maxAttempts) {
      candidate = `${slug}-${Date.now()}`;
      break;
    }
  }
  return candidate;
}

module.exports = { slugify, uniqueSlug };