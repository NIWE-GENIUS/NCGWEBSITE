// frontend/src/pages/admin/AdminNewsletter.jsx
import { useEffect, useState } from 'react';
import {
  Newspaper, Search, RefreshCw, Mail, Users, TrendingUp,
  Download, Trash2, Loader2, X,
} from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import StatCard from '../../components/dashboard/StatCard';
import { PageHeader, ConfirmDialog } from './AdminComponents';

export default function AdminNewsletter() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [removing, setRemoving] = useState(false);

  const LIMIT = 20;

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.append('search', search);

      const [listRes, statsRes] = await Promise.all([
        api.get(`/newsletter/admin/list?${params}`).catch(() => ({ data: [] })),
        api.get('/newsletter/admin/stats').catch(() => null),
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

  useEffect(() => { load(); }, [page, search]);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      // Unsubscribe — send email
      await api.post('/newsletter/unsubscribe', { email: confirmRemove });
      setConfirmRemove(null);
      load();
    } catch (_) {}
    setRemoving(false);
  };

  const columns = [
    {
      label: 'Subscriber',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#064B7A] to-[#8BCB2A] flex items-center justify-center text-white font-bold flex-shrink-0">
            {r.name?.charAt(0)?.toUpperCase() || r.email?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-[#031B2A] truncate">
              {r.name || '(no name)'}
            </p>
            <p className="text-xs text-[#6D7E89] truncate">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      label: 'Source',
      render: (r) => <span className="text-xs capitalize text-[#6D7E89]">{r.source || 'website'}</span>,
    },
    {
      label: 'Status',
      render: (r) => (
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-full ${
            r.unsubscribedAt
              ? 'bg-[#6D7E89]/15 text-[#6D7E89]'
              : r.confirmed
              ? 'bg-[#8BCB2A]/15 text-[#6CA51A]'
              : 'bg-[#F39C12]/15 text-[#E67E22]'
          }`}
        >
          {r.unsubscribedAt ? 'Unsubscribed' : r.confirmed ? 'Confirmed' : 'Pending'}
        </span>
      ),
    },
    {
      label: 'Joined',
      render: (r) => (
        <span className="text-xs text-[#6D7E89]">
          {new Date(r.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      label: 'Actions',
      width: '100px',
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <a
            href={`mailto:${r.email}`}
            className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#064B7A] hover:text-white flex items-center justify-center transition-all"
            title="Email"
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setConfirmRemove(r.email)}
            className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#E74C3C] hover:text-white flex items-center justify-center transition-all"
            title="Unsubscribe"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Newsletter Subscribers"
        subtitle="Manage your email list"
        action={
          <div className="flex gap-2">
            <button
              onClick={load}
              className="inline-flex items-center gap-2 bg-white border border-[#EDF2F5] text-[#064B7A] font-semibold px-4 py-2 rounded-md text-sm hover:bg-[#F5F9FB]"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-4 py-2 rounded-md text-sm hover:bg-[#A8D94A]">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Newspaper} label="Total Subscribers" value={stats?.total || 0} color="#064B7A" />
        <StatCard icon={Users} label="Active" value={stats?.active || 0} color="#8BCB2A" />
        <StatCard icon={X} label="Unsubscribed" value={stats?.unsubscribed || 0} color="#E74C3C" />
        <StatCard icon={TrendingUp} label="Last 30 Days" value={stats?.last_30_days || 0} color="#F39C12" />
      </div>

      <div className="bg-white border border-[#EDF2F5] rounded-xl p-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D7E89]" />
          <input
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-[#EDF2F5] text-sm focus:outline-none focus:border-[#8BCB2A]"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        emptyMessage="No subscribers yet."
      />

      {total > LIMIT && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
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

      <ConfirmDialog
        open={!!confirmRemove}
        onClose={() => setConfirmRemove(null)}
        onConfirm={handleRemove}
        loading={removing}
        title="Unsubscribe this email?"
        message={`This will unsubscribe ${confirmRemove} from your newsletter.`}
      />
    </div>
  );
}