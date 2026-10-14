// frontend/src/pages/admin/AdminPayments.jsx
import { useEffect, useState } from 'react';
import {
  CreditCard, Search, RefreshCw, Eye, DollarSign, TrendingUp, Loader2,
} from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import StatCard from '../../components/dashboard/StatCard';
import { PageHeader, Modal, StatusBadge } from './AdminComponents';

export default function AdminPayments() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (status) params.append('status', status);

      const [listRes, statsRes] = await Promise.all([
        api.get(`/payments/admin/list?${params}`).catch(() => ({ data: [] })),
        api.get('/payments/admin/stats').catch(() => null),
      ]);

      setItems(listRes.data || []);
      setStats(statsRes?.data || null);
    } catch (_) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [status]);

  const filtered = search
    ? items.filter(
        (p) =>
          p.paymentId?.toLowerCase().includes(search.toLowerCase()) ||
          p.transactionId?.toLowerCase().includes(search.toLowerCase())
      )
    : items;

  const columns = [
    {
      label: 'Payment ID',
      render: (r) => <span className="font-mono text-xs text-[#064B7A]">{r.paymentId}</span>,
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
      label: 'Method',
      render: (r) => <span className="text-xs capitalize">{r.paymentMethod}</span>,
    },
    {
      label: 'Gateway',
      render: (r) => <span className="text-xs capitalize text-[#6D7E89]">{r.paymentGateway}</span>,
    },
    {
      label: 'Transaction',
      render: (r) => (
        <span className="font-mono text-[10px] text-[#6D7E89]">
          {r.transactionId?.slice(0, 20) || '—'}
        </span>
      ),
    },
    {
      label: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
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
        title="Payments"
        subtitle="Track all incoming and outgoing payments"
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
        <StatCard icon={DollarSign} label="Total Payments" value={`${Number(stats?.total_amount || 0).toLocaleString()} RWF`} color="#8BCB2A" />
        <StatCard icon={CreditCard} label="Total Count" value={stats?.total || 0} color="#064B7A" />
        <StatCard icon={TrendingUp} label="Succeeded" value={stats?.succeeded || 0} color="#16A085" />
        <StatCard icon={TrendingUp} label="Failed" value={stats?.failed || 0} color="#E74C3C" />
      </div>

      <div className="bg-white border border-[#EDF2F5] rounded-xl p-4 mb-5 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D7E89]" />
          <input
            placeholder="Search by payment ID or transaction ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-[#EDF2F5] text-sm focus:outline-none focus:border-[#8BCB2A]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2.5 rounded-md border border-[#EDF2F5] text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="succeeded">Succeeded</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        emptyMessage="No payments yet."
        onRowClick={(row) => setSelected(row)}
      />

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Payment ${selected.paymentId}` : ''}
        size="md"
      >
        {selected && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#064B7A] to-[#031B2A] text-white text-center">
              <p className="text-xs uppercase tracking-wider text-[#8BCB2A] font-bold mb-2">
                Amount
              </p>
              <p className="font-heading font-bold text-4xl">
                {Number(selected.amount).toLocaleString()} {selected.currency}
              </p>
              <div className="mt-3">
                <StatusBadge status={selected.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Payment ID
                </p>
                <p className="font-mono text-xs text-[#064B7A]">{selected.paymentId}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Transaction ID
                </p>
                <p className="font-mono text-xs text-[#064B7A]">
                  {selected.transactionId || '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Method
                </p>
                <p className="text-sm capitalize">{selected.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Gateway
                </p>
                <p className="text-sm capitalize">{selected.paymentGateway}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EDF2F5] text-xs text-[#6D7E89]">
              Created {new Date(selected.createdAt).toLocaleString()}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}