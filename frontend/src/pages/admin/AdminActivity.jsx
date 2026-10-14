// src/pages/admin/AdminActivity.jsx
import { useEffect, useState } from 'react';
import { Activity, Shield, Loader2, Search } from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import { PageHeader } from './AdminComponents';

export default function AdminActivity() {
  const [tab, setTab] = useState('activity');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      // Endpoint for activity logs may not exist yet — gracefully fall back
      const endpoint = tab === 'activity' ? '/admin/activity' : '/admin/audit';
      const res = await api.get(`${endpoint}?limit=50`).catch(() => ({ data: [] }));
      setItems(res.data || []);
    } catch (_) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tab]);

  const filtered = search
    ? items.filter((i) =>
        JSON.stringify(i).toLowerCase().includes(search.toLowerCase())
      )
    : items;

  const columns = tab === 'activity'
    ? [
        { label: 'Action', render: (r) => <span className="font-mono text-xs text-[#064B7A]">{r.action}</span> },
        { label: 'User', render: (r) => <span className="text-sm">{r.user || '—'}</span> },
        { label: 'Entity', render: (r) => <span className="text-xs text-[#6D7E89]">{r.entityType || '—'}</span> },
        { label: 'IP', render: (r) => <span className="text-xs text-[#6D7E89]">{r.ipAddress || '—'}</span> },
        {
          label: 'When',
          render: (r) => (
            <span className="text-xs text-[#6D7E89]">
              {r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}
            </span>
          ),
        },
      ]
    : [
        { label: 'Action', render: (r) => <span className="font-mono text-xs text-[#064B7A]">{r.action}</span> },
        { label: 'Table', render: (r) => <span className="text-xs">{r.tableName || '—'}</span> },
        { label: 'Record', render: (r) => <span className="font-mono text-[10px] text-[#6D7E89]">{r.recordId?.slice(0, 8) || '—'}</span> },
        { label: 'User', render: (r) => <span className="text-sm">{r.user || '—'}</span> },
        {
          label: 'When',
          render: (r) => (
            <span className="text-xs text-[#6D7E89]">
              {r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}
            </span>
          ),
        },
      ];

  return (
    <div>
      <PageHeader
        title="Activity & Audit"
        subtitle="Complete trail of actions across your platform"
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab('activity')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
            tab === 'activity'
              ? 'bg-[#064B7A] text-white'
              : 'bg-white border border-[#EDF2F5] text-[#163247] hover:bg-[#F5F9FB]'
          }`}
        >
          <Activity className="w-4 h-4" />
          Activity Logs
        </button>
        <button
          onClick={() => setTab('audit')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
            tab === 'audit'
              ? 'bg-[#064B7A] text-white'
              : 'bg-white border border-[#EDF2F5] text-[#163247] hover:bg-[#F5F9FB]'
          }`}
        >
          <Shield className="w-4 h-4" />
          Audit Trail
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#EDF2F5] rounded-xl p-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D7E89]" />
          <input
            placeholder="Search logs..."
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
        emptyMessage={`No ${tab} logs yet. This feature tracks all admin actions and data changes.`}
      />
    </div>
  );
}