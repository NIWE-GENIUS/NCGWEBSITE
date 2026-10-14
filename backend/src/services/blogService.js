// backend/src/services/blogService.js
const db = require('../database');
const { NotFoundError } = require('../utils/errors');
const { getPagination, getSorting } = require('../utils/pagination');
const { uniqueSlug } = require('../utils/slugify');

const ALLOWED_SORT = ['published_at', 'created_at', 'title', 'views'];

// ============================================================
// PUBLIC
// ============================================================
async function listPublic(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'published_at', 'DESC');

  const conditions = [`status = 'published'`, 'published_at <= NOW()'];
  const values = [];
  let i = 1;

  if (query.category) {
    conditions.push(`category_id = (SELECT id FROM blog_categories WHERE slug = $${i++})`);
    values.push(query.category);
  }
  if (query.tag) { conditions.push(`tags @> $${i++}::jsonb`); values.push(JSON.stringify([query.tag])); }
  if (query.search) {
    conditions.push(`(title ILIKE $${i} OR excerpt ILIKE $${i})`);
    values.push(`%${query.search}%`); i++;
  }

  const where = 'WHERE ' + conditions.join(' AND ');

  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM blog_posts ${where}`, values);
  const rows = await db.queryMany(
    `SELECT p.id, p.slug, p.title, p.excerpt, p.featured_image, p.tags, p.published_at,
            p.read_time, p.views, u.first_name, u.last_name,
            c.name AS category_name, c.slug AS category_slug
     FROM blog_posts p
     LEFT JOIN users u ON u.id = p.author_id
     LEFT JOIN blog_categories c ON c.id = p.category_id
     ${where} ORDER BY p.${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return { items: rows.map(formatPost), pagination: { page, limit, total: count.count } };
}

async function getBySlug(slug) {
  const post = await db.queryOne(
    `SELECT p.*, u.first_name, u.last_name, c.name AS category_name, c.slug AS category_slug
     FROM blog_posts p
     LEFT JOIN users u ON u.id = p.author_id
     LEFT JOIN blog_categories c ON c.id = p.category_id
     WHERE p.slug = $1 AND p.status = 'published'`,
    [slug]
  );
  if (!post) throw new NotFoundError('Post not found');

  // Increment views
  await db.query(`UPDATE blog_posts SET views = views + 1 WHERE id = $1`, [post.id]);

  const comments = await db.queryMany(
    `SELECT c.id, c.content, c.created_at, u.first_name, u.last_name
     FROM blog_comments c LEFT JOIN users u ON u.id = c.user_id
     WHERE c.post_id = $1 AND c.status = 'approved'
     ORDER BY c.created_at ASC`,
    [post.id]
  );

  return {
    ...formatPostDetail(post),
    comments: comments.map((c) => ({
      id: c.id, content: c.content,
      author: c.first_name ? `${c.first_name} ${c.last_name}` : 'Anonymous',
      createdAt: c.created_at,
    })),
  };
}

async function listCategories() {
  const rows = await db.queryMany(
    `SELECT c.id, c.name, c.slug, c.description, c.display_order,
            (SELECT COUNT(*)::int FROM blog_posts WHERE category_id = c.id AND status = 'published') AS post_count
     FROM blog_categories c ORDER BY display_order`
  );
  return rows.map((c) => ({ id: c.id, name: c.name, slug: c.slug, description: c.description, postCount: c.post_count }));
}

// ============================================================
// ADMIN
// ============================================================
async function listAdmin(query = {}) {
  const { page, limit, offset } = getPagination(query);
  const { sortBy, order } = getSorting(query, ALLOWED_SORT, 'created_at', 'DESC');

  const conditions = ['1=1'];
  const values = [];
  let i = 1;

  if (query.status) { conditions.push(`p.status = $${i++}`); values.push(query.status); }
  if (query.search) { conditions.push(`p.title ILIKE $${i++}`); values.push(`%${query.search}%`); }

  const where = 'WHERE ' + conditions.join(' AND ');
  const count = await db.queryOne(`SELECT COUNT(*)::int AS count FROM blog_posts p ${where}`, values);
  const rows = await db.queryMany(
    `SELECT p.*, u.first_name, u.last_name, c.name AS category_name, c.slug AS category_slug
     FROM blog_posts p LEFT JOIN users u ON u.id = p.author_id
     LEFT JOIN blog_categories c ON c.id = p.category_id
     ${where} ORDER BY p.${sortBy} ${order} LIMIT $${i} OFFSET $${i + 1}`,
    [...values, limit, offset]
  );

  return { items: rows.map(formatPostDetail), pagination: { page, limit, total: count.count } };
}

async function getById(id) {
  const post = await db.queryOne(`SELECT * FROM blog_posts WHERE id = $1`, [id]);
  if (!post) throw new NotFoundError('Post not found');
  return formatPostDetail(post);
}

async function create(data, authorId) {
  const slug = await uniqueSlug(
    data.slug || data.title,
    async (s) => !!(await db.queryOne('SELECT id FROM blog_posts WHERE slug = $1', [s]))
  );

  const publishedAt = data.status === 'published' ? (data.publishedAt || new Date()) : null;

  const result = await db.queryOne(
    `INSERT INTO blog_posts (slug, title, excerpt, content, featured_image, category_id, tags,
      author_id, status, published_at, read_time, meta_title, meta_description)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [
      slug, data.title, data.excerpt || null, data.content || null,
      data.featuredImage || null, data.categoryId || null,
      JSON.stringify(data.tags || []), authorId,
      data.status || 'draft', publishedAt,
      data.readTime || 5, data.metaTitle || null, data.metaDescription || null,
    ]
  );
  return formatPostDetail(result);
}

async function update(id, data) {
  const map = {
    title: 'title', excerpt: 'excerpt', content: 'content',
    featuredImage: 'featured_image', categoryId: 'category_id',
    status: 'status', publishedAt: 'published_at', readTime: 'read_time',
    metaTitle: 'meta_title', metaDescription: 'meta_description',
  };
  const fields = [];
  const values = [];
  let i = 1;

  for (const [k, col] of Object.entries(map)) {
    if (data[k] !== undefined) { fields.push(`${col} = $${i++}`); values.push(data[k]); }
  }
  if (data.tags !== undefined) { fields.push(`tags = $${i++}`); values.push(JSON.stringify(data.tags)); }

  if (data.status === 'published' && !data.publishedAt) {
    fields.push(`published_at = COALESCE(published_at, NOW())`);
  }

  if (!fields.length) return getById(id);

  values.push(id);
  const result = await db.queryOne(
    `UPDATE blog_posts SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
    values
  );
  if (!result) throw new NotFoundError('Post not found');
  return formatPostDetail(result);
}

async function remove(id) {
  const result = await db.queryOne(`DELETE FROM blog_posts WHERE id = $1 RETURNING id`, [id]);
  if (!result) throw new NotFoundError('Post not found');
  return { message: 'Post deleted' };
}

// Categories
async function createCategory(data) {
  const slug = await uniqueSlug(
    data.slug || data.name,
    async (s) => !!(await db.queryOne('SELECT id FROM blog_categories WHERE slug = $1', [s]))
  );
  const r = await db.queryOne(
    `INSERT INTO blog_categories (name, slug, description, display_order) VALUES ($1,$2,$3,$4) RETURNING *`,
    [data.name, slug, data.description || null, data.displayOrder || 0]
  );
  return { id: r.id, name: r.name, slug: r.slug, description: r.description, displayOrder: r.display_order };
}

// Comments
async function addComment(postId, { userId, content, parentId }) {
  const post = await db.queryOne(`SELECT id FROM blog_posts WHERE id = $1`, [postId]);
  if (!post) throw new NotFoundError('Post not found');

  const r = await db.queryOne(
    `INSERT INTO blog_comments (post_id, user_id, content, parent_id, status) VALUES ($1,$2,$3,$4,'pending') RETURNING *`,
    [postId, userId || null, content, parentId || null]
  );
  return { id: r.id, content: r.content, status: r.status, createdAt: r.created_at };
}

function formatPost(row) {
  return {
    id: row.id, slug: row.slug, title: row.title, excerpt: row.excerpt,
    featuredImage: row.featured_image, tags: row.tags,
    author: row.first_name ? `${row.first_name} ${row.last_name}` : null,
    category: row.category_name ? { name: row.category_name, slug: row.category_slug } : null,
    publishedAt: row.published_at, readTime: row.read_time, views: row.views,
    createdAt: row.created_at,
  };
}

function formatPostDetail(row) {
  return {
    ...formatPost(row),
    content: row.content,
    categoryId: row.category_id,
    authorId: row.author_id,
    status: row.status,
    metaTitle: row.meta_title, metaDescription: row.meta_description,
    updatedAt: row.updated_at,
  };
}

module.exports = {
  listPublic, getBySlug, listCategories,
  listAdmin, getById, create, update, remove,
  createCategory, addComment,
};