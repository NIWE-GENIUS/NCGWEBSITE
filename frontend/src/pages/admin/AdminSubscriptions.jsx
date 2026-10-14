// frontend/src/pages/admin/AdminSubscriptions.jsx
import { useEffect, useState } from 'react';
import {
  RefreshCw, Search, Loader2, Users, TrendingUp, DollarSign, Eye,
} from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import StatCard from '../../components/dashboard/StatCard';
import { PageHeader, Modal, StatusBadge } from './AdminComponents';

export default function AdminSubscriptions() {
  const [items, setItems] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [subsRes, plansRes] = await Promise.all([
        api.get('/subscriptions/admin/list?limit=100').catch(() => ({ data: [] })),
        api.get('/subscriptions/admin/plans').catch(() => ({ data: [] })),
      ]);
      setItems(subsRes.data || []);
      setPlans(plansRes.data || []);
    } catch (_) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = search
    ? items.filter((s) => JSON.stringify(s).toLowerCase().includes(search.toLowerCase()))
    : items;

  const columns = [
    {
      label: 'Subscription',
      render: (r) => (
        <div>
          <p className="font-mono text-xs text-[#064B7A]">{r.id?.slice(0, 8)}</p>
          <p className="text-xs text-[#6D7E89]">{r.planName || 'Plan'}</p>
        </div>
      ),
    },
    {
      label: 'User',
      render: (r) => <span className="text-sm">{r.userName || r.userEmail || '—'}</span>,
    },
    {
      label: 'Amount',
      render: (r) => (
        <span className="font-bold text-[#064B7A]">
          {Number(r.price || 0).toLocaleString()} {r.currency || 'RWF'}
        </span>
      ),
    },
    {
      label: 'Interval',
      render: (r) => <span className="text-xs capitalize">{r.interval || 'month'}</span>,
    },
    {
      label: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      label: 'Renews',
      render: (r) => (
        <span className="text-xs text-[#6D7E89]">
          {r.currentPeriodEnd ? new Date(r.currentPeriodEnd).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      label: 'Actions',
      width: '60px',
      render: (r) => (
        <button
          onClick={(e) => { e.stopPropagation(); setSelected(r); }}
          className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#064B7A] hover:text-white flex items-center justify-center transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        subtitle="Manage recurring subscriptions and plans"
        action={
          <button
            onClick={load}
            className="inline-flex items-center gap-2 bg-white border border-[#EDF2F5] text-[#064B7A] font-semibold px-4 py-2 rounded-md text-sm hover:bg-[#F5F9FB]"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Active Subscriptions" value={items.filter((i) => i.status === 'active').length} color="#8BCB2A" />
        <StatCard icon={TrendingUp} label="Total Subscriptions" value={items.length} color="#064B7A" />
        <StatCard icon={DollarSign} label="Plans" value={plans.length} color="#F39C12" />
        <StatCard icon={RefreshCw} label="Cancelled" value={items.filter((i) => i.status === 'cancelled').length} color="#E74C3C" />
      </div>

      <div className="bg-white border border-[#EDF2F5] rounded-xl p-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D7E89]" />
          <input
            placeholder="Search subscriptions..."
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-[#EDF2F5] text-sm focus:outline-none focus:border-[#8BCB2A]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        emptyMessage="No subscriptions yet."
        onRowClick={(row) => setSelected(row)}
      />

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Subscription Details"
        size="md"
      >
        {selected && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#064B7A] to-[#031B2A] text-white text-center">
              <p className="text-xs uppercase tracking-wider text-[#8BCB2A] font-bold mb-2">
                Plan
              </p>
              <p className="font-heading font-bold text-2xl">
                {selected.planName || 'Subscription'}
              </p>
              <p className="text-2xl font-bold mt-2">
                {Number(selected.price || 0).toLocaleString()} {selected.currency || 'RWF'}
              </p>
              <p className="text-sm text-white/60 mt-1 capitalize">
                per {selected.interval || 'month'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Status
                </p>
                <StatusBadge status={selected.status} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  User
                </p>
                <p className="text-sm">{selected.userName || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Period Start
                </p>
                <p className="text-sm">
                  {selected.currentPeriodStart
                    ? new Date(selected.currentPeriodStart).toLocaleDateString()
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Period End
                </p>
                <p className="text-sm">
                  {selected.currentPeriodEnd
                    ? new Date(selected.currentPeriodEnd).toLocaleDateString()
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}