// src/pages/services/Services.jsx
import { Link } from 'react-router-dom';
import {
  Code2,
  Bot,
  Server,
  Shield,
  Cpu,
  Zap,
  Sprout,
  BarChart3,
  GraduationCap,
  ArrowRight,
  Brain,
} from 'lucide-react';
import CTABox from '../../components/shared/CTABox';

const CATEGORIES = [
  {
    slug: 'software',
    Icon: Code2,
    title: 'Software & Digital Solutions',
    desc: 'Web, mobile, custom software, SaaS, and industry systems.',
    color: '#064B7A',
  },
  {
    slug: 'ai-data',
    Icon: Brain,
    title: 'AI & Data Solutions',
    desc: 'AI, machine learning, analytics, and intelligent automation.',
    color: '#8BCB2A',
  },
  {
    slug: 'automation',
    Icon: Bot,
    title: 'Business Automation',
    desc: 'Workflows, RPA, digital transformation, and process optimization.',
    color: '#3498DB',
  },
  {
    slug: 'infrastructure',
    Icon: Server,
    title: 'ICT Infrastructure & Cloud',
    desc: 'Networking, cloud, servers, and managed IT services.',
    color: '#F39C12',
  },
  {
    slug: 'cybersecurity',
    Icon: Shield,
    title: 'Cybersecurity',
    desc: 'Audits, penetration testing, monitoring, and compliance.',
    color: '#E74C3C',
  },
  {
    slug: 'smart-systems',
    Icon: Cpu,
    title: 'IoT & Smart Systems',
    desc: 'Smart homes, buildings, sensors, and industrial IoT.',
    color: '#9B59B6',
  },
  {
    slug: 'electrical',
    Icon: Zap,
    title: 'Electrical & Engineering',
    desc: 'Electrical systems, electronics, embedded, and energy.',
    color: '#E67E22',
  },
  {
    slug: 'agritech',
    Icon: Sprout,
    title: 'AgriTech & Smart Agriculture',
    desc: 'Smart irrigation, IoT agriculture, farm analytics.',
    color: '#27AE60',
  },
  {
    slug: 'consulting',
    Icon: BarChart3,
    title: 'Technology Consulting',
    desc: 'IT strategy, digital transformation, and advisory.',
    color: '#16A085',
  },
  {
    slug: 'training',
    Icon: GraduationCap,
    title: 'ICT Training & Capacity Building',
    desc: 'Bootcamps, courses, corporate training, and mentorship.',
    color: '#E91E63',
  },
];

export default function Services() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#031B2A] via-[#062F4A] to-[#064B7A] text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#8BCB2A] blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-[#064B7A] blur-[120px]" />
        </div>

        <div className="relative container-ncg py-20 md:py-28 text-center">
          <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] mb-3">
            Our Services
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold leading-[1.1] mb-6 text-white">
            Technology, Automation &{' '}
            <span className="bg-gradient-to-r from-[#8BCB2A] to-[#A8D94A] bg-clip-text text-transparent">
              Innovation Solutions
            </span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Comprehensive technology services across software, AI, infrastructure, security,
            engineering and training.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
              What We Deliver
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A] mb-4">
              Comprehensive <span className="text-[#8BCB2A]">Technology Services</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => {
              const Icon = cat.Icon;
              return (
                <Link
                  key={cat.slug}
                  to={`/features/${cat.slug}`}
                  className="group relative bg-white border border-[#EDF2F5] rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1.5 transition-all overflow-hidden"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: cat.color }}
                  />
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{
                      background: cat.color + '15',
                      border: '1px solid ' + cat.color + '30',
                    }}
                  >
                    <Icon className="w-7 h-7" style={{ color: cat.color }} />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-[#031B2A] mb-2 group-hover:text-[#064B7A]">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-[#6D7E89] leading-relaxed mb-4">{cat.desc}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#064B7A] group-hover:text-[#8BCB2A]">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CTABox
        tag="Ready to Transform"
        title="Let's Build"
        highlight="Your Solution"
        subtitle="Discuss your needs and find the right technology solution for your organization."
        primary={{ to: '/contact?purpose=services', label: 'Contact Us' }}
        secondary={{ to: '/register', label: 'Get Started' }}
      />
    </>
  );
}