// src/components/shared/AnnouncementBanner.jsx
import { useEffect, useState } from 'react';
import { X, Megaphone, AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import api from '../../lib/api';

const ICONS = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  primary: Megaphone,
};

const STYLES = {
  info: 'bg-[#3498DB] text-white',
  success: 'bg-[#8BCB2A] text-[#031B2A]',
  warning: 'bg-[#F39C12] text-white',
  danger: 'bg-[#E74C3C] text-white',
  primary: 'bg-[#064B7A] text-white',
};

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ncg_dismissed_announcements') || '[]');
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    api.get('/notifications/announcements/active')
      .then((res) => setAnnouncements(res.data || []))
      .catch(() => setAnnouncements([]));
  }, []);

  const dismiss = (id) => {
    const next = [...dismissed, id];
    setDismissed(next);
    localStorage.setItem('ncg_dismissed_announcements', JSON.stringify(next));
  };

  const visible = announcements.filter((a) => !dismissed.includes(a.id));

  if (visible.length === 0) return null;

  return (
    <div>
      {visible.map((a) => {
        const Icon = ICONS[a.style] || Megaphone;
        const style = STYLES[a.style] || STYLES.info;
        return (
          <div key={a.id} className={`${style} px-4 py-3 flex items-center gap-3 text-sm`}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <strong className="font-bold">{a.title}</strong>
              <span className="ml-2 opacity-90">{a.content}</span>
            </div>
            {a.ctaUrl && a.ctaText && (
              <a
                href={a.ctaUrl}
                className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 font-semibold text-xs whitespace-nowrap"
              >
                {a.ctaText}
              </a>
            )}
            {a.dismissible && (
              <button
                onClick={() => dismiss(a.id)}
                className="p-1 rounded hover:bg-white/20 flex-shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}