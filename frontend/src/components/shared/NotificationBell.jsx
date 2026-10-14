// src/components/shared/NotificationBell.jsx
import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { unreadCount, notifications, loading, fetchNotifications, markRead, markAllRead } =
    useNotifications();

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-md hover:bg-[#F5F9FB] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-[#064B7A]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] rounded-full bg-[#E74C3C] text-white text-[10px] font-bold flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Panel */}
          <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-[#EDF2F5] z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDF2F5]">
              <p className="font-heading font-bold text-sm text-[#031B2A]">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-semibold text-[#064B7A] hover:text-[#8BCB2A] inline-flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="py-8 text-center">
                  <Loader2 className="w-6 h-6 text-[#8BCB2A] animate-spin mx-auto" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="w-8 h-8 text-[#A8BBC5] mx-auto mb-2" />
                  <p className="text-xs text-[#6D7E89]">No notifications yet</p>
                </div>
              ) : (
                <ul>
                  {notifications.slice(0, 10).map((n) => (
                    <li
                      key={n.id}
                      className={`px-4 py-3 border-b border-[#EDF2F5] last:border-0 cursor-pointer hover:bg-[#F5F9FB] ${
                        !n.isRead ? 'bg-[#8BCB2A]/[0.04]' : ''
                      }`}
                      onClick={() => {
                        markRead(n.id);
                        if (n.link) window.location.href = n.link;
                      }}
                    >
                      <p className="text-sm font-semibold text-[#031B2A] truncate">{n.title}</p>
                      {n.message && (
                        <p className="text-xs text-[#6D7E89] mt-0.5 line-clamp-2">{n.message}</p>
                      )}
                      <p className="text-[10px] text-[#A8BBC5] mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Link
              to="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="block text-center py-3 text-xs font-semibold text-[#064B7A] border-t border-[#EDF2F5] hover:bg-[#F5F9FB]"
            >
              View all notifications →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}