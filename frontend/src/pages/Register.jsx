// frontend/src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft,
  GraduationCap, Briefcase, Lightbulb, Users as UsersIcon, User as UserIcon,
  HeartHandshake, TrendingUp, BookOpen, Loader2, Eye, EyeOff,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ROLES = [
  { value: 'student', label: 'Student', desc: 'Learning and building skills', Icon: GraduationCap, color: '#064B7A' },
  { value: 'professional', label: 'Professional', desc: 'Working in tech or related field', Icon: Briefcase, color: '#8BCB2A' },
  { value: 'entrepreneur', label: 'Entrepreneur', desc: 'Building a startup or business', Icon: Lightbulb, color: '#F39C12' },
  { value: 'intern', label: 'Intern', desc: 'Seeking professional experience', Icon: BookOpen, color: '#9B59B6' },
  { value: 'partner', label: 'Partner', desc: 'Collaborating with NCG', Icon: HeartHandshake, color: '#16A085' },
  { value: 'investor', label: 'Investor', desc: 'Supporting innovation', Icon: TrendingUp, color: '#E67E22' },
  { value: 'mentor', label: 'Mentor', desc: 'Contributing expertise', Icon: UsersIcon, color: '#E91E63' },
  { value: 'guest', label: 'Guest', desc: 'Exploring opportunities', Icon: UserIcon, color: '#34495E' },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: 'Rwanda',
    city: '',
    terms: false,
    newsletter: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (field, value) => {
    setForm({ ...form, [field]: value });
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: '' });
    }
  };

  // Password strength
  const passwordStrength = (() => {
    const p = form.password;
    let score = 0;
    if (p.length >= 12) score += 1;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score += 1;
    if (/\d/.test(p)) score += 1;
    if (/[^A-Za-z0-9]/.test(p)) score += 1;
    return score;
  })();

  const strengthColor = ['#EDF2F5', '#E74C3C', '#F39C12', '#8BCB2A', '#6CA51A'][passwordStrength];

  // Validation per step
  const validateStep = (s) => {
    const errs = {};

    if (s === 1) {
      if (!form.role) errs.role = 'Please select a role';
    }
    if (s === 2) {
      if (!form.firstName.trim()) errs.firstName = 'First name is required';
      if (!form.lastName.trim()) errs.lastName = 'Last name is required';
      if (!form.email.trim()) errs.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email address';
      if (form.phone && !/^\+?[0-9\s\-()]{7,20}$/.test(form.phone)) errs.phone = 'Invalid phone number';
    }
    if (s === 3) {
      if (!form.password) errs.password = 'Password is required';
      else if (form.password.length < 12) errs.password = 'Password must be at least 12 characters';
      else if (!/[a-z]/.test(form.password)) errs.password = 'Must contain a lowercase letter';
      else if (!/[A-Z]/.test(form.password)) errs.password = 'Must contain an uppercase letter';
      else if (!/\d/.test(form.password)) errs.password = 'Must contain a number';
      else if (!/[^A-Za-z0-9]/.test(form.password)) errs.password = 'Must contain a special character';
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
      if (!form.terms) errs.terms = 'You must accept the Terms and Privacy Policy';
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep(step + 1);
  };
  const back = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    setError('');
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || undefined,
        password: form.password,
        role: form.role,
        newsletter: form.newsletter,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FB] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.png" alt="NEXT Creatures Group" className="h-20 mx-auto object-contain" />
          </Link>
          <h1 className="text-3xl font-heading font-bold text-[#031B2A] mt-4 mb-2">
            Create your account
          </h1>
          <p className="text-sm text-[#6D7E89]">Join Rwanda's innovation ecosystem</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                s <= step ? 'bg-[#8BCB2A] text-[#031B2A]' : 'bg-[#EDF2F5] text-[#6D7E89]'
              }`}>
                {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-16 h-1 rounded ${s < step ? 'bg-[#8BCB2A]' : 'bg-[#EDF2F5]'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6 md:p-8 shadow-sm">
          {error && (
            <div className="mb-5 p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1 — Role */}
          {step === 1 && (
            <div>
              <h2 className="font-heading font-bold text-xl text-[#031B2A] mb-2">Choose your role</h2>
              <p className="text-sm text-[#6D7E89] mb-6">
                This determines what you'll see in your dashboard.
              </p>

              {fieldErrors.role && (
                <p className="text-xs text-[#E74C3C] mb-3">⚠ {fieldErrors.role}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {ROLES.map((r) => {
                  const Icon = r.Icon;
                  const active = form.role === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => update('role', r.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                        active
                          ? 'border-[#8BCB2A] bg-[#8BCB2A]/5 shadow-md'
                          : 'border-[#EDF2F5] hover:border-[#8BCB2A]/40 hover:bg-[#F5F9FB]'
                      }`}
                    >
                      {active && (
                        <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-[#8BCB2A]" />
                      )}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-2"
                        style={{ background: `${r.color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: r.color }} />
                      </div>
                      <p className="font-heading font-semibold text-sm text-[#031B2A] mb-0.5">{r.label}</p>
                      <p className="text-[11px] text-[#6D7E89] leading-tight">{r.desc}</p>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={next}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-bold py-3.5 rounded-lg hover:bg-[#A8D94A] transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2 — Personal info */}
          {step === 2 && (
            <div>
              <h2 className="font-heading font-bold text-xl text-[#031B2A] mb-2">Personal information</h2>
              <p className="text-sm text-[#6D7E89] mb-6">Tell us about yourself.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">
                    First Name *
                  </label>
                  <input
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:border-[#064B7A] ${
                      fieldErrors.firstName ? 'border-red-300' : 'border-[#A8BBC5]'
                    }`}
                    value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)}
                    placeholder="John"
                  />
                  {fieldErrors.firstName && <p className="text-xs text-[#E74C3C] mt-1">⚠ {fieldErrors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">
                    Last Name *
                  </label>
                  <input
                    className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:border-[#064B7A] ${
                      fieldErrors.lastName ? 'border-red-300' : 'border-[#A8BBC5]'
                    }`}
                    value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)}
                    placeholder="Doe"
                  />
                  {fieldErrors.lastName && <p className="text-xs text-[#E74C3C] mt-1">⚠ {fieldErrors.lastName}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:border-[#064B7A] ${
                    fieldErrors.email ? 'border-red-300' : 'border-[#A8BBC5]'
                  }`}
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                />
                {fieldErrors.email && <p className="text-xs text-[#E74C3C] mt-1">⚠ {fieldErrors.email}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">
                  Phone (optional)
                </label>
                <input
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:border-[#064B7A] ${
                    fieldErrors.phone ? 'border-red-300' : 'border-[#A8BBC5]'
                  }`}
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+250 788 123 456"
                />
                {fieldErrors.phone && <p className="text-xs text-[#E74C3C] mt-1">⚠ {fieldErrors.phone}</p>}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#EDF2F5] text-[#163247] font-semibold py-3.5 px-6 rounded-lg hover:bg-[#F5F9FB]"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-bold py-3.5 rounded-lg hover:bg-[#A8D94A]"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Password */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h2 className="font-heading font-bold text-xl text-[#031B2A] mb-2">Secure your account</h2>
              <p className="text-sm text-[#6D7E89] mb-6">Create a strong password.</p>

              <div className="mb-4">
                <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full px-4 py-3 pr-12 border rounded-md focus:outline-none focus:border-[#064B7A] ${
                      fieldErrors.password ? 'border-red-300' : 'border-[#A8BBC5]'
                    }`}
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="Minimum 12 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#6D7E89] hover:text-[#064B7A]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Strength meter */}
                {form.password && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded transition-all"
                        style={{ background: i <= passwordStrength ? strengthColor : '#EDF2F5' }}
                      />
                    ))}
                  </div>
                )}
                {fieldErrors.password && <p className="text-xs text-[#E74C3C] mt-1">⚠ {fieldErrors.password}</p>}
                <p className="text-[11px] text-[#6D7E89] mt-2">
                  Must contain: 12+ chars, uppercase, lowercase, number, special character
                </p>
              </div>

              <div className="mb-5">
                <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">
                  Confirm Password *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:border-[#064B7A] ${
                    fieldErrors.confirmPassword ? 'border-red-300' : 'border-[#A8BBC5]'
                  }`}
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                />
                {fieldErrors.confirmPassword && <p className="text-xs text-[#E74C3C] mt-1">⚠ {fieldErrors.confirmPassword}</p>}
              </div>

              <div className="space-y-3 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => update('terms', e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#8BCB2A]"
                  />
                  <span className="text-sm text-[#163247]">
                    I agree to NCG's{' '}
                    <Link to="/legal/terms" target="_blank" className="text-[#064B7A] font-semibold hover:underline">Terms of Service</Link>{' '}
                    and{' '}
                    <Link to="/legal/privacy" target="_blank" className="text-[#064B7A] font-semibold hover:underline">Privacy Policy</Link>
                  </span>
                </label>
                {fieldErrors.terms && <p className="text-xs text-[#E74C3C] ml-7">⚠ {fieldErrors.terms}</p>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.newsletter}
                    onChange={(e) => update('newsletter', e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-[#8BCB2A]"
                  />
                  <span className="text-sm text-[#163247]">
                    Subscribe to NCG updates about new programs, projects, and opportunities
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#EDF2F5] text-[#163247] font-semibold py-3.5 px-6 rounded-lg hover:bg-[#F5F9FB]"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-bold py-3.5 rounded-lg hover:bg-[#A8D94A] disabled:opacity-50"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><UserPlus className="w-4 h-4" /> Create Account</>}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-[#6D7E89] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#064B7A] font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}