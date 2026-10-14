// src/pages/admin/AdminApplications.jsx
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import { PageHeader, StatusBadge } from './AdminComponents';

export default function AdminApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/admin/list?limit=100')
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { label: 'App ID', render: (r) => <span className="font-mono text-xs text-[#064B7A]">{r.applicationId}</span> },
    { label: 'Applicant', render: (r) => <span className="text-sm">{r.applicant?.firstName} {r.applicant?.lastName}</span> },
    { label: 'Program', render: (r) => <span className="text-sm">{r.program?.name}</span> },
    { label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { label: 'Submitted', render: (r) => <span className="text-xs text-[#6D7E89]">{new Date(r.submittedAt).toLocaleDateString()}</span> },
  ];

  return (
    <div>
      <PageHeader title="Applications" subtitle="Review and manage program applications" />
      <DataTable columns={columns} rows={items} loading={loading} emptyMessage="No applications yet." />
    </div>
  );
}