// src/pages/dashboard/Notifications.jsx
import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import api from '../../lib/api';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/notifications?limit=50')
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      load();
    } catch (_) {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#031B2A]">Notifications</h1>
          <p className="text-sm text-[#6D7E89] mt-1">Updates from your NCG activity</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#064B7A] hover:text-[#8BCB2A]"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-[#EDF2F5] rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F9FB] flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-[#A8BBC5]" />
          </div>
          <p className="text-sm text-[#6D7E89]">You're all caught up!</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li
              key={n.id}
              className={`bg-white border rounded-xl p-5 flex items-start gap-3 ${
                n.isRead ? 'border-[#EDF2F5]' : 'border-[#8BCB2A]/30 bg-[#8BCB2A]/[0.02]'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#8BCB2A]/15 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-[#8BCB2A]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-[#031B2A]">{n.title}</p>
                {n.message && <p className="text-sm text-[#6D7E89] mt-1">{n.message}</p>}
                <p className="text-xs text-[#A8BBC5] mt-2">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}