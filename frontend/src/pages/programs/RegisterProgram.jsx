// frontend/src/pages/programs/RegisterProgram.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, AlertCircle, CheckCircle2, ArrowRight, Loader2, Upload,
} from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

// Program-specific extra fields
const PROGRAM_SPECIFIC_FIELDS = {
  bootcamp: [
    { name: 'preferredTrack', label: 'Preferred Track', type: 'select', required: true,
      options: ['Web Development', 'Software Development', 'Cybersecurity', 'Networking', 'IoT & Embedded Systems', 'AI & Data', 'UI/UX', 'Entrepreneurship'] },
    { name: 'skillLevel', label: 'Current Skill Level', type: 'select', required: true,
      options: ['Beginner', 'Intermediate', 'Advanced'] },
    { name: 'availability', label: 'Weekly Availability', type: 'select', required: true,
      options: ['Full-time', 'Part-time (evenings)', 'Weekends only'] },
    { name: 'motivation', label: 'Why do you want to join?', type: 'textarea', required: true },
  ],
  internship: [
    { name: 'preferredDepartment', label: 'Preferred Department', type: 'select', required: true,
      options: ['Software Development', 'IT / Networking', 'Cybersecurity', 'IoT / Embedded Systems', 'Engineering', 'Innovation / Research', 'Design / Creative', 'Business / Marketing'] },
    { name: 'startDate', label: 'Preferred Start Date', type: 'date', required: true },
    { name: 'duration', label: 'Preferred Duration', type: 'select', required: true,
      options: ['3 Months', '4 Months', '5 Months', '6 Months'] },
    { name: 'cvLink', label: 'Link to CV/Portfolio', type: 'url', required: false },
    { name: 'motivation', label: 'Why do you want to intern at NCG?', type: 'textarea', required: true },
  ],
  'online-learning': [
    { name: 'courseInterest', label: 'Course Interest', type: 'select', required: true,
      options: ['Web Development', 'Programming', 'Cybersecurity', 'Networking', 'IoT & Embedded', 'AI & Data'] },
    { name: 'learningGoal', label: 'What do you want to achieve?', type: 'textarea', required: true },
    { name: 'weeklyCommitment', label: 'Weekly Time Commitment', type: 'select', required: true,
      options: ['1-3 hours', '4-7 hours', '8-14 hours', '15+ hours'] },
  ],
  coaching: [
    { name: 'coachingArea', label: 'Coaching Area', type: 'select', required: true,
      options: ['Career Coaching', 'Technology Coaching', 'Project Coaching', 'Entrepreneurship Coaching'] },
    { name: 'currentSituation', label: 'Your Current Situation', type: 'textarea', required: true },
    { name: 'goal', label: 'Your Goal', type: 'textarea', required: true },
    { name: 'preferredFormat', label: 'Preferred Format', type: 'select', required: true,
      options: ['1-on-1', 'Group', 'Both'] },
    { name: 'preferredFrequency', label: 'Preferred Frequency', type: 'select', required: true,
      options: ['Weekly', 'Bi-weekly', 'Monthly'] },
  ],
  'private-tutoring': [
    { name: 'subject', label: 'Subject', type: 'select', required: true,
      options: ['Programming', 'Computer Science', 'Networking', 'Electronics', 'Math for CS'] },
    { name: 'specificTopics', label: 'Specific Topics Needed', type: 'textarea', required: true },
    { name: 'currentLevel', label: 'Current Level', type: 'select', required: true,
      options: ['Beginner', 'Intermediate', 'Advanced'] },
    { name: 'preferredFormat', label: 'Preferred Format', type: 'select', required: true,
      options: ['1-on-1', 'Small Group (2-5)'] },
    { name: 'preferredSchedule', label: 'Preferred Schedule', type: 'text', required: true,
      placeholder: 'e.g. Weekends 9am-12pm' },
  ],
};

// Common fields for all programs
const COMMON_FIELDS = [
  { name: 'educationLevel', label: 'Education Level', type: 'select', required: true,
    options: ['Secondary School', 'Certificate / Diploma', "Bachelor's Degree", "Master's Degree", 'Self-taught', 'Other'] },
  { name: 'institution', label: 'School / Institution', type: 'text', required: false,
    placeholder: 'e.g. University of Rwanda' },
  { name: 'country', label: 'Country', type: 'text', required: true, default: 'Rwanda' },
  { name: 'city', label: 'City / District', type: 'text', required: true, placeholder: 'e.g. Kigali' },
];

export default function RegisterProgram() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    // personal
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // common
    educationLevel: '',
    institution: '',
    country: 'Rwanda',
    city: '',
    // program-specific
    ...Object.fromEntries(
      Object.values(PROGRAM_SPECIFIC_FIELDS).flat().map((f) => [f.name, ''])
    ),
    // extra
    documents: [],
    motivation: '',
    termsAccepted: false,
    subscribeUpdates: true,
  });

  const [fieldErrors, setFieldErrors] = useState({});

  // Fetch program + prefill from user
  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/programs/slug/${slug}`);
        setProgram(res.data);
      } catch (err) {
        setError('Program not found');
      } finally {
        setLoading(false);
      }
    }
    load();

    if (user) {
      setForm((f) => ({
        ...f,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [slug, user]);

  const categoryKey = program?.category || 'bootcamp';
  const specificFields = PROGRAM_SPECIFIC_FIELDS[categoryKey] || [];
  const allFields = [...specificFields, ...COMMON_FIELDS];

  const update = (field, value) => {
    setForm({ ...form, [field]: value });
    if (fieldErrors[field]) setFieldErrors({ ...fieldErrors, [field]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.termsAccepted) errs.termsAccepted = 'You must accept the terms';

    allFields.forEach((f) => {
      if (f.required && !String(form[f.name] || '').trim()) {
        errs[f.name] = `${f.label} is required`;
      }
    });

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      // Build extra fields payload
      const extraData = {};
      specificFields.forEach((f) => { extraData[f.name] = form[f.name]; });
      const commonData = {};
      COMMON_FIELDS.forEach((f) => { commonData[f.name] = form[f.name]; });

      const payload = {
        programId: program.id,
        personalInfo: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },
        education: [commonData],
        motivation: form.motivation || form.whyNCG || '',
        extraData: { ...extraData, ...commonData },
        documents: form.documents || [],
      };

      const res = await api.post('/applications', payload);
      setSuccess({
        applicationId: res.data?.applicationId || 'received',
      });
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#8BCB2A] animate-spin" />
      </div>
    );
  }

  // ============================================================
  // SUCCESS STATE
  // ============================================================
  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F9FB] flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#8BCB2A] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-[#031B2A] mb-3">
            Application received!
          </h1>
          <p className="text-[#6D7E89] mb-6">
            Thank you for applying to <strong>{program.name}</strong>.
            We'll review your application and reach out within 5-7 business days.
          </p>
          <div className="inline-block p-4 rounded-xl bg-white border border-[#EDF2F5] mb-6">
            <p className="text-xs uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
              Application ID
            </p>
            <p className="font-heading font-bold text-[#031B2A]">
              {success.applicationId}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {isAuthenticated && (
              <Link
                to="/dashboard/applications"
                className="bg-[#064B7A] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#062F4A]"
              >
                View My Applications
              </Link>
            )}
            <Link
              to="/programs"
              className="border-2 border-[#064B7A] text-[#064B7A] font-semibold px-6 py-3 rounded-lg hover:bg-[#F5F9FB]"
            >
              Browse Programs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // FORM
  // ============================================================
  return (
    <div className="min-h-screen bg-[#F5F9FB] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          to={`/programs/${slug}`}
          className="inline-flex items-center gap-2 text-[#064B7A] hover:text-[#8BCB2A] mb-6 text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {program.name}
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-br from-[#064B7A] to-[#031B2A] rounded-2xl p-6 md:p-8 text-white mb-6">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="NCG" className="h-14 w-auto bg-white rounded-lg p-1.5" />
            <div>
              <p className="text-xs uppercase tracking-wider text-[#8BCB2A] font-bold mb-1">
                Apply for
              </p>
              <h1 className="text-2xl md:text-3xl font-heading font-bold">{program.name}</h1>
              {program.tagline && (
                <p className="text-sm text-white/70 mt-1">{program.tagline}</p>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6 md:p-8">
            <h2 className="font-heading font-bold text-lg text-[#031B2A] mb-5">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="First Name" required error={fieldErrors.firstName}>
                <input
                  className="input"
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  placeholder="John"
                />
              </FormField>
              <FormField label="Last Name" required error={fieldErrors.lastName}>
                <input
                  className="input"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  placeholder="Doe"
                />
              </FormField>
              <FormField label="Email" required error={fieldErrors.email}>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </FormField>
              <FormField label="Phone" error={fieldErrors.phone}>
                <input
                  className="input"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+250 788 123 456"
                />
              </FormField>
            </div>
          </div>

          {/* Program-Specific Questions */}
          <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6 md:p-8">
            <h2 className="font-heading font-bold text-lg text-[#031B2A] mb-5">
              {program.name} — Specific Questions
            </h2>

            <div className="space-y-4">
              {specificFields.map((f) => (
                <FormField key={f.name} label={f.label} required={f.required} error={fieldErrors[f.name]}>
                  {f.type === 'textarea' ? (
                    <textarea
                      rows="4"
                      className="input"
                      value={form[f.name] || ''}
                      onChange={(e) => update(f.name, e.target.value)}
                      placeholder={f.placeholder || ''}
                    />
                  ) : f.type === 'select' ? (
                    <select
                      className="input"
                      value={form[f.name] || ''}
                      onChange={(e) => update(f.name, e.target.value)}
                    >
                      <option value="">Select {f.label.toLowerCase()}</option>
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={f.type}
                      className="input"
                      value={form[f.name] || ''}
                      onChange={(e) => update(f.name, e.target.value)}
                      placeholder={f.placeholder || ''}
                    />
                  )}
                </FormField>
              ))}
            </div>
          </div>

          {/* Education & Background */}
          <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6 md:p-8">
            <h2 className="font-heading font-bold text-lg text-[#031B2A] mb-5">
              Education & Background
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMMON_FIELDS.map((f) => (
                <FormField
                  key={f.name}
                  label={f.label}
                  required={f.required}
                  error={fieldErrors[f.name]}
                >
                  {f.type === 'select' ? (
                    <select
                      className="input"
                      value={form[f.name] || ''}
                      onChange={(e) => update(f.name, e.target.value)}
                    >
                      <option value="">Select {f.label.toLowerCase()}</option>
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={f.type}
                      className="input"
                      value={form[f.name] || ''}
                      onChange={(e) => update(f.name, e.target.value)}
                      placeholder={f.placeholder || ''}
                    />
                  )}
                </FormField>
              ))}
            </div>
          </div>

          {/* Agreement */}
          <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6 md:p-8">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.termsAccepted}
                onChange={(e) => update('termsAccepted', e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#8BCB2A]"
              />
              <span className="text-sm text-[#163247]">
                I confirm the information above is accurate and I agree to NCG's{' '}
                <Link to="/legal/terms" className="text-[#064B7A] font-semibold hover:underline">Terms</Link>{' '}
                and{' '}
                <Link to="/legal/privacy" className="text-[#064B7A] font-semibold hover:underline">Privacy Policy</Link>
              </span>
            </label>
            {fieldErrors.termsAccepted && (
              <p className="text-xs text-[#E74C3C] mt-2 ml-7">⚠ {fieldErrors.termsAccepted}</p>
            )}

            <label className="flex items-start gap-3 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={form.subscribeUpdates}
                onChange={(e) => update('subscribeUpdates', e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#8BCB2A]"
              />
              <span className="text-sm text-[#163247]">
                Send me updates about this application and NCG news
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/programs/${slug}`}
              className="inline-flex items-center justify-center gap-2 border-2 border-[#EDF2F5] text-[#163247] font-semibold py-3.5 px-6 rounded-lg hover:bg-[#F5F9FB]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-bold py-3.5 rounded-lg hover:bg-[#A8D94A] disabled:opacity-50"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
              ) : (
                <>Submit Application <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#163247] uppercase tracking-wider mb-2">
        {label} {required && <span className="text-[#E74C3C]">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-[#E74C3C] mt-1">⚠ {error}</p>}
    </div>
  );
}