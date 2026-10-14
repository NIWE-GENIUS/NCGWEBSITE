// src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from 'react';
import { Search, Trash2, Shield, ShieldOff, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import { PageHeader, ConfirmDialog, StatusBadge } from './AdminComponents';

export default function AdminUsers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const LIMIT = 15;

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      const res = await api.get(`/users?${params}`);
      setItems(res.data || []);
      setTotal(res.meta?.pagination?.total || 0);
    } catch (_) { setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, search, roleFilter]);

  const toggleStatus = async (user) => {
    try {
      const endpoint = user.status === 'active' ? 'suspend' : 'activate';
      await api.post(`/users/${user.id}/${endpoint}`);
      load();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/users/${confirmDelete}`); setConfirmDelete(null); load(); } catch (_) {}
    setDeleting(false);
  };

  const columns = [
    {
      label: 'User',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#064B7A] to-[#8BCB2A] flex items-center justify-center text-white font-bold flex-shrink-0">
            {r.firstName?.charAt(0)}{r.lastName?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-sm text-[#031B2A]">{r.fullName || `${r.firstName} ${r.lastName}`}</p>
            <p className="text-xs text-[#6D7E89]">{r.email}</p>
          </div>
        </div>
      ),
    },
    { label: 'Role', render: (r) => <span className="text-xs capitalize text-[#163247]">{r.role}</span> },
    { label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    {
      label: 'Verified',
      render: (r) => (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${r.emailVerified ? 'bg-[#8BCB2A]/15 text-[#6CA51A]' : 'bg-[#F39C12]/15 text-[#E67E22]'}`}>
          {r.emailVerified ? 'Verified' : 'Pending'}
        </span>
      ),
    },
    {
      label: 'Joined',
      render: (r) => <span className="text-xs text-[#6D7E89]">{new Date(r.createdAt).toLocaleDateString()}</span>,
    },
    {
      label: 'Actions', width: '100px',
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => toggleStatus(r)}
            className={`w-8 h-8 rounded-md border border-[#EDF2F5] flex items-center justify-center transition-all ${
              r.status === 'active'
                ? 'hover:bg-[#F39C12] hover:text-white'
                : 'hover:bg-[#8BCB2A] hover:text-white'
            }`}
            title={r.status === 'active' ? 'Suspend' : 'Activate'}
          >
            {r.status === 'active' ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setConfirmDelete(r.id)}
            className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#E74C3C] hover:text-white flex items-center justify-center transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage all registered NCG users" />

      {/* Filters */}
      <div className="bg-white border border-[#EDF2F5] rounded-xl p-4 mb-5 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D7E89]" />
          <input
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-[#EDF2F5] text-sm focus:outline-none focus:border-[#8BCB2A]"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="px-4 py-2.5 rounded-md border border-[#EDF2F5] text-sm"
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Roles</option>
          {['student', 'professional', 'entrepreneur', 'intern', 'partner', 'investor', 'mentor', 'guest', 'admin', 'super_admin'].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No users found." />

      {/* Pagination */}
      {total > LIMIT && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-2 rounded-md border border-[#EDF2F5] text-sm font-semibold disabled:opacity-40">← Prev</button>
          <span className="text-xs text-[#6D7E89]">Page {page} of {Math.ceil(total / LIMIT)} · {total} total</span>
          <button disabled={page >= Math.ceil(total / LIMIT)} onClick={() => setPage((p) => p + 1)} className="px-3 py-2 rounded-md border border-[#EDF2F5] text-sm font-semibold disabled:opacity-40">Next →</button>
        </div>
      )}

      <ConfirmDialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete} loading={deleting} title="Delete User?" message="This will soft-delete the user and revoke their sessions." />
    </div>
  );
}