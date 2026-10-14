// src/pages/admin/AdminFAQs.jsx
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import { PageHeader, Modal, FormField, ConfirmDialog } from './AdminComponents';

const EMPTY = { question: '', answer: '', category: 'general', displayOrder: 0, published: true };

export default function AdminFAQs() {
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
    try { const res = await api.get('/content/admin/faqs?limit=100'); setItems(res.data || []); }
    catch (_) { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(''); setModalOpen(true); };
  const openEdit = (row) => {
    setEditing(row);
    setForm({ question: row.question, answer: row.answer, category: row.category || 'general', displayOrder: row.displayOrder || 0, published: row.published !== false });
    setError(''); setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      if (editing) await api.put(`/content/admin/faqs/${editing.id}`, form);
      else await api.post('/content/admin/faqs', form);
      setModalOpen(false); load();
    } catch (err) { setError(err.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/content/admin/faqs/${confirmDelete}`); setConfirmDelete(null); load(); } catch (_) {}
    setDeleting(false);
  };

  const columns = [
    { label: 'Question', render: (r) => <span className="font-semibold text-sm text-[#031B2A]">{r.question}</span> },
    { label: 'Answer', render: (r) => <span className="text-xs text-[#6D7E89] line-clamp-1">{r.answer}</span> },
    { label: 'Category', render: (r) => <span className="text-xs">{r.category}</span> },
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
      <PageHeader title="FAQs" subtitle="Manage frequently asked questions"
        action={<button onClick={openCreate} className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#A8D94A]"><Plus className="w-4 h-4" /> Add FAQ</button>}
      />
      <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No FAQs yet." />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit FAQ' : 'Add FAQ'}>
        <form onSubmit={save} className="space-y-4">
          {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
          <FormField label="Question" required><input required className="input" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></FormField>
          <FormField label="Answer" required><textarea required rows="4" className="input" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category"><input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></FormField>
            <FormField label="Display Order"><input type="number" className="input" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} /></FormField>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-[#8BCB2A]" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /><span className="text-sm">Published</span></label>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#EDF2F5]">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-md text-sm font-semibold border border-[#EDF2F5] hover:bg-[#F5F9FB]">Cancel</button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-[#8BCB2A] text-[#031B2A] hover:bg-[#A8D94A] disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deleting} title="Delete FAQ?" message="This action cannot be undone." />
    </div>
  );
}