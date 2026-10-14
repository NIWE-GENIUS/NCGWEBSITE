// src/pages/admin/AdminProjects.jsx
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import { PageHeader, Modal, FormField, ConfirmDialog } from './AdminComponents';

const EMPTY = {
  title: '',
  category: 'software',
  descriptionShort: '',
  descriptionLong: '',
  problemStatement: '',
  solution: '',
  status: 'concept',
  featured: false,
  published: true,
  displayOrder: 0,
};

export default function AdminProjects() {
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
      const res = await api.get('/projects/admin/list?limit=100');
      setItems(res.data || []);
    } catch (_) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setModalOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      title: row.title || '', category: row.category || 'software',
      descriptionShort: row.descriptionShort || '', descriptionLong: row.descriptionLong || '',
      problemStatement: row.problemStatement || '', solution: row.solution || '',
      status: row.status || 'concept', featured: row.featured || false,
      published: row.published !== false, displayOrder: row.displayOrder || 0,
    });
    setError(''); setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editing) await api.put(`/projects/admin/${editing.id}`, form);
      else await api.post('/projects/admin', form);
      setModalOpen(false); load();
    } catch (err) { setError(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/projects/admin/${confirmDelete}`); setConfirmDelete(null); load(); } catch (_) {}
    setDeleting(false);
  };

  const columns = [
    { label: 'Title', render: (r) => <span className="font-semibold text-sm text-[#031B2A]">{r.title}</span> },
    { label: 'Category', render: (r) => <span className="text-xs capitalize">{r.category}</span> },
    { label: 'Status', render: (r) => <span className="text-xs capitalize text-[#6D7E89]">{r.status}</span> },
    {
      label: 'Published',
      render: (r) => (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${r.published ? 'bg-[#8BCB2A]/15 text-[#6CA51A]' : 'bg-[#6D7E89]/15 text-[#6D7E89]'}`}>
          {r.published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      label: 'Actions', width: '100px',
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
      <PageHeader title="Projects" subtitle="Manage your technology project portfolio"
        action={<button onClick={openCreate} className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#A8D94A]"><Plus className="w-4 h-4" /> Add Project</button>}
      />
      <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No projects yet." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Create Project'} size="lg">
        <form onSubmit={save} className="space-y-4">
          {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
          <FormField label="Title" required><input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Category">
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="software">Software</option><option value="ai">AI</option>
                <option value="iot">IoT</option><option value="automation">Automation</option>
                <option value="agritech">AgriTech</option><option value="electrical">Electrical</option>
                <option value="infrastructure">Infrastructure</option><option value="other">Other</option>
              </select>
            </FormField>
            <FormField label="Status">
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="concept">Concept</option><option value="prototype">Prototype</option>
                <option value="mvp">MVP</option><option value="launched">Launched</option>
                <option value="scaling">Scaling</option><option value="archived">Archived</option>
              </select>
            </FormField>
          </div>
          <FormField label="Short Description"><input className="input" value={form.descriptionShort} onChange={(e) => setForm({ ...form, descriptionShort: e.target.value })} /></FormField>
          <FormField label="Problem Statement"><textarea rows="2" className="input" value={form.problemStatement} onChange={(e) => setForm({ ...form, problemStatement: e.target.value })} /></FormField>
          <FormField label="Solution"><textarea rows="2" className="input" value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} /></FormField>
          <FormField label="Long Description"><textarea rows="3" className="input" value={form.descriptionLong} onChange={(e) => setForm({ ...form, descriptionLong: e.target.value })} /></FormField>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-[#8BCB2A]" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /><span className="text-sm">Featured</span></label>
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

      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deleting} title="Delete Project?" message="This action cannot be undone." />
    </div>
  );
}