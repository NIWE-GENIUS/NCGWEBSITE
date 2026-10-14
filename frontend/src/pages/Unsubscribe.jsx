import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MailX, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get('email') || '');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await api.post('/newsletter/unsubscribe', { email });
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Failed');
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F5F9FB] p-4">
      <div className="max-w-md w-full bg-white border border-[#EDF2F5] rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#E74C3C]/10 flex items-center justify-center">
            <MailX className="w-7 h-7 text-[#E74C3C]" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-[#031B2A] mb-2">Unsubscribe</h1>
          <p className="text-sm text-[#6D7E89]">We're sorry to see you go.</p>
        </div>
        {status === 'success' ? (
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-[#8BCB2A] mx-auto mb-4" />
            <p className="font-semibold text-[#031B2A]">You've been unsubscribed</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
            <div>
              <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">Email *</label>
              <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" disabled={status === 'loading'} className="w-full bg-[#E74C3C] text-white font-bold py-3.5 rounded-lg hover:bg-red-700 disabled:opacity-50">
              {status === 'loading' ? 'Unsubscribing...' : 'Unsubscribe'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}