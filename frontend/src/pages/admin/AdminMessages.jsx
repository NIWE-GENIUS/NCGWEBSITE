// src/pages/admin/AdminMessages.jsx
import { useEffect, useState } from 'react';
import {
  Mail, Search, Filter, RefreshCw, Eye, Send, Trash2, Loader2, Inbox,
} from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import { PageHeader, Modal, ConfirmDialog, StatusBadge, PriorityBadge } from './AdminComponents';

const STATUSES = ['', 'unread', 'read', 'in_progress', 'replied', 'resolved', 'archived'];
const PRIORITIES = ['', 'low', 'medium', 'high', 'urgent'];

export default function AdminMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const LIMIT = 15;

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);

      const res = await api.get(`/contact/admin/list?${params}`);
      setItems(res.data || []);
      setTotal(res.meta?.pagination?.total || 0);
    } catch (_) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, filters]);

  const viewMessage = async (id) => {
    try {
      const res = await api.get(`/contact/admin/${id}`);
      setSelected(res.data);
      setReplyText('');
    } catch (_) {}
  };

  const sendReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await api.post(`/contact/admin/${selected.id}/reply`, {
        replyText,
        sendEmail: true,
      });
      setReplyText('');
      await viewMessage(selected.id);
      load();
    } catch (err) {
      alert(err.message || 'Reply failed');
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/contact/admin/${id}/status`, { status });
      setSelected((s) => (s ? { ...s, status } : null));
      load();
    } catch (_) {}
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/contact/admin/${confirmDelete}`);
      setConfirmDelete(null);
      setSelected(null);
      load();
    } catch (_) {}
    setDeleting(false);
  };

  const columns = [
    {
      label: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      label: 'Priority',
      render: (r) => <PriorityBadge priority={r.priority} />,
    },
    {
      label: 'From',
      render: (r) => (
        <div>
          <p className="font-semibold text-sm text-[#031B2A]">{r.name}</p>
          <p className="text-xs text-[#6D7E89]">{r.email}</p>
        </div>
      ),
    },
    {
      label: 'Subject',
      render: (r) => (
        <span className="text-sm text-[#163247] line-clamp-1">{r.subject || r.purpose}</span>
      ),
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
      width: '120px',
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => viewMessage(r.id)}
            className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#064B7A] hover:text-white hover:border-[#064B7A] flex items-center justify-center transition-all"
            title="View"
          >
            <Eye className="w-3.5 h-3.5" />
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
        title="Messages"
        subtitle="Manage all contact form submissions"
        action={
          <button
            onClick={load}
            className="inline-flex items-center gap-2 bg-white border border-[#EDF2F5] text-[#064B7A] font-semibold px-4 py-2 rounded-md text-sm hover:bg-[#F5F9FB]"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-white border border-[#EDF2F5] rounded-xl p-4 mb-5 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D7E89]" />
          <input
            placeholder="Search by name, email, or message..."
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
            <option key={s} value={s}>{s ? s.replace('_', ' ') : 'All Statuses'}</option>
          ))}
        </select>
        <select
          className="px-4 py-2.5 rounded-md border border-[#EDF2F5] text-sm focus:outline-none focus:border-[#8BCB2A]"
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p || 'All Priorities'}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        emptyMessage="No messages found. Try different filters."
        onRowClick={(row) => viewMessage(row.id)}
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
        title={selected ? `Message from ${selected.name}` : ''}
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            {/* Meta */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">Status</p>
                <StatusBadge status={selected.status} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">Priority</p>
                <PriorityBadge priority={selected.priority} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">Email</p>
                <a href={`mailto:${selected.email}`} className="text-sm text-[#064B7A] hover:underline">
                  {selected.email}
                </a>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">Phone</p>
                <p className="text-sm text-[#163247]">{selected.phone || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">Purpose</p>
                <p className="text-sm text-[#163247] capitalize">{selected.purpose}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">Received</p>
                <p className="text-sm text-[#163247]">
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Message body */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-2">
                Message
              </p>
              <div className="bg-[#F5F9FB] border-l-4 border-[#8BCB2A] p-4 rounded-md whitespace-pre-wrap text-sm text-[#163247]">
                {selected.message}
              </div>
            </div>

            {/* Existing replies */}
            {selected.replies?.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-2">
                  Previous Replies ({selected.replies.length})
                </p>
                <div className="space-y-2">
                  {selected.replies.map((r) => (
                    <div key={r.id} className="p-3 bg-[#F5F9FB] rounded-lg text-sm text-[#163247]">
                      {r.text}
                      <p className="text-xs text-[#6D7E89] mt-1">
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reply box */}
            <div>
              <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">
                Send Reply
              </label>
              <textarea
                rows="4"
                className="input"
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={sendReply}
                  disabled={sending || !replyText.trim()}
                  className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#A8D94A] disabled:opacity-50"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sending ? 'Sending...' : 'Send Reply'}
                </button>
                <button
                  onClick={() => updateStatus(selected.id, 'in_progress')}
                  className="inline-flex items-center gap-2 border border-[#F39C12] text-[#E67E22] font-semibold px-4 py-2.5 rounded-md text-sm hover:bg-[#F39C12]/10"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => updateStatus(selected.id, 'resolved')}
                  className="inline-flex items-center gap-2 border border-[#8BCB2A] text-[#6CA51A] font-semibold px-4 py-2.5 rounded-md text-sm hover:bg-[#8BCB2A]/10"
                >
                  Mark Resolved
                </button>
                <button
                  onClick={() => updateStatus(selected.id, 'archived')}
                  className="inline-flex items-center gap-2 border border-[#EDF2F5] text-[#6D7E89] font-semibold px-4 py-2.5 rounded-md text-sm hover:bg-[#F5F9FB]"
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Message?"
        message="This action cannot be undone."
      />
    </div>
  );
}