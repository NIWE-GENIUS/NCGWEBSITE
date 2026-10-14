// src/pages/Contact.jsx
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import ContactFormInline from '../components/forms/ContactFormInline';

const PURPOSES = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Support' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'donation', label: 'Donation' },
  { value: 'careers', label: 'Careers' },
  { value: 'media', label: 'Media' },
  { value: 'training', label: 'Training & Programs' },
  { value: 'investment', label: 'Investment' },
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'services', label: 'Technology Services' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'feedback', label: 'Feedback' },
];

export default function Contact() {
  const [params] = useSearchParams();
  const purpose = params.get('purpose') || 'general';
  const purposeLabel = PURPOSES.find((p) => p.value === purpose)?.label || 'General Inquiry';

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#031B2A] via-[#062F4A] to-[#064B7A] text-white">
        <div className="relative container-ncg py-16 md:py-20 text-center">
          <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] mb-3">
            Contact NCG
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold leading-[1.1] mb-4 text-white">
            Let's <span className="text-[#8BCB2A]">Connect</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Send us a message. Every inquiry reaches our team directly.
          </p>
        </div>
      </section>

      {/* CONTACT GRID */}
      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Info cards */}
            <div className="space-y-4">
              <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
                <div className="w-11 h-11 rounded-lg bg-[#8BCB2A]/10 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-[#8BCB2A]" />
                </div>
                <h3 className="font-heading font-bold text-base text-[#031B2A] mb-1">Email</h3>
                <a href="mailto:info@nextcreaturesgroup.com" className="text-sm text-[#064B7A] hover:underline">
                  info@nextcreaturesgroup.com
                </a>
              </div>

              <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
                <div className="w-11 h-11 rounded-lg bg-[#8BCB2A]/10 flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5 text-[#8BCB2A]" />
                </div>
                <h3 className="font-heading font-bold text-base text-[#031B2A] mb-1">Phone</h3>
                <a href="tel:+250788123456" className="text-sm text-[#064B7A] hover:underline">
                  +250 788 123 456
                </a>
              </div>

              <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
                <div className="w-11 h-11 rounded-lg bg-[#8BCB2A]/10 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5 text-[#8BCB2A]" />
                </div>
                <h3 className="font-heading font-bold text-base text-[#031B2A] mb-1">Location</h3>
                <p className="text-sm text-[#6D7E89]">Kigali, Rwanda</p>
              </div>

              <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
                <div className="w-11 h-11 rounded-lg bg-[#8BCB2A]/10 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-[#8BCB2A]" />
                </div>
                <h3 className="font-heading font-bold text-base text-[#031B2A] mb-1">Working Hours</h3>
                <p className="text-sm text-[#6D7E89]">Mon-Fri · 8:00 AM - 5:00 PM</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6 mb-4">
                <p className="text-xs uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Sending about
                </p>
                <p className="font-heading font-bold text-lg text-[#031B2A]">
                  {purposeLabel}
                </p>
              </div>
              <ContactFormInline purpose={purpose} context={purposeLabel} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}