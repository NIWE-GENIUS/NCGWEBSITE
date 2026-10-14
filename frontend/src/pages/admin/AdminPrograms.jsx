// src/pages/admin/AdminPrograms.jsx
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, GraduationCap } from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import { PageHeader, Modal, FormField, ConfirmDialog } from './AdminComponents';

const EMPTY = {
  name: '',
  tagline: '',
  category: 'bootcamp',
  descriptionShort: '',
  descriptionLong: '',
  duration: '',
  format: 'hybrid',
  level: 'all_levels',
  price: 0,
  currency: 'RWF',
  capacity: 20,
  certificateAvailable: true,
  registrationOpen: true,
  featured: false,
  published: true,
  displayOrder: 0,
};

export default function AdminPrograms() {
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
      const res = await api.get('/programs/admin/list?limit=100');
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
      name: row.name || '',
      tagline: row.tagline || '',
      category: row.category || 'bootcamp',
      descriptionShort: row.descriptionShort || '',
      descriptionLong: row.descriptionLong || '',
      duration: row.duration || '',
      format: row.format || 'hybrid',
      level: row.level || 'all_levels',
      price: row.price || 0,
      currency: row.currency || 'RWF',
      capacity: row.capacity || 20,
      certificateAvailable: row.certificateAvailable !== false,
      registrationOpen: row.registrationOpen !== false,
      featured: row.featured || false,
      published: row.published !== false,
      displayOrder: row.displayOrder || 0,
    });
    setError('');
    setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, price: Number(form.price), capacity: Number(form.capacity) };
      if (editing) {
        await api.put(`/programs/admin/${editing.id}`, payload);
      } else {
        await api.post('/programs/admin', payload);
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
      await api.delete(`/programs/admin/${confirmDelete}`);
      setConfirmDelete(null);
      load();
    } catch (_) {}
    setDeleting(false);
  };

  const columns = [
    {
      label: 'Program',
      render: (r) => (
        <div>
          <p className="font-semibold text-sm text-[#031B2A]">{r.name}</p>
          <p className="text-xs text-[#6D7E89]">{r.tagline}</p>
        </div>
      ),
    },
    {
      label: 'Category',
      render: (r) => <span className="text-xs capitalize text-[#163247]">{r.category}</span>,
    },
    {
      label: 'Price',
      render: (r) => (
        <span className="text-sm font-semibold text-[#064B7A]">
          {r.price > 0 ? `${Number(r.price).toLocaleString()} ${r.currency}` : 'Free'}
        </span>
      ),
    },
    {
      label: 'Status',
      render: (r) => (
        <div className="flex gap-1">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${r.published ? 'bg-[#8BCB2A]/15 text-[#6CA51A]' : 'bg-[#6D7E89]/15 text-[#6D7E89]'}`}>
            {r.published ? 'Published' : 'Draft'}
          </span>
          {r.featured && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#F39C12]/15 text-[#E67E22]">Featured</span>
          )}
        </div>
      ),
    },
    {
      label: 'Actions',
      width: '100px',
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#064B7A] hover:text-white transition-all flex items-center justify-center">
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setConfirmDelete(r.id)} className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#E74C3C] hover:text-white transition-all flex items-center justify-center">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Programs"
        subtitle="Manage your public program catalog"
        action={
          <button onClick={openCreate} className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#A8D94A]">
            <Plus className="w-4 h-4" /> Add Program
          </button>
        }
      />

      <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No programs yet." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Program' : 'Create Program'} size="lg">
        <form onSubmit={save} className="space-y-4">
          {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

          <FormField label="Program Name" required>
            <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </FormField>

          <FormField label="Tagline">
            <input className="input" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Category" required>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="bootcamp">Bootcamp</option>
                <option value="internship">Internship</option>
                <option value="online">Online Learning</option>
                <option value="coaching">Coaching</option>
                <option value="tutoring">Private Tutoring</option>
                <option value="workshop">Workshop</option>
                <option value="other">Other</option>
              </select>
            </FormField>
            <FormField label="Format">
              <select className="input" value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
                <option value="physical">Physical</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </FormField>
            <FormField label="Duration">
              <input className="input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 8-12 weeks" />
            </FormField>
            <FormField label="Level">
              <select className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="all_levels">All Levels</option>
              </select>
            </FormField>
            <FormField label="Price">
              <input type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </FormField>
            <FormField label="Capacity">
              <input type="number" className="input" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            </FormField>
          </div>

          <FormField label="Short Description">
            <input className="input" value={form.descriptionShort} onChange={(e) => setForm({ ...form, descriptionShort: e.target.value })} />
          </FormField>

          <FormField label="Long Description">
            <textarea rows="4" className="input" value={form.descriptionLong} onChange={(e) => setForm({ ...form, descriptionLong: e.target.value })} />
          </FormField>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#8BCB2A]" checked={form.certificateAvailable} onChange={(e) => setForm({ ...form, certificateAvailable: e.target.checked })} />
              <span className="text-sm">Certificate available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#8BCB2A]" checked={form.registrationOpen} onChange={(e) => setForm({ ...form, registrationOpen: e.target.checked })} />
              <span className="text-sm">Registration open</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#8BCB2A]" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              <span className="text-sm">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#8BCB2A]" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              <span className="text-sm">Published</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EDF2F5]">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-md text-sm font-semibold border border-[#EDF2F5] hover:bg-[#F5F9FB]">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-[#8BCB2A] text-[#031B2A] hover:bg-[#A8D94A] disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Saving...' : editing ? 'Update Program' : 'Create Program'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Program?"
        message="This will remove the program from your public site. This action cannot be undone."
      />
    </div>
  );
}