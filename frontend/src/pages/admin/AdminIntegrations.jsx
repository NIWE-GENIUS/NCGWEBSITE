// src/pages/admin/AdminIntegrations.jsx
import { useEffect, useState } from 'react';
import {
  Puzzle, Loader2, CheckCircle2, XCircle, AlertCircle, Save, Plus,
} from 'lucide-react';
import api from '../../lib/api';
import { PageHeader, Modal, FormField } from './AdminComponents';

const INTEGRATION_TEMPLATES = [
  { name: 'Stripe', type: 'payment', provider: 'stripe', icon: '💳', desc: 'Accept card payments' },
  { name: 'PayPal', type: 'payment', provider: 'paypal', icon: '🅿️', desc: 'Accept PayPal payments' },
  { name: 'Flutterwave', type: 'payment', provider: 'flutterwave', icon: '🌍', desc: 'African payment gateway' },
  { name: 'Cloudinary', type: 'storage', provider: 'cloudinary', icon: '☁️', desc: 'Media storage & CDN' },
  { name: 'SendGrid', type: 'email', provider: 'sendgrid', icon: '📧', desc: 'Transactional email' },
  { name: 'GA4', type: 'analytics', provider: 'ga4', icon: '📊', desc: 'Google Analytics 4' },
  { name: 'Slack', type: 'communication', provider: 'slack', icon: '💬', desc: 'Team notifications' },
  { name: 'MTN Mobile Money', type: 'payment', provider: 'mtn-momo', icon: '📱', desc: 'Rwanda mobile payments' },
];

export default function AdminIntegrations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [config, setConfig] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings/all').catch(() => ({ data: [] }));
      setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openConfig = (tpl) => {
    setSelected(tpl);
    setConfig({ apiKey: '', apiSecret: '', enabled: false });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put(`/settings/integration-${selected.provider}`, {
        value: { ...config, name: selected.name, provider: selected.provider, type: selected.type },
        category: 'integrations',
        isPublic: false,
      });
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Integrations"
        subtitle="Connect third-party services to power payments, email, analytics, and more"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {INTEGRATION_TEMPLATES.map((tpl) => (
          <button
            key={tpl.provider}
            onClick={() => openConfig(tpl)}
            className="text-left bg-white border border-[#EDF2F5] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{tpl.icon}</div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#6D7E89] bg-[#F5F9FB] px-2 py-1 rounded">
                {tpl.type}
              </span>
            </div>
            <h3 className="font-heading font-bold text-base text-[#031B2A] mb-1">{tpl.name}</h3>
            <p className="text-xs text-[#6D7E89] mb-4">{tpl.desc}</p>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064B7A]">
              <Plus className="w-3.5 h-3.5" /> Configure
            </span>
          </button>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Configure ${selected?.name || ''}`}>
        <form onSubmit={handleSave} className="space-y-4">
          {error && <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>}

          <div className="p-3 rounded-lg bg-[#F5F9FB] text-sm text-[#6D7E89]">
            Enter credentials below. All values are stored securely and never exposed to the public site.
          </div>

          <FormField label="API Key">
            <input className="input" value={config.apiKey} onChange={(e) => setConfig({ ...config, apiKey: e.target.value })} />
          </FormField>
          <FormField label="API Secret">
            <input type="password" className="input" value={config.apiSecret} onChange={(e) => setConfig({ ...config, apiSecret: e.target.value })} />
          </FormField>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-[#8BCB2A]" checked={config.enabled} onChange={(e) => setConfig({ ...config, enabled: e.target.checked })} />
            <span className="text-sm font-medium text-[#163247]">Enable this integration</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EDF2F5]">
            <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-md text-sm font-semibold border border-[#EDF2F5] hover:bg-[#F5F9FB]">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold bg-[#8BCB2A] text-[#031B2A] hover:bg-[#A8D94A] disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Integration'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}