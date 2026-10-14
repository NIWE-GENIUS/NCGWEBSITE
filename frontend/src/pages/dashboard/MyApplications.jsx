// src/pages/dashboard/MyApplications.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';

export default function MyApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/mine')
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      label: 'Application ID',
      key: 'applicationId',
      render: (r) => (
        <span className="font-mono text-xs text-[#064B7A]">{r.applicationId}</span>
      ),
    },
    {
      label: 'Program',
      render: (r) => (
        <span className="font-semibold text-sm text-[#031B2A]">
          {r.program?.name || '—'}
        </span>
      ),
    },
    {
      label: 'Status',
      render: (r) => {
        const color = {
          accepted: 'bg-[#8BCB2A]/15 text-[#6CA51A]',
          rejected: 'bg-red-50 text-[#E74C3C]',
          withdrawn: 'bg-[#F5F9FB] text-[#6D7E89]',
          submitted: 'bg-[#3498DB]/15 text-[#3498DB]',
          under_review: 'bg-[#F39C12]/15 text-[#E67E22]',
        }[r.status] || 'bg-[#F5F9FB] text-[#6D7E89]';
        return (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${color}`}>
            {r.status?.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      label: 'Submitted',
      render: (r) => (
        <span className="text-xs text-[#6D7E89]">
          {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      label: '',
      width: '80px',
      render: () => (
        <span className="text-[#064B7A]">
          <ArrowRight className="w-4 h-4" />
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#031B2A]">My Applications</h1>
          <p className="text-sm text-[#6D7E89] mt-1">
            Track all your NCG program applications
          </p>
        </div>
        <Link
          to="/programs"
          className="hidden sm:inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-4 py-2 rounded-md text-sm hover:bg-[#A8D94A]"
        >
          New Application
        </Link>
      </div>

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        emptyMessage="You haven't submitted any applications yet."
      />
    </div>
  );
}