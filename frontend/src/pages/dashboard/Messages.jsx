// src/pages/dashboard/Messages.jsx
import { useEffect, useState } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import api from '../../lib/api';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications?limit=20&type=message')
      .then((res) => setMessages(res.data || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#031B2A]">Messages</h1>
          <p className="text-sm text-[#6D7E89] mt-1">
            Your conversations with the NCG team
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white border border-[#EDF2F5] rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F9FB] flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-[#A8BBC5]" />
          </div>
          <p className="text-sm text-[#6D7E89] mb-4">
            No messages yet. Reach out to the NCG team anytime.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-5 py-2.5 rounded-md text-sm"
          >
            <Send className="w-4 h-4" />
            Send a Message
          </a>
        </div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`bg-white border rounded-xl p-5 ${
                m.isRead ? 'border-[#EDF2F5]' : 'border-[#8BCB2A]/30 bg-[#8BCB2A]/[0.02]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#064B7A]/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#064B7A]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-[#031B2A]">{m.title}</p>
                  <p className="text-sm text-[#6D7E89] mt-1">{m.message}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}