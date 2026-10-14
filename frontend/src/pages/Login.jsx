// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[#F5F9FB]">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-6">
            <img src="/logo.png" alt="NCG" className="h-20 mx-auto mb-4 object-contain" />
            <h1 className="text-2xl font-heading font-bold mb-1 text-[#031B2A]">Welcome back</h1>
            <p className="text-sm text-[#6D7E89]">Sign in to your NCG account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#8BCB2A] text-[#031B2A] font-semibold py-3 rounded-md hover:bg-[#A8D94A] disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-[#6D7E89]">Don't have an account? </span>
            <Link to="/register" className="font-semibold text-[#064B7A] hover:text-[#8BCB2A]">Sign up</Link>
          </div>

          <div className="mt-6 p-3 rounded-md bg-[#F5F9FB] text-xs text-[#6D7E89]">
            <strong className="text-[#163247]">Demo admin:</strong><br />
            admin@nextcreaturesgroup.com / Admin@12345
          </div>
        </div>
      </div>
    </div>
  );
}