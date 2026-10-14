// frontend/src/components/shared/ChatWidget.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, User as UserIcon, Sparkles, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';

export default function ChatWidget() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      from: 'bot',
      text: "Hi! 👋 I'm the NCG assistant. How can I help you today?\n\nAsk me about our programs, services, team, or how to collaborate.",
      quickReplies: ['Programs', 'Services', 'Team', 'Donate', 'Contact'],
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || typing) return;

    const userMsg = { id: Date.now(), from: 'user', text: userText };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const res = await api.post('/ai/chat', { message: userText });
      const data = res.data;

      setTimeout(() => {
        setMessages((m) => [
          ...m,
          {
            id: Date.now() + 1,
            from: 'bot',
            text: data.text,
            links: data.links || [],
            quickReplies: data.quickReplies || [],
            intent: data.intent,
          },
        ]);
        setTyping(false);
        if (!open) setUnread((u) => u + 1);
      }, 400 + Math.random() * 400);
    } catch (err) {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 2,
          from: 'bot',
          text: "I'm having trouble connecting right now. Please try again in a moment, or email info@nextcreaturesgroup.com.",
          links: [{ label: 'Contact Us', to: '/contact', type: 'primary' }],
        },
      ]);
    }
  };

  const handleLink = (link) => {
    if (link.to.startsWith('http') || link.to.startsWith('mailto:') || link.to.startsWith('tel:')) {
      window.open(link.to, '_blank');
    } else {
      navigate(link.to);
      setOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Render text with basic markdown (bold, lists, links)
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      // Bold
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-[#031B2A]">{part.slice(2, -2)}</strong>;
        }
        // Inline links [text](url)
        const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          return (
            <a
              key={j}
              href={linkMatch[2]}
              onClick={(e) => { e.preventDefault(); handleLink({ to: linkMatch[2] }); }}
              className="text-[#064B7A] font-semibold underline cursor-pointer"
            >
              {linkMatch[1]}
            </a>
          );
        }
        return <span key={j}>{part}</span>;
      });
      return (
        <p key={i} className={i > 0 ? 'mt-1' : ''}>
          {parts.length ? parts : '\u00A0'}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-gradient-to-br from-[#8BCB2A] to-[#6CA51A] text-[#031B2A] shadow-2xl flex items-center justify-center hover:scale-105 transition-all ${
          open ? 'rotate-90' : ''
        }`}
        aria-label="Open chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E74C3C] text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
        {!open && unread === 0 && (
          <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#E74C3C] border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-[100] w-[400px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-[#EDF2F5] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#064B7A] to-[#031B2A] text-white p-4 flex items-center gap-3">
            <img src="/logo.png" alt="NCG" className="h-11 w-auto bg-white rounded-lg p-1" />
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-sm text-white">NCG Assistant</p>
              <p className="text-xs text-[#8BCB2A] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8BCB2A] animate-pulse" />
                Online · Usually replies instantly
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-md hover:bg-white/10">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Reference notice */}
          <div className="bg-[#8BCB2A]/10 border-b border-[#8BCB2A]/20 px-4 py-2 flex items-center gap-2 text-[11px] text-[#6CA51A]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Answers are for reference — contact us for confirmation.</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F5F9FB]">
            {messages.map((m) => (
              <div key={m.id}>
                <div className={`flex items-end gap-2 ${m.from === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.from === 'user' ? 'bg-[#8BCB2A] text-[#031B2A]' : 'bg-[#064B7A] text-white'
                  }`}>
                    {m.from === 'user' ? <UserIcon className="w-4 h-4" /> : <img src="/logo.png" alt="" className="w-full h-full object-contain p-1" />}
                  </div>
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm ${
                    m.from === 'user'
                      ? 'bg-[#8BCB2A] text-[#031B2A] rounded-br-sm'
                      : 'bg-white text-[#163247] border border-[#EDF2F5] rounded-bl-sm'
                  }`}>
                    <div className="leading-relaxed">{renderText(m.text)}</div>
                  </div>
                </div>

                {/* Links */}
                {m.links && m.links.length > 0 && (
                  <div className="mt-2 ml-10 flex flex-wrap gap-2">
                    {m.links.map((link, i) => (
                      <button
                        key={i}
                        onClick={() => handleLink(link)}
                        className={`text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
                          link.type === 'primary'
                            ? 'bg-[#064B7A] text-white hover:bg-[#062F4A]'
                            : 'border border-[#064B7A] text-[#064B7A] hover:bg-[#F5F9FB]'
                        }`}
                      >
                        {link.label} →
                      </button>
                    ))}
                  </div>
                )}

                {/* Quick replies */}
                {m.quickReplies && m.quickReplies.length > 0 && (
                  <div className="mt-2 ml-10 flex flex-wrap gap-2">
                    {m.quickReplies.map((qr, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(qr)}
                        className="text-xs bg-white border border-[#EDF2F5] text-[#163247] px-3 py-1.5 rounded-full hover:border-[#8BCB2A] hover:text-[#064B7A] transition-all"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-[#064B7A] flex items-center justify-center flex-shrink-0">
                  <img src="/logo.png" alt="" className="w-full h-full object-contain p-1" />
                </div>
                <div className="bg-white border border-[#EDF2F5] px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#A8BBC5] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[#A8BBC5] animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-3 h-2 rounded-full bg-[#A8BBC5] animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#EDF2F5] bg-white">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows="1"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about NCG..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#EDF2F5] text-sm resize-none focus:outline-none focus:border-[#8BCB2A] max-h-24"
                style={{ minHeight: '42px' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || typing}
                className="w-10 h-10 rounded-xl bg-[#8BCB2A] text-[#031B2A] flex items-center justify-center hover:bg-[#A8D94A] disabled:opacity-40 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-[#A8BBC5] mt-2">
              {isAuthenticated ? `Logged in as ${user?.firstName || 'user'}` : 'Sign in to save your conversation'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}