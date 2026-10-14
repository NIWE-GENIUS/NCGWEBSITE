// src/pages/admin/AdminComponents.jsx
import { X, AlertTriangle, Loader2 } from 'lucide-react';

export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;

  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`bg-white rounded-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col shadow-2xl`}
      >
        <div className="px-6 py-4 border-b border-[#EDF2F5] flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="font-heading font-bold text-lg text-[#031B2A]">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#F5F9FB] text-[#6D7E89] hover:text-[#E74C3C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

export function FormField({ label, required, error, children, hint }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">
          {label} {required && <span className="text-[#E74C3C]">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-[#6D7E89] mt-1">{hint}</p>}
      {error && <p className="text-xs text-[#E74C3C] mt-1">⚠ {error}</p>}
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-[#E74C3C]" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-[#031B2A]">{title}</h3>
            <p className="text-sm text-[#6D7E89]">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-md text-sm font-semibold text-[#163247] border border-[#EDF2F5] hover:bg-[#F5F9FB]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-[#E74C3C] text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-[#031B2A]">{title}</h1>
        {subtitle && <p className="text-sm text-[#6D7E89] mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }) {
  const colorMap = {
    // Messages
    unread: 'bg-[#E74C3C]/15 text-[#E74C3C]',
    read: 'bg-[#3498DB]/15 text-[#3498DB]',
    in_progress: 'bg-[#F39C12]/15 text-[#E67E22]',
    replied: 'bg-[#8BCB2A]/15 text-[#6CA51A]',
    resolved: 'bg-[#1ABC9C]/15 text-[#16A085]',
    archived: 'bg-[#6D7E89]/15 text-[#6D7E89]',
    // Applications
    submitted: 'bg-[#3498DB]/15 text-[#3498DB]',
    under_review: 'bg-[#F39C12]/15 text-[#E67E22]',
    shortlisted: 'bg-[#9B59B6]/15 text-[#8E44AD]',
    interview: 'bg-[#E67E22]/15 text-[#E67E22]',
    accepted: 'bg-[#8BCB2A]/15 text-[#6CA51A]',
    rejected: 'bg-[#E74C3C]/15 text-[#E74C3C]',
    waitlisted: 'bg-[#F39C12]/15 text-[#E67E22]',
    withdrawn: 'bg-[#6D7E89]/15 text-[#6D7E89]',
    // Users
    active: 'bg-[#8BCB2A]/15 text-[#6CA51A]',
    pending: 'bg-[#F39C12]/15 text-[#E67E22]',
    suspended: 'bg-[#E74C3C]/15 text-[#E74C3C]',
    inactive: 'bg-[#6D7E89]/15 text-[#6D7E89]',
  };
  const cls = colorMap[status] || 'bg-[#6D7E89]/15 text-[#6D7E89]';
  return (
    <span className={`inline-flex text-[10px] font-bold px-2 py-1 rounded-full uppercase ${cls}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const colors = {
    urgent: 'bg-red-100 text-[#E74C3C]',
    high: 'bg-orange-100 text-[#E67E22]',
    medium: 'bg-blue-100 text-[#3498DB]',
    low: 'bg-gray-100 text-[#6D7E89]',
  };
  return (
    <span className={`inline-flex text-[10px] font-bold px-2 py-1 rounded-full uppercase ${colors[priority] || colors.low}`}>
      {priority}
    </span>
  );
}