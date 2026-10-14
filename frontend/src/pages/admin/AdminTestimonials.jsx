// src/pages/admin/AdminTestimonials.jsx
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import { PageHeader, Modal, FormField, ConfirmDialog } from './AdminComponents';

const EMPTY = {
  name: '', position: '', company: '', content: '', rating: 5,
  imageUrl: '', featured: false, displayOrder: 0, published: true,
};

export default function AdminTestimonials() {
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
      const res = await api.get('/content/admin/testimonials?limit=100');
      setItems(res.data || []);
    } catch (_) { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setModalOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || '', position: row.position || '', company: row.company || '',
      content: row.content || '', rating: row.rating || 5, imageUrl: row.imageUrl || '',
      featured: row.featured || false, displayOrder: row.displayOrder || 0,
      published: row.published !== false,
    });
    setError(''); setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const payload = { ...form, rating: Number(form.rating), displayOrder: Number(form.displayOrder) };
      if (editing) await api.put(`/content/admin/testimonials/${editing.id}`, payload);
      else await api.post('/content/admin/testimonials', payload);
      setModalOpen(false); load();
    } catch (err) { setError(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/content/admin/testimonials/${confirmDelete}`); setConfirmDelete(null); load(); } catch (_) {}
    setDeleting(false);
  };

  const columns = [
    { label: 'Name', render: (r) => <span className="font-semibold text-sm text-[#031B2A]">{r.name}</span> },
    { label: 'Role', render: (r) => <span className="text-xs text-[#6D7E89]">{r.position}{r.company ? `, ${r.company}` : ''}</span> },
    { label: 'Quote', render: (r) => <span className="text-xs text-[#163247] line-clamp-1">{r.content}</span> },
    { label: 'Rating', render: (r) => <span className="text-sm text-[#F39C12] font-bold">{'★'.repeat(r.rating || 5)}</span> },
    {
      label: 'Actions', width: '100px',
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#064B7A] hover:text-white flex items-center justify-center"><Edit className="w-3.5 h-3.5" /></button>
          <button onClick={() => setConfirmDelete(r.id)} className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#E74C3C] hover:text-white flex items-center justify-center"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Testimonials" subtitle="Manage testimonials shown on your homepage"
        action={<button onClick={openCreate} className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#A8D94A]"><Plus className="w-4 h-4" /> Add Testimonial</button>}
      />
      <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No testimonials yet." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'Add Testimonial'}>
        <form onSubmit={save} className="space-y-4">
          {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
          <FormField label="Name" required><input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Position"><input className="input" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></FormField>
            <FormField label="Company"><input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></FormField>
          </div>
          <FormField label="Testimonial Content" required>
            <textarea required rows="4" className="input" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </FormField>
          <FormField label="Rating (1-5)">
            <input type="number" min="1" max="5" className="input" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          </FormField>
          <FormField label="Image URL"><input className="input" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></FormField>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-[#8BCB2A]" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /><span className="text-sm">Featured on homepage</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-[#8BCB2A]" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /><span className="text-sm">Published</span></label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#EDF2F5]">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-md text-sm font-semibold border border-[#EDF2F5] hover:bg-[#F5F9FB]">Cancel</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-[#8BCB2A] text-[#031B2A] hover:bg-[#A8D94A] disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deleting} title="Delete Testimonial?" message="This action cannot be undone." />
    </div>
  );
}