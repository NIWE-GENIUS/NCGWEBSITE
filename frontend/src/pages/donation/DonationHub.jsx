// src/pages/donation/DonationHub.jsx
import { Link } from 'react-router-dom';
import {
  Heart, Users, Building2, Award, GraduationCap, Rocket,
  HeartHandshake, ArrowRight, Globe2, Sparkles,
} from 'lucide-react';
import CTABox from '../../components/shared/CTABox';

const DONATION_TYPES = [
  { Icon: Heart, title: 'Individual Giving', desc: 'One-time or recurring gifts from individuals who support our mission.', slug: 'individual', color: '#E74C3C' },
  { Icon: Building2, title: 'Corporate Giving', desc: 'Corporate donations, sponsorships, and CSR partnerships.', slug: 'corporate', color: '#064B7A' },
  { Icon: GraduationCap, title: 'Scholarships', desc: 'Sponsor a student through a full program or specific track.', slug: 'scholarships', color: '#8BCB2A' },
  { Icon: Rocket, title: 'Program Funding', desc: 'Fund bootcamps, internships, courses, or coaching programs.', slug: 'programs', color: '#9B59B6' },
  { Icon: Award, title: 'Project Funding', desc: 'Fund specific technology projects that create real-world impact.', slug: 'projects', color: '#F39C12' },
  { Icon: Users, title: 'Monthly Giving', desc: 'Become a monthly donor and sustain our ongoing work.', slug: 'monthly', color: '#16A085' },
];

export default function DonationHub() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#031B2A] via-[#062F4A] to-[#064B7A] text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#8BCB2A] blur-[100px]" />
        </div>
        <div className="relative container-ncg py-20 md:py-28 text-center">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] mb-3">
            <HeartHandshake className="w-4 h-4" /> Support NCG
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold leading-[1.1] mb-6 text-white">
            Your Gift{' '}
            <span className="bg-gradient-to-r from-[#8BCB2A] to-[#A8D94A] bg-clip-text text-transparent">
              Changes Lives
            </span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
            Support technology education, innovation projects, and youth empowerment across Rwanda and Africa.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/donate/give" className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#A8D94A] transition-all">
              <Heart className="w-4 h-4" /> Donate Now
            </Link>
            <Link to="/donate/monthly" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white hover:text-[#064B7A] transition-all">
              Give Monthly
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">Ways to Give</span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A] mb-4">
              Choose How You Want to <span className="text-[#8BCB2A]">Support</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DONATION_TYPES.map(({ Icon, title, desc, slug, color }) => (
              <Link key={slug} to={`/donate/${slug}`} className="group relative bg-white border border-[#EDF2F5] rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1.5 transition-all overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1" style={{ background: color }} />
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <h3 className="font-heading font-semibold text-lg text-[#031B2A] mb-2 group-hover:text-[#064B7A]">{title}</h3>
                <p className="text-sm text-[#6D7E89] leading-relaxed mb-4">{desc}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#064B7A] group-hover:text-[#8BCB2A]">
                  Give Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Students Supported' },
              { value: '10+', label: 'Projects Funded' },
              { value: '25+', label: 'Schools Reached' },
              { value: '100%', label: 'Transparency' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-4xl md:text-5xl font-heading font-bold text-[#031B2A]">{s.value}</p>
                <p className="text-sm uppercase tracking-[0.15em] text-[#6D7E89] mt-2 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABox
        tag="Make a Difference"
        title="Support Innovation"
        highlight="Today"
        subtitle="Your contribution helps us build technology, empower young people, and solve real problems."
        primary={{ to: '/donate/give', label: 'Donate Now' }}
        secondary={{ to: '/contact', label: 'Talk to Us' }}
      />
    </>
  );
}