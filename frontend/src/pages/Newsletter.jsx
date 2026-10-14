import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';

export default function Newsletter() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get('email') || '');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await api.post('/newsletter/subscribe', { email, name });
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Subscription failed');
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F9FB] p-4">
      <div className="max-w-md w-full bg-white border border-[#EDF2F5] rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#8BCB2A]/15 flex items-center justify-center">
            <Mail className="w-7 h-7 text-[#8BCB2A]" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-[#031B2A] mb-2">Stay Updated</h1>
          <p className="text-sm text-[#6D7E89]">Get NCG news, programs, and opportunities directly in your inbox.</p>
        </div>

        {status === 'success' ? (
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-[#8BCB2A] mx-auto mb-4" />
            <p className="font-semibold text-[#031B2A] mb-2">You're subscribed!</p>
            <p className="text-sm text-[#6D7E89]">Check your inbox for a welcome email.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
            <div>
              <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">Email *</label>
              <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <button type="submit" disabled={status === 'loading'} className="w-full bg-[#8BCB2A] text-[#031B2A] font-bold py-3.5 rounded-lg hover:bg-[#A8D94A] disabled:opacity-50">
              {status === 'loading' ? <><Loader2 className="w-4 h-4 inline mr-2 animate-spin" /> Subscribing...</> : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}