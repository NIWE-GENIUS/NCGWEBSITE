import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../lib/api';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('Missing verification token'); return; }
    api.post('/auth/verify-email', { token })
      .then(() => setStatus('success'))
      .catch((err) => { setStatus('error'); setMessage(err.message || 'Verification failed'); });
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#F5F9FB]">
      <div className="max-w-md w-full bg-white border border-[#EDF2F5] rounded-2xl p-8 text-center">
        <img src="/logo.png" alt="NCG" className="h-16 mx-auto mb-6" />
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 text-[#8BCB2A] animate-spin mx-auto mb-4" />
            <p className="font-semibold text-[#031B2A]">Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-[#8BCB2A] mx-auto mb-4" />
            <h1 className="font-heading font-bold text-2xl text-[#031B2A] mb-2">Email verified!</h1>
            <p className="text-sm text-[#6D7E89] mb-6">Your account is now active.</p>
            <Link to="/login" className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-bold px-6 py-3 rounded-lg">
              Sign In
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="w-16 h-16 text-[#E74C3C] mx-auto mb-4" />
            <h1 className="font-heading font-bold text-2xl text-[#031B2A] mb-2">Verification failed</h1>
            <p className="text-sm text-[#6D7E89] mb-6">{message}</p>
            <Link to="/contact" className="text-[#064B7A] font-semibold hover:underline">Contact Support</Link>
          </>
        )}
      </div>
    </div>
  );
}