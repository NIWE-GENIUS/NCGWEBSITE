// src/pages/admin/AdminAnnouncements.jsx
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, Megaphone } from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import { PageHeader, Modal, FormField, ConfirmDialog, StatusBadge } from './AdminComponents';

const EMPTY = {
  title: '',
  content: '',
  type: 'banner',
  style: 'info',
  icon: '',
  dismissible: true,
  ctaText: '',
  ctaUrl: '',
  priority: 0,
  status: 'draft',
  startDate: '',
  endDate: '',
};

const TYPES = ['banner', 'dashboard', 'modal', 'inline'];
const STYLES = ['info', 'success', 'warning', 'danger', 'primary'];

export default function AdminAnnouncements() {
  const [items, setItems] = useState([]);
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
      const res = await api.get('/notifications/admin/announcements?limit=100');
      setItems(res.data || []);
    } catch (_) {
      setItems([]);
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
      content: row.content || '',
      type: row.type || 'banner',
      style: row.style || 'info',
      icon: row.icon || '',
      dismissible: row.dismissible !== false,
      ctaText: row.ctaText || '',
      ctaUrl: row.ctaUrl || '',
      priority: row.priority || 0,
      status: row.status || 'draft',
      startDate: row.startDate ? row.startDate.slice(0, 16) : '',
      endDate: row.endDate ? row.endDate.slice(0, 16) : '',
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
        priority: Number(form.priority) || 0,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      };
      if (editing) {
        await api.put(`/notifications/admin/announcements/${editing.id}`, payload);
      } else {
        await api.post('/notifications/admin/announcements', payload);
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
      await api.delete(`/notifications/admin/announcements/${confirmDelete}`);
      setConfirmDelete(null);
      load();
    } catch (_) {}
    setDeleting(false);
  };

  const columns = [
    {
      label: 'Announcement',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#8BCB2A]/15 flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5 text-[#8BCB2A]" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-[#031B2A] truncate">{r.title}</p>
            <p className="text-xs text-[#6D7E89] truncate line-clamp-1">{r.content}</p>
          </div>
        </div>
      ),
    },
    {
      label: 'Type',
      render: (r) => (
        <span className="text-xs uppercase font-bold text-[#064B7A]">{r.type}</span>
      ),
    },
    {
      label: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      label: 'Schedule',
      render: (r) => (
        <span className="text-xs text-[#6D7E89]">
          {r.startDate ? new Date(r.startDate).toLocaleDateString() : 'Any'}
          {r.endDate ? ` → ${new Date(r.endDate).toLocaleDateString()}` : ''}
        </span>
      ),
    },
    {
      label: 'Actions',
      width: '100px',
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#064B7A] hover:text-white flex items-center justify-center">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setConfirmDelete(r.id)} className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#E74C3C] hover:text-white flex items-center justify-center">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Announcements"
        subtitle="Broadcast messages across your platform"
        action={
          <button onClick={openCreate} className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#A8D94A]">
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        }
      />

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        emptyMessage="No announcements yet. Create one to display site-wide banners or dashboard notices."
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Announcement' : 'New Announcement'} size="lg">
        <form onSubmit={save} className="space-y-4">
          {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

          <FormField label="Title" required>
            <input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </FormField>

          <FormField label="Content" required>
            <textarea required rows="3" className="input" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </FormField>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField label="Type">
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Style">
              <select className="input" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })}>
                {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </FormField>
            <FormField label="Priority">
              <input type="number" className="input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Start Date (optional)">
              <input type="datetime-local" className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </FormField>
            <FormField label="End Date (optional)">
              <input type="datetime-local" className="input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="CTA Text (optional)">
              <input className="input" value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} placeholder="Learn More" />
            </FormField>
            <FormField label="CTA URL (optional)">
              <input className="input" value={form.ctaUrl} onChange={(e) => setForm({ ...form, ctaUrl: e.target.value })} placeholder="/programs" />
            </FormField>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-[#8BCB2A]" checked={form.dismissible} onChange={(e) => setForm({ ...form, dismissible: e.target.checked })} />
            <span className="text-sm font-medium text-[#163247]">Users can dismiss this announcement</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EDF2F5]">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-md text-sm font-semibold border border-[#EDF2F5] hover:bg-[#F5F9FB]">Cancel</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-[#8BCB2A] text-[#031B2A] hover:bg-[#A8D94A] disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deleting} title="Delete Announcement?" message="This action cannot be undone." />
    </div>
  );
}