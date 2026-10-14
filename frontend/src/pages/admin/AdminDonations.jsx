// frontend/src/pages/admin/AdminDonations.jsx
import { useEffect, useState } from 'react';
import {
  DollarSign, Search, Filter, RefreshCw, Eye, Trash2, Loader2,
  TrendingUp, CreditCard,
} from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import StatCard from '../../components/dashboard/StatCard';
import { PageHeader, Modal, ConfirmDialog, StatusBadge } from './AdminComponents';

const STATUSES = ['', 'pending', 'processing', 'succeeded', 'failed', 'refunded', 'cancelled'];

export default function AdminDonations() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const LIMIT = 15;

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const [listRes, statsRes] = await Promise.all([
        api.get(`/donations/admin/list?${params}`),
        api.get('/donations/admin/stats').catch(() => null),
      ]);

      setItems(listRes.data || []);
      setTotal(listRes.meta?.pagination?.total || 0);
      setStats(statsRes?.data || null);
    } catch (_) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, filters]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Soft delete via status update
      await api.put(`/donations/admin/${confirmDelete}/status`, { status: 'cancelled' });
      setConfirmDelete(null);
      load();
    } catch (_) {}
    setDeleting(false);
  };

  const columns = [
    {
      label: 'Donation ID',
      render: (r) => <span className="font-mono text-xs text-[#064B7A]">{r.donationId}</span>,
    },
    {
      label: 'Donor',
      render: (r) => (
        <div>
          <p className="font-semibold text-sm text-[#031B2A]">
            {r.isAnonymous ? 'Anonymous' : r.donorName}
          </p>
          <p className="text-xs text-[#6D7E89]">{r.isAnonymous ? '—' : r.donorEmail}</p>
        </div>
      ),
    },
    {
      label: 'Amount',
      render: (r) => (
        <span className="font-bold text-[#064B7A]">
          {Number(r.amount).toLocaleString()} {r.currency}
        </span>
      ),
    },
    {
      label: 'Designation',
      render: (r) => <span className="text-xs text-[#163247]">{r.designation}</span>,
    },
    {
      label: 'Method',
      render: (r) => <span className="text-xs capitalize text-[#6D7E89]">{r.paymentMethod}</span>,
    },
    {
      label: 'Status',
      render: (r) => <StatusBadge status={r.paymentStatus} />,
    },
    {
      label: 'Date',
      render: (r) => (
        <span className="text-xs text-[#6D7E89] whitespace-nowrap">
          {new Date(r.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      label: 'Actions',
      width: '100px',
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setSelected(r)}
            className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#064B7A] hover:text-white flex items-center justify-center transition-all"
            title="View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setConfirmDelete(r.id)}
            className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#E74C3C] hover:text-white flex items-center justify-center transition-all"
            title="Cancel"
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
        title="Donations"
        subtitle="Track all donations received"
        action={
          <button
            onClick={load}
            className="inline-flex items-center gap-2 bg-white border border-[#EDF2F5] text-[#064B7A] font-semibold px-4 py-2 rounded-md text-sm hover:bg-[#F5F9FB]"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={DollarSign}
          label="Total Raised"
          value={`${Number(stats?.total_amount || 0).toLocaleString()} RWF`}
          color="#8BCB2A"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Donations"
          value={stats?.total_count || 0}
          color="#064B7A"
        />
        <StatCard
          icon={CreditCard}
          label="Succeeded"
          value={stats?.succeeded_count || 0}
          color="#16A085"
        />
        <StatCard
          icon={TrendingUp}
          label="Average"
          value={`${Number(stats?.avg_amount || 0).toLocaleString()} RWF`}
          color="#F39C12"
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#EDF2F5] rounded-xl p-4 mb-5 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D7E89]" />
          <input
            placeholder="Search by donor name, email, or ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-[#EDF2F5] text-sm focus:outline-none focus:border-[#8BCB2A]"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <select
          className="px-4 py-2.5 rounded-md border border-[#EDF2F5] text-sm focus:outline-none focus:border-[#8BCB2A]"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s || 'All Statuses'}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        emptyMessage="No donations yet."
        onRowClick={(row) => setSelected(row)}
      />

      {/* Pagination */}
      {total > LIMIT && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-2 rounded-md border border-[#EDF2F5] text-sm font-semibold disabled:opacity-40 hover:bg-[#F5F9FB]"
          >
            ← Prev
          </button>
          <span className="text-xs text-[#6D7E89]">
            Page {page} of {Math.ceil(total / LIMIT)} · {total} total
          </span>
          <button
            disabled={page >= Math.ceil(total / LIMIT)}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-2 rounded-md border border-[#EDF2F5] text-sm font-semibold disabled:opacity-40 hover:bg-[#F5F9FB]"
          >
            Next →
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Donation ${selected.donationId}` : ''}
        size="md"
      >
        {selected && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#064B7A] to-[#031B2A] text-white text-center">
              <p className="text-xs uppercase tracking-wider text-[#8BCB2A] font-bold mb-2">
                Donation Amount
              </p>
              <p className="font-heading font-bold text-4xl">
                {Number(selected.amount).toLocaleString()} {selected.currency}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">Donor</p>
                <p className="text-sm font-semibold text-[#031B2A]">
                  {selected.isAnonymous ? 'Anonymous' : selected.donorName}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">Email</p>
                <p className="text-sm text-[#163247]">
                  {selected.isAnonymous ? '—' : selected.donorEmail}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">Designation</p>
                <p className="text-sm text-[#163247]">{selected.designation}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">Type</p>
                <p className="text-sm capitalize text-[#163247]">{selected.donationType}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">Method</p>
                <p className="text-sm capitalize text-[#163247]">{selected.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">Status</p>
                <StatusBadge status={selected.paymentStatus} />
              </div>
            </div>

            <div className="pt-4 border-t border-[#EDF2F5] text-xs text-[#6D7E89]">
              Received on {new Date(selected.createdAt).toLocaleString()}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Cancel Donation?"
        message="This will mark the donation as cancelled. This action cannot be undone."
      />
    </div>
  );
}