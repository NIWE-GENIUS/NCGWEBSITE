// src/pages/donation/DonationPage.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Lock, Shield, Heart } from 'lucide-react';
import api from '../../lib/api';

const PAGE_DATA = {
  individual: { title: 'Individual Giving', tagline: 'One-time or recurring gifts from individuals.' },
  corporate: { title: 'Corporate Giving', tagline: 'Corporate donations, sponsorships, and CSR partnerships.' },
  scholarships: { title: 'Sponsor a Student', tagline: 'Fund a student through a full program or specific track.' },
  programs: { title: 'Fund a Program', tagline: 'Fund bootcamps, internships, courses, or coaching programs.' },
  projects: { title: 'Fund a Project', tagline: 'Fund specific technology projects that create real-world impact.' },
  monthly: { title: 'Monthly Giving', tagline: 'Become a monthly donor and sustain our ongoing work.' },
  give: { title: 'Make a Donation', tagline: 'Support our mission with a one-time or recurring gift.' },
};

const AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];

export default function DonationPage() {
  const { slug } = useParams();
  const data = PAGE_DATA[slug] || PAGE_DATA.give;

  const [amount, setAmount] = useState(50000);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('one_time');
  const [designation, setDesignation] = useState('General Fund');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const finalAmount = customAmount ? Number(customAmount) : amount;
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        amount: finalAmount,
        currency: 'RWF',
        donationType: frequency,
        frequency: frequency === 'monthly' ? 'monthly' : undefined,
        designation,
        message: form.message || undefined,
      };
      const res = await api.post('/donations', payload);
      setSuccess(res.data);
    } catch (err) {
      setError(err.message || 'Donation failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="section bg-[#F5F9FB] min-h-[70vh] flex items-center">
        <div className="container-ncg max-w-2xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#8BCB2A] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-[#031B2A] mb-3">Thank You!</h1>
          <p className="text-[#6D7E89] mb-6">
            Your donation has been received. A receipt has been sent to your email.
          </p>
          <div className="inline-block p-4 rounded-xl bg-white border border-[#EDF2F5] mb-6">
            <p className="text-xs uppercase tracking-wider text-[#6D7E89] font-bold mb-1">Donation ID</p>
            <p className="font-heading font-bold text-[#031B2A]">{success.donationId}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/" className="bg-[#064B7A] text-white font-semibold px-6 py-3 rounded-lg">Back Home</Link>
            <Link to="/donate" className="border-2 border-[#064B7A] text-[#064B7A] font-semibold px-6 py-3 rounded-lg">Give Again</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section bg-[#F5F9FB]">
      <div className="container-ncg">
        <Link to="/donate" className="inline-flex items-center gap-2 text-[#064B7A] hover:text-[#8BCB2A] mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Donations
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info side */}
          <div className="lg:col-span-1">
            <div className="card p-7 sticky top-24">
              <Heart className="w-10 h-10 text-[#8BCB2A] mb-4" />
              <h1 className="text-2xl font-heading font-bold text-[#031B2A] mb-2">{data.title}</h1>
              <p className="text-sm text-[#6D7E89] mb-6">{data.tagline}</p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-[#6D7E89]">
                  <Lock className="w-4 h-4 text-[#8BCB2A]" />
                  Secure payment
                </div>
                <div className="flex items-center gap-2 text-[#6D7E89]">
                  <Shield className="w-4 h-4 text-[#8BCB2A]" />
                  Tax receipt provided
                </div>
                <div className="flex items-center gap-2 text-[#6D7E89]">
                  <CheckCircle2 className="w-4 h-4 text-[#8BCB2A]" />
                  100% transparency
                </div>
              </div>
            </div>
          </div>

          {/* Form side */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-7 md:p-9">
              {error && (
                <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
              )}

              <div className="mb-6">
                <label className="label">Donation Amount (RWF) *</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => { setAmount(a); setCustomAmount(''); }}
                      className={`py-3 rounded-md text-sm font-semibold border transition-all ${
                        amount === a && !customAmount
                          ? 'bg-[#8BCB2A] text-white border-[#8BCB2A]'
                          : 'bg-white text-[#163247] border-[#EDF2F5] hover:border-[#8BCB2A]'
                      }`}
                    >
                      {a.toLocaleString()}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  className="input"
                  placeholder="Or enter custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min="1"
                />
              </div>

              <div className="mb-6">
                <label className="label">Frequency *</label>
                <div className="flex gap-2">
                  {[
                    { v: 'one_time', l: 'One-time' },
                    { v: 'monthly', l: 'Monthly' },
                    { v: 'annual', l: 'Annually' },
                  ].map((f) => (
                    <button
                      key={f.v}
                      type="button"
                      onClick={() => setFrequency(f.v)}
                      className={`flex-1 py-3 rounded-md text-sm font-semibold border transition-all ${
                        frequency === f.v
                          ? 'bg-[#064B7A] text-white border-[#064B7A]'
                          : 'bg-white text-[#163247] border-[#EDF2F5] hover:border-[#064B7A]'
                      }`}
                    >
                      {f.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="label">Designation *</label>
                <select className="input" value={designation} onChange={(e) => setDesignation(e.target.value)}>
                  <option>General Fund</option>
                  <option>Scholarship Fund</option>
                  <option>Bootcamp Fund</option>
                  <option>Internship Fund</option>
                  <option>Online Learning Fund</option>
                  <option>Coaching Fund</option>
                  <option>Project Fund</option>
                  <option>Equipment Fund</option>
                  <option>Emergency Fund</option>
                  <option>Endowment Fund</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                </div>
              </div>

              <div className="mb-6">
                <label className="label">Phone (optional)</label>
                <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+250 788 123 456" />
              </div>

              <div className="mb-6">
                <label className="label">Message (optional)</label>
                <textarea rows="3" className="input" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Add a message..." />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#8BCB2A] text-[#031B2A] font-bold py-4 rounded-md hover:bg-[#A8D94A] disabled:opacity-50 text-base">
                {loading ? 'Processing...' : `Donate ${(customAmount ? Number(customAmount) : amount).toLocaleString()} RWF`}
              </button>

              <p className="text-xs text-center text-[#6D7E89] mt-4">
                You will receive a tax receipt via email. Thank you for your generosity.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}