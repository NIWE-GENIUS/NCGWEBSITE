import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 12) { setError('Password must be at least 12 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setStatus('loading');
    setError('');
    try {
      await api.post('/auth/reset-password', { token, password });
      setStatus('success');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message || 'Reset failed');
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F5F9FB]">
      <div className="max-w-md w-full bg-white border border-[#EDF2F5] rounded-2xl p-8">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="NCG" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-[#031B2A] mb-2">Reset password</h1>
        </div>
        {status === 'success' ? (
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-[#8BCB2A] mx-auto mb-4" />
            <p className="font-semibold text-[#031B2A] mb-2">Password reset!</p>
            <p className="text-sm text-[#6D7E89]">Redirecting to sign in...</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}
            <div>
              <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">New Password</label>
              <input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 12 chars" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">Confirm Password</label>
              <input type="password" required className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <button type="submit" disabled={status === 'loading'} className="w-full bg-[#8BCB2A] text-[#031B2A] font-bold py-3.5 rounded-lg hover:bg-[#A8D94A] disabled:opacity-50">
              {status === 'loading' ? <><Loader2 className="w-4 h-4 inline mr-2 animate-spin" /> Resetting...</> : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}