// frontend/src/pages/admin/AdminTeam.jsx
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, Star, AlertCircle, CheckCircle2 } from 'lucide-react';
import api, { API_ORIGIN } from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import FileUpload from '../../components/shared/FileUpload';
import { PageHeader, Modal, FormField, ConfirmDialog } from './AdminComponents';

const EMPTY = {
  fullName: '',
  position: '',
  department: '',
  employmentType: 'full_time',
  email: '',
  phone: '',
  location: '',
  bioShort: '',
  bioFull: '',
  profileImageUrl: '',
  featured: false,
  published: true,
  displayOrder: 0,
};

// Convert stored path to a display URL
function displayUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_ORIGIN}${path}`;
}

export default function AdminTeam() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/team/admin/list?limit=100');
      setItems(res.data || []);
    } catch (err) {
      setError('Failed to load team members: ' + err.message);
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
    setSuccess('');
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      fullName: row.fullName || '',
      position: row.position || '',
      department: row.department || '',
      employmentType: row.employmentType || 'full_time',
      email: row.email || '',
      phone: row.phone || '',
      location: row.location || '',
      bioShort: row.bioShort || '',
      bioFull: row.bioFull || '',
      profileImageUrl: row.profileImageUrl || '',
      featured: !!row.featured,
      published: row.published !== false,
      displayOrder: row.displayOrder || 0,
    });
    setError('');
    setSuccess('');
    setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (!form.fullName.trim()) { setError('Full name is required'); setSaving(false); return; }
    if (!form.position.trim()) { setError('Position is required'); setSaving(false); return; }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) { setError('Invalid email'); setSaving(false); return; }

    try {
      const payload = {
        fullName: form.fullName.trim(),
        position: form.position.trim(),
        department: form.department.trim() || undefined,
        employmentType: form.employmentType,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        location: form.location.trim() || undefined,
        bioShort: form.bioShort.trim() || undefined,
        bioFull: form.bioFull.trim() || undefined,
        profileImageUrl: form.profileImageUrl || undefined,
        featured: form.featured,
        published: form.published,
        displayOrder: parseInt(form.displayOrder, 10) || 0,
      };

      if (editing) {
        await api.put(`/team/admin/${editing.id}`, payload);
        setSuccess('Team member updated!');
      } else {
        await api.post('/team/admin', payload);
        setSuccess('Team member created!');
      }

      // Reload list
      await load();

      // Close modal after short delay
      setTimeout(() => {
        setModalOpen(false);
        setSuccess('');
      }, 800);
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/team/admin/${confirmDelete}`);
      setConfirmDelete(null);
      await load();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
    setDeleting(false);
  };

  const columns = [
    {
      label: 'Member',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-[#064B7A] to-[#8BCB2A] flex items-center justify-center text-white font-bold flex-shrink-0">
            {r.profileImageUrl ? (
              <img
                src={displayUrl(r.profileImageUrl)}
                alt={r.fullName}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = r.fullName?.charAt(0); }}
              />
            ) : (
              r.fullName?.charAt(0)?.toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-[#031B2A] truncate">{r.fullName}</p>
            <p className="text-xs text-[#6D7E89] truncate">{r.email || '—'}</p>
          </div>
        </div>
      ),
    },
    { label: 'Position', render: (r) => <span className="text-sm">{r.position}</span> },
    { label: 'Department', render: (r) => <span className="text-xs text-[#6D7E89]">{r.department || '—'}</span> },
    {
      label: 'Status',
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${r.published ? 'bg-[#8BCB2A]/15 text-[#6CA51A]' : 'bg-[#6D7E89]/15 text-[#6D7E89]'}`}>
            {r.published ? 'Published' : 'Draft'}
          </span>
          {r.featured && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#F39C12]/15 text-[#E67E22] inline-flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-[#E67E22]" /> Featured
            </span>
          )}
        </div>
      ),
    },
    {
      label: 'Actions',
      width: '100px',
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => openEdit(r)}
            className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#064B7A] hover:text-white hover:border-[#064B7A] flex items-center justify-center transition-all"
            title="Edit"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmDelete(r.id)}
            className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#E74C3C] hover:text-white hover:border-[#E74C3C] flex items-center justify-center transition-all"
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
        title="Team Members"
        subtitle="Manage the team displayed on your public site"
        action={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#A8D94A] transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Member
          </button>
        }
      />

      {error && !modalOpen && (
        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        emptyMessage="No team members yet. Click 'Add Member' to create one — they'll appear on your homepage and team page."
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Team Member' : 'Add Team Member'}
        size="lg"
      >
        <form onSubmit={save} className="space-y-5">
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-3 rounded-md bg-[#8BCB2A]/10 border border-[#8BCB2A]/30 flex items-center gap-2 text-sm text-[#6CA51A]">
              <CheckCircle2 className="w-4 h-4" /> {success}
            </div>
          )}

          <FormField label="Profile Photo">
            <FileUpload
              value={form.profileImageUrl ? displayUrl(form.profileImageUrl) : ''}
              onChange={(url) => setForm({ ...form, profileImageUrl: url.replace(API_ORIGIN, '') })}
              accept="image/*"
              hint="PNG, JPG, WEBP up to 10 MB — will be shown as a circular avatar"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Full Name" required>
              <input
                required
                className="input"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g. Yasson Habumugisha"
              />
            </FormField>
            <FormField label="Position" required>
              <input
                required
                className="input"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="e.g. Founder & CEO"
              />
            </FormField>
            <FormField label="Department">
              <input
                className="input"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="e.g. Engineering"
              />
            </FormField>
            <FormField label="Employment Type">
              <select
                className="input"
                value={form.employmentType}
                onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
                <option value="volunteer">Volunteer</option>
                <option value="advisor">Advisor</option>
              </select>
            </FormField>
            <FormField label="Email">
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@nextcreaturesgroup.com"
              />
            </FormField>
            <FormField label="Phone">
              <input
                className="input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+250 788 123 456"
              />
            </FormField>
            <FormField label="Location">
              <input
                className="input"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Kigali, Rwanda"
              />
            </FormField>
            <FormField label="Display Order" hint="Lower numbers appear first">
              <input
                type="number"
                className="input"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
              />
            </FormField>
          </div>

          <FormField
            label="Short Bio"
            hint={`${form.bioShort.length}/300 characters — shown on team cards`}
          >
            <input
              className="input"
              maxLength="300"
              value={form.bioShort}
              onChange={(e) => setForm({ ...form, bioShort: e.target.value })}
              placeholder="One-line description"
            />
          </FormField>

          <FormField label="Full Bio" hint="Shown on the member's detail page">
            <textarea
              rows="4"
              className="input"
              value={form.bioFull}
              onChange={(e) => setForm({ ...form, bioFull: e.target.value })}
              placeholder="Detailed background, experience, and mission..."
            />
          </FormField>

          <div className="flex flex-wrap gap-6 p-4 rounded-lg bg-[#F5F9FB] border border-[#EDF2F5]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#8BCB2A]"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              <span className="text-sm font-medium text-[#163247]">Featured on homepage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#8BCB2A]"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              <span className="text-sm font-medium text-[#163247]">Published (visible to public)</span>
            </label>
          </div>

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
              {saving ? 'Saving...' : editing ? 'Update Member' : 'Create Member'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Team Member?"
        message="This will remove them from your homepage and team page. This action cannot be undone."
      />
    </div>
  );
}