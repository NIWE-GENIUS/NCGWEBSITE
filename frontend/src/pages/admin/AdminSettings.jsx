// src/pages/admin/AdminSettings.jsx
import { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon, Save, Loader2, CheckCircle2, Building2,
  Mail, Globe, DollarSign, MessageSquare, AlertCircle,
} from 'lucide-react';
import api from '../../lib/api';
import { PageHeader, FormField } from './AdminComponents';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [company, setCompany] = useState({
    legalName: '',
    brandName: '',
    tagline: '',
    positioning: '',
    descriptionShort: '',
    mission: '',
    vision: '',
    primaryEmail: '',
    supportEmail: '',
    phone: '',
    whatsapp: '',
    location: '',
    country: 'Rwanda',
    currency: 'RWF',
    timezone: 'Africa/Kigali',
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/settings/company');
        const c = res.data || {};
        setCompany({
          legalName: c.legalName || '',
          brandName: c.brandName || '',
          tagline: c.tagline || '',
          positioning: c.positioning || '',
          descriptionShort: c.descriptionShort || '',
          mission: c.mission || '',
          vision: c.vision || '',
          primaryEmail: c.primaryEmail || '',
          supportEmail: c.supportEmail || '',
          phone: c.phone || '',
          whatsapp: c.whatsapp || '',
          location: c.location || '',
          country: c.country || 'Rwanda',
          currency: c.currency || 'RWF',
          timezone: c.timezone || 'Africa/Kigali',
        });
      } catch (_) {}
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await api.put('/settings/company', company);
      setSuccess('Company settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="System Settings"
        subtitle="Configure your NCG platform — these settings affect the entire site"
      />

      {success && (
        <div className="mb-4 p-3 rounded-md bg-[#8BCB2A]/10 border border-[#8BCB2A]/30 flex items-center gap-2 text-sm text-[#6CA51A]">
          <CheckCircle2 className="w-4 h-4" /> {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity */}
        <section className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-[#064B7A]/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#064B7A]" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-[#031B2A]">Company Identity</h2>
              <p className="text-xs text-[#6D7E89]">Brand name, tagline, and positioning</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Legal Name">
              <input className="input" value={company.legalName} onChange={(e) => setCompany({ ...company, legalName: e.target.value })} />
            </FormField>
            <FormField label="Brand Name">
              <input className="input" value={company.brandName} onChange={(e) => setCompany({ ...company, brandName: e.target.value })} />
            </FormField>
            <FormField label="Tagline">
              <input className="input" value={company.tagline} onChange={(e) => setCompany({ ...company, tagline: e.target.value })} placeholder="Smart Solutions For Digital Future" />
            </FormField>
            <FormField label="Positioning">
              <input className="input" value={company.positioning} onChange={(e) => setCompany({ ...company, positioning: e.target.value })} />
            </FormField>
          </div>
        </section>

        {/* Story */}
        <section className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-[#8BCB2A]/15 flex items-center justify-center">
              <Globe className="w-5 h-5 text-[#8BCB2A]" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-[#031B2A]">Mission & Vision</h2>
              <p className="text-xs text-[#6D7E89]">Shown on About page and homepage</p>
            </div>
          </div>
          <div className="space-y-4">
            <FormField label="Short Description">
              <textarea rows="2" className="input" value={company.descriptionShort} onChange={(e) => setCompany({ ...company, descriptionShort: e.target.value })} />
            </FormField>
            <FormField label="Mission">
              <textarea rows="3" className="input" value={company.mission} onChange={(e) => setCompany({ ...company, mission: e.target.value })} />
            </FormField>
            <FormField label="Vision">
              <textarea rows="3" className="input" value={company.vision} onChange={(e) => setCompany({ ...company, vision: e.target.value })} />
            </FormField>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-[#3498DB]/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#3498DB]" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-[#031B2A]">Contact Information</h2>
              <p className="text-xs text-[#6D7E89]">Displayed in footer and contact page</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Primary Email">
              <input type="email" className="input" value={company.primaryEmail} onChange={(e) => setCompany({ ...company, primaryEmail: e.target.value })} />
            </FormField>
            <FormField label="Support Email">
              <input type="email" className="input" value={company.supportEmail} onChange={(e) => setCompany({ ...company, supportEmail: e.target.value })} />
            </FormField>
            <FormField label="Phone">
              <input className="input" value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
            </FormField>
            <FormField label="WhatsApp">
              <input className="input" value={company.whatsapp} onChange={(e) => setCompany({ ...company, whatsapp: e.target.value })} />
            </FormField>
            <FormField label="Location">
              <input className="input" value={company.location} onChange={(e) => setCompany({ ...company, location: e.target.value })} />
            </FormField>
            <FormField label="Country">
              <input className="input" value={company.country} onChange={(e) => setCompany({ ...company, country: e.target.value })} />
            </FormField>
          </div>
        </section>

        {/* Regional */}
        <section className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-[#F39C12]/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#F39C12]" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-[#031B2A]">Regional Settings</h2>
              <p className="text-xs text-[#6D7E89]">Currency, timezone</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Default Currency">
              <select className="input" value={company.currency} onChange={(e) => setCompany({ ...company, currency: e.target.value })}>
                <option value="RWF">RWF — Rwandan Franc</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
              </select>
            </FormField>
            <FormField label="Timezone">
              <input className="input" value={company.timezone} onChange={(e) => setCompany({ ...company, timezone: e.target.value })} />
            </FormField>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-7 py-3 rounded-md hover:bg-[#A8D94A] disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}