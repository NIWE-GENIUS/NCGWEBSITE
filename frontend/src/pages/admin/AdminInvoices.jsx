// frontend/src/pages/admin/AdminInvoices.jsx
import { useEffect, useState } from 'react';
import {
  Receipt, Search, RefreshCw, Plus, Eye, Download, Loader2,
} from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import { PageHeader, Modal, StatusBadge } from './AdminComponents';

export default function AdminInvoices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/invoices/admin/list?limit=100').catch(() => ({ data: [] }));
      setItems(res.data || []);
    } catch (_) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = search
    ? items.filter(
        (i) =>
          i.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
          i.clientName?.toLowerCase().includes(search.toLowerCase())
      )
    : items;

  const columns = [
    {
      label: 'Invoice #',
      render: (r) => <span className="font-mono text-xs text-[#064B7A]">{r.invoiceNumber}</span>,
    },
    {
      label: 'Client',
      render: (r) => (
        <div>
          <p className="font-semibold text-sm text-[#031B2A]">{r.clientName}</p>
          <p className="text-xs text-[#6D7E89]">{r.clientEmail}</p>
        </div>
      ),
    },
    {
      label: 'Amount',
      render: (r) => (
        <span className="font-bold text-[#064B7A]">
          {Number(r.total).toLocaleString()} {r.currency}
        </span>
      ),
    },
    {
      label: 'Issued',
      render: (r) => (
        <span className="text-xs text-[#6D7E89]">
          {r.issueDate ? new Date(r.issueDate).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      label: 'Due',
      render: (r) => (
        <span className="text-xs text-[#6D7E89]">
          {r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      label: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
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
        title="Invoices"
        subtitle="Manage client invoices and payments"
        action={
          <div className="flex gap-2">
            <button
              onClick={load}
              className="inline-flex items-center gap-2 bg-white border border-[#EDF2F5] text-[#064B7A] font-semibold px-4 py-2 rounded-md text-sm hover:bg-[#F5F9FB]"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-4 py-2 rounded-md text-sm hover:bg-[#A8D94A]">
              <Plus className="w-4 h-4" /> New Invoice
            </button>
          </div>
        }
      />

      <div className="bg-white border border-[#EDF2F5] rounded-xl p-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D7E89]" />
          <input
            placeholder="Search by invoice number or client..."
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
        emptyMessage="No invoices yet. Click 'New Invoice' to create one."
        onRowClick={(row) => setSelected(row)}
      />

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Invoice ${selected.invoiceNumber}` : ''}
        size="md"
      >
        {selected && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#064B7A] to-[#031B2A] text-white text-center">
              <p className="text-xs uppercase tracking-wider text-[#8BCB2A] font-bold mb-2">
                Total Amount
              </p>
              <p className="font-heading font-bold text-4xl">
                {Number(selected.total).toLocaleString()} {selected.currency}
              </p>
              <div className="mt-3">
                <StatusBadge status={selected.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Client
                </p>
                <p className="text-sm font-semibold text-[#031B2A]">{selected.clientName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Email
                </p>
                <p className="text-sm text-[#163247]">{selected.clientEmail}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Issued
                </p>
                <p className="text-sm text-[#163247]">
                  {selected.issueDate ? new Date(selected.issueDate).toLocaleDateString() : '—'}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Due
                </p>
                <p className="text-sm text-[#163247]">
                  {selected.dueDate ? new Date(selected.dueDate).toLocaleDateString() : '—'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#EDF2F5]">
              <button className="flex-1 inline-flex items-center justify-center gap-2 bg-[#064B7A] text-white font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#062F4A]">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}