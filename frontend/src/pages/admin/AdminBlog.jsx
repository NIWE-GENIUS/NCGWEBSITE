// src/pages/admin/AdminBlog.jsx
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, Eye } from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import FileUpload from '../../components/shared/FileUpload';
import { PageHeader, Modal, FormField, ConfirmDialog, StatusBadge } from './AdminComponents';

const EMPTY = {
  title: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  categoryId: '',
  tags: '',
  status: 'draft',
  readTime: 5,
  metaTitle: '',
  metaDescription: '',
};

export default function AdminBlog() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [postsRes, catsRes] = await Promise.all([
        api.get('/blog/admin/list?limit=100').catch(() => ({ data: [] })),
        api.get('/blog/categories').catch(() => ({ data: [] })),
      ]);
      setItems(postsRes.data || []);
      setCategories(catsRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      title: row.title || '',
      excerpt: row.excerpt || '',
      content: row.content || '',
      featuredImage: row.featuredImage || '',
      categoryId: row.categoryId || '',
      tags: Array.isArray(row.tags) ? row.tags.join(', ') : '',
      status: row.status || 'draft',
      readTime: row.readTime || 5,
      metaTitle: row.metaTitle || '',
      metaDescription: row.metaDescription || '',
    });
    setError('');
    setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        readTime: Number(form.readTime) || 5,
      };
      if (editing) {
        await api.put(`/blog/admin/${editing.id}`, payload);
      } else {
        await api.post('/blog/admin', payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/blog/admin/${confirmDelete}`);
      setConfirmDelete(null);
      load();
    } catch (_) {}
    setDeleting(false);
  };

  const columns = [
    {
      label: 'Title',
      render: (r) => (
        <div>
          <p className="font-semibold text-sm text-[#031B2A] line-clamp-1">{r.title}</p>
          <p className="text-xs text-[#6D7E89]">/{r.slug}</p>
        </div>
      ),
    },
    {
      label: 'Category',
      render: (r) => (
        <span className="text-xs text-[#163247]">{r.category?.name || '—'}</span>
      ),
    },
    {
      label: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      label: 'Published',
      render: (r) => (
        <span className="text-xs text-[#6D7E89]">
          {r.publishedAt ? new Date(r.publishedAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      label: 'Actions',
      width: '100px',
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => openEdit(r)}
            className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#064B7A] hover:text-white flex items-center justify-center transition-all"
            title="Edit"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmDelete(r.id)}
            className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#E74C3C] hover:text-white flex items-center justify-center transition-all"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Blog & Articles"
        subtitle="Publish insights, updates, and news for your audience"
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#A8D94A]"
          >
            <Plus className="w-4 h-4" /> New Post
          </button>
        }
      />

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        emptyMessage="No blog posts yet. Click 'New Post' to publish your first article."
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Post' : 'New Blog Post'}
        size="lg"
      >
        <form onSubmit={save} className="space-y-5">
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <FormField label="Featured Image">
            <FileUpload
              value={form.featuredImage}
              onChange={(url) => setForm({ ...form, featuredImage: url })}
              accept="image/*"
              hint="PNG, JPG, WEBP up to 10 MB — shown on blog cards"
            />
          </FormField>

          <FormField label="Title" required>
            <input
              required
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Building Smart Irrigation Systems"
            />
          </FormField>

          <FormField label="Excerpt" hint="Short summary shown in blog listing">
            <textarea
              rows="2"
              className="input"
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="One or two sentence summary..."
            />
          </FormField>

          <FormField label="Content" required hint="Markdown or plain text">
            <textarea
              required
              rows="12"
              className="input font-mono text-sm"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your article here..."
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Category">
              <select
                className="input"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Status">
              <select
                className="input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </FormField>
            <FormField label="Read Time (min)">
              <input
                type="number"
                className="input"
                value={form.readTime}
                onChange={(e) => setForm({ ...form, readTime: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Tags" hint="Comma-separated">
            <input
              className="input"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="innovation, iot, agriculture"
            />
          </FormField>

          <details className="p-4 rounded-lg bg-[#F5F9FB] border border-[#EDF2F5]">
            <summary className="cursor-pointer font-bold text-sm text-[#031B2A] mb-3">
              SEO Settings (optional)
            </summary>
            <div className="space-y-4 mt-3">
              <FormField label="Meta Title">
                <input
                  className="input"
                  value={form.metaTitle}
                  onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                />
              </FormField>
              <FormField label="Meta Description">
                <textarea
                  rows="2"
                  className="input"
                  value={form.metaDescription}
                  onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                />
              </FormField>
            </div>
          </details>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EDF2F5]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 rounded-md text-sm font-semibold border border-[#EDF2F5] hover:bg-[#F5F9FB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-[#8BCB2A] text-[#031B2A] hover:bg-[#A8D94A] disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Blog Post?"
        message="This will remove the post from your blog. This action cannot be undone."
      />
    </div>
  );
}