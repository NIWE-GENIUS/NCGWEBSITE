import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Failed');
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F5F9FB]">
      <div className="max-w-md w-full bg-white border border-[#EDF2F5] rounded-2xl p-8">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="NCG" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-[#031B2A] mb-2">Forgot password?</h1>
          <p className="text-sm text-[#6D7E89]">Enter your email and we'll send a reset link.</p>
        </div>
        {status === 'success' ? (
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-[#8BCB2A] mx-auto mb-4" />
            <p className="font-semibold text-[#031B2A] mb-2">Reset link sent!</p>
            <p className="text-sm text-[#6D7E89] mb-6">If an account exists for {email}, you'll receive a link within a minute.</p>
            <Link to="/login" className="text-[#064B7A] font-semibold hover:underline">Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
            <div>
              <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">Email</label>
              <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" disabled={status === 'loading'} className="w-full bg-[#8BCB2A] text-[#031B2A] font-bold py-3.5 rounded-lg hover:bg-[#A8D94A] disabled:opacity-50">
              {status === 'loading' ? <><Loader2 className="w-4 h-4 inline mr-2 animate-spin" /> Sending...</> : 'Send Reset Link'}
            </button>
            <Link to="/login" className="block text-center text-sm text-[#064B7A] hover:underline">Back to sign in</Link>
          </form>
        )}
      </div>
    </div>
  );
}