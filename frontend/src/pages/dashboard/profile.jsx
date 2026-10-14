// src/pages/dashboard/Profile.jsx
import { useEffect, useState } from 'react';
import { User, Mail, MapPin, Briefcase, Loader2, Save, CheckCircle2 } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    headline: '',
    bio: '',
    location: '',
    country: 'Rwanda',
    city: '',
    company: '',
    position: '',
    website: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/profile/me');
        const p = res.data;
        setForm({
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          phone: p.phone || '',
          headline: p.headline || '',
          bio: p.bio || '',
          location: p.location || '',
          country: p.country || 'Rwanda',
          city: p.city || '',
          company: p.company || '',
          position: p.position || '',
          website: p.website || '',
        });
      } catch (_) {}
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await api.put('/profile/me', {
        headline: form.headline,
        bio: form.bio,
        location: form.location,
        country: form.country,
        city: form.city,
        company: form.company,
        position: form.position,
        website: form.website || undefined,
      });
      await api.put(`/users/${user.id}`, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      });
      await refresh();
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-heading font-bold text-[#031B2A] mb-6">My Profile</h1>

      {success && (
        <div className="mb-4 p-3 rounded-md bg-[#8BCB2A]/10 border border-[#8BCB2A]/30 flex items-center gap-2 text-sm text-[#6CA51A]">
          <CheckCircle2 className="w-4 h-4" />
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#EDF2F5] rounded-xl p-6 md:p-8 space-y-6">
        {/* Identity */}
        <section>
          <h2 className="font-heading font-bold text-base text-[#031B2A] mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-[#8BCB2A]" />
            Identity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input className="input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input className="input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input bg-[#F5F9FB]" value={user?.email || ''} disabled />
            </div>
          </div>
        </section>

        {/* Professional */}
        <section className="border-t border-[#EDF2F5] pt-6">
          <h2 className="font-heading font-bold text-base text-[#031B2A] mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#8BCB2A]" />
            Professional
          </h2>
          <div className="space-y-4">
            <div>
              <label className="label">Headline</label>
              <input className="input" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="e.g. Full-Stack Developer" />
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea rows="4" className="input" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Company</label>
                <input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div>
                <label className="label">Position</label>
                <input className="input" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Website</label>
              <input type="url" className="input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="border-t border-[#EDF2F5] pt-6">
          <h2 className="font-heading font-bold text-base text-[#031B2A] mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#8BCB2A]" />
            Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Country</label>
              <input className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Kigali" />
            </div>
          </div>
        </section>

        <div className="border-t border-[#EDF2F5] pt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-6 py-3 rounded-md hover:bg-[#A8D94A] disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}