// frontend/src/components/forms/ContactFormInline.jsx
import { useState } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../lib/api';

export default function ContactFormInline({ purpose = 'general', context = '' }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: context ? `${purpose} — ${context}` : '',
    message: '',
    subscribe: true,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(null);
    try {
      const res = await api.post('/contact', { ...form, purpose, source: 'feature-page' });
      setSuccess(res.data?.messageId || 'Message sent');
      setForm({ name: '', email: '', phone: '', organization: '', subject: '', message: '', subscribe: true });
      setTimeout(() => setSuccess(null), 8000);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6 md:p-8">
      <h3 className="font-heading font-bold text-xl text-[#031B2A] mb-2">Send us a message</h3>
      <p className="text-sm text-[#6D7E89] mb-6">We reply to every inquiry within 24-48 hours.</p>

      {success && (
        <div className="mb-5 p-3 rounded-md bg-[#8BCB2A]/10 border border-[#8BCB2A]/30 flex items-start gap-2 text-sm text-[#6CA51A]">
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Message sent! Check your email for confirmation.</p>
            <p className="text-xs">Reference: {success}</p>
          </div>
        </div>
      )}
      {error && (
        <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">Full Name *</label>
            <input name="name" required className="w-full px-4 py-3 border border-[#A8BBC5] rounded-md focus:outline-none focus:border-[#064B7A]" value={form.name} onChange={handleChange} placeholder="Your name" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">Email *</label>
            <input name="email" type="email" required className="w-full px-4 py-3 border border-[#A8BBC5] rounded-md focus:outline-none focus:border-[#064B7A]" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">Phone</label>
            <input name="phone" className="w-full px-4 py-3 border border-[#A8BBC5] rounded-md focus:outline-none focus:border-[#064B7A]" value={form.phone} onChange={handleChange} placeholder="+250 788 123 456" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">Organization</label>
            <input name="organization" className="w-full px-4 py-3 border border-[#A8BBC5] rounded-md focus:outline-none focus:border-[#064B7A]" value={form.organization} onChange={handleChange} placeholder="Company / Org" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">Subject</label>
          <input name="subject" className="w-full px-4 py-3 border border-[#A8BBC5] rounded-md focus:outline-none focus:border-[#064B7A]" value={form.subject} onChange={handleChange} placeholder="What's this about?" />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">Message *</label>
          <textarea name="message" required rows="5" className="w-full px-4 py-3 border border-[#A8BBC5] rounded-md focus:outline-none focus:border-[#064B7A]" value={form.message} onChange={handleChange} placeholder="Tell us more..." />
        </div>

        <label className="flex items-start gap-3 p-4 rounded-lg bg-[#F5F9FB] border border-[#EDF2F5] cursor-pointer hover:bg-[#EDF2F5] transition-colors">
          <input type="checkbox" name="subscribe" checked={form.subscribe} onChange={handleChange} className="w-4 h-4 mt-1 accent-[#8BCB2A] flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#163247]">Subscribe to NCG updates</p>
            <p className="text-xs text-[#6D7E89]">Get notified about new programs, projects, and opportunities.</p>
          </div>
        </label>

        <button type="submit" disabled={loading} className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#A8D94A] transition-all disabled:opacity-50">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
        </button>

        <p className="text-xs text-[#6D7E89]">
          You'll receive a confirmation email. Our team replies within 24-48 hours.
        </p>
      </form>
    </div>
  );
}