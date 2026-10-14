// src/pages/dashboard/Settings.jsx
import { useState } from 'react';
import { Lock, Bell, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export default function Settings() {
  const { logout } = useAuth();
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwords.next !== passwords.confirm) {
      setError('New passwords do not match');
      return;
    }
    if (passwords.next.length < 12) {
      setError('Password must be at least 12 characters');
      return;
    }

    setSaving(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      setSuccess('Password changed successfully');
      setPasswords({ current: '', next: '', confirm: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-heading font-bold text-[#031B2A]">Settings</h1>

      {/* Password */}
      <section className="bg-white border border-[#EDF2F5] rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-[#8BCB2A]/15 flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#8BCB2A]" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base text-[#031B2A]">Change Password</h2>
            <p className="text-xs text-[#6D7E89]">Update your account password</p>
          </div>
        </div>

        {success && (
          <div className="mb-4 p-3 rounded-md bg-[#8BCB2A]/10 border border-[#8BCB2A]/30 flex items-center gap-2 text-sm text-[#6CA51A]">
            <CheckCircle2 className="w-4 h-4" /> {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input
              type="password"
              required
              className="input"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">New Password</label>
              <input
                type="password"
                required
                className="input"
                value={passwords.next}
                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                placeholder="Min 12 chars"
              />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input
                type="password"
                required
                className="input"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-6 py-3 rounded-md hover:bg-[#A8D94A] disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </section>

      {/* Notifications */}
      <section className="bg-white border border-[#EDF2F5] rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-[#F39C12]/15 flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#F39C12]" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base text-[#031B2A]">Notifications</h2>
            <p className="text-xs text-[#6D7E89]">Choose what updates to receive</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Email Notifications', desc: 'Receive updates via email', default: true },
            { label: 'Program Updates', desc: 'Get notified about program progress', default: true },
            { label: 'Marketing', desc: 'Receive news and opportunities', default: false },
          ].map((opt, i) => (
            <label key={i} className="flex items-center justify-between p-4 rounded-lg border border-[#EDF2F5] hover:bg-[#F5F9FB] cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-[#031B2A]">{opt.label}</p>
                <p className="text-xs text-[#6D7E89]">{opt.desc}</p>
              </div>
              <input type="checkbox" defaultChecked={opt.default} className="w-5 h-5 accent-[#8BCB2A]" />
            </label>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="bg-white border border-red-200 rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-[#E74C3C]" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base text-[#E74C3C]">Danger Zone</h2>
            <p className="text-xs text-[#6D7E89]">Careful — these actions are permanent</p>
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to logout?')) {
              logout();
            }
          }}
          className="inline-flex items-center gap-2 border-2 border-red-200 text-[#E74C3C] font-semibold px-5 py-2.5 rounded-md hover:bg-red-50 transition-colors"
        >
          Logout from this device
        </button>
      </section>
    </div>
  );
}