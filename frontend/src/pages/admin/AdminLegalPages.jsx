// frontend/src/pages/admin/AdminLegalPages.jsx
import { useEffect, useState } from 'react';
import {
  FileText, Edit, Save, Loader2, CheckCircle2, AlertCircle,
  Shield, Scale, BookOpen, Cookie, Eye,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { PageHeader, Modal, FormField } from './AdminComponents';

const ICONS = { 'privacy': Shield, 'terms': Scale, 'code-of-conduct': BookOpen, 'cookie-policy': Cookie };
const TITLES = {
  'privacy': 'Privacy Policy',
  'terms': 'Terms of Service',
  'code-of-conduct': 'Code of Conduct',
  'cookie-policy': 'Cookie Policy',
};

export default function AdminLegalPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const list = await Promise.all(
        Object.keys(TITLES).map((slug) =>
          api.get(`/legal/${slug}`).then((r) => r.data).catch(() => null)
        )
      );
      setPages(list.filter(Boolean));
    } catch (_) {
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openEditor = (page) => {
    setEditing(page);
    setForm({ title: page.title, content: page.content });
    setError('');
    setSuccess('');
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put(`/settings/legal/${editing.slug}`, {
        title: form.title,
        content: form.content,
        effectiveDate: new Date().toISOString().split('T')[0],
        published: true,
      });
      setSuccess('Saved! Public page updated.');
      await load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Legal Pages"
        subtitle="Edit Privacy Policy, Terms of Service, Code of Conduct, and Cookie Policy"
      />

      {success && (
        <div className="mb-4 p-3 rounded-md bg-[#8BCB2A]/10 border border-[#8BCB2A]/30 flex items-center gap-2 text-sm text-[#6CA51A]">
          <CheckCircle2 className="w-4 h-4" /> {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.entries(TITLES).map(([slug, title]) => {
            const Icon = ICONS[slug];
            const page = pages.find((p) => p.slug === slug);
            return (
              <div key={slug} className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#064B7A]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#064B7A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-base text-[#031B2A] mb-1">
                      {title}
                    </h3>
                    <p className="text-xs text-[#6D7E89]">
                      {page ? `Version ${page.version || 1} · Last updated ${page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : 'never'}` : 'Not yet seeded'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => page && openEditor(page)}
                    disabled={!page}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#064B7A] text-white font-semibold py-2.5 rounded-md text-sm hover:bg-[#062F4A] disabled:opacity-40"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <Link
                    to={`/legal/${slug}`}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 border border-[#EDF2F5] text-[#064B7A] font-semibold px-4 py-2.5 rounded-md text-sm hover:bg-[#F5F9FB]"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Edit: ${editing.title}` : ''}
        size="lg"
      >
        {editing && (
          <form onSubmit={save} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5" /> {error}
              </div>
            )}

            <FormField label="Title">
              <input
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </FormField>

            <FormField
              label="Content (HTML allowed)"
              hint="You can use HTML tags: h1, h2, h3, p, ul, ol, li, strong, em, a, blockquote, table"
            >
              <textarea
                rows="20"
                className="input font-mono text-xs"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#EDF2F5]">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-md text-sm font-semibold border border-[#EDF2F5] hover:bg-[#F5F9FB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-[#8BCB2A] text-[#031B2A] hover:bg-[#A8D94A] disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}