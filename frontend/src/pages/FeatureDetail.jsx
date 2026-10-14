// src/pages/FeatureDetail.jsx
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Target, Lightbulb,
  Handshake, Building2, Globe2, School, HeartHandshake, Users,
  GraduationCap, Cpu, Network, FlaskConical, Code2, Brain, Bot,
  Server, Shield, Zap, Sprout, BarChart3, Mail, Phone,
} from 'lucide-react';
import { getFeatureBySlug } from '../data/featureData';
import FeatureCTA from '../components/shared/FeatureCTA';
import ContactFormInline from '../components/forms/ContactFormInline';
import NotFound from './NotFound';

const ICONS = {
  Handshake, Building2, Globe2, School, HeartHandshake, Users,
  GraduationCap, Cpu, Network, FlaskConical, Code2, Brain, Bot,
  Server, Shield, Zap, Sprout, BarChart3, Lightbulb, Target,
};

export default function FeatureDetail() {
  const { slug } = useParams();
  const feature = getFeatureBySlug(slug);

  if (!feature) return <NotFound />;

  const Icon = ICONS[feature.icon] || Lightbulb;
  const purposeMap = {
    Collaboration: 'collaboration',
    Service: 'services',
    Program: 'training',
    Donation: 'donation',
  };
  const contactPurpose = purposeMap[feature.category] || 'general';

  return (
    <>
      {/* HERO */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background: `linear-gradient(135deg, #031B2A 0%, #062F4A 50%, ${feature.color} 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-[#8BCB2A] blur-[120px]" />
        </div>

        <div className="relative container-ncg py-20 md:py-28">
          <Link
            to={
              feature.category === 'Collaboration'
                ? '/collaboration'
                : feature.category === 'Service'
                ? '/services'
                : '/'
            }
            className="inline-flex items-center gap-2 text-white/70 hover:text-[#8BCB2A] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {feature.category}
          </Link>

          <div className="max-w-4xl">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Icon className="w-10 h-10 text-[#8BCB2A]" />
            </div>

            <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] mb-3">
              {feature.category}
            </span>

            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-[1.1] mb-6 text-white">
              {feature.title}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mb-8">{feature.tagline}</p>

            <div className="flex flex-wrap gap-3">
              {feature.cta?.primary && (
                <Link
                  to={feature.cta.primary.to}
                  className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#A8D94A]"
                >
                  {feature.cta.primary.label} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {feature.cta?.secondary && (
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white/10"
                >
                  {feature.cta.secondary.label}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="section bg-white">
        <div className="container-ncg max-w-4xl">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
            Overview
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-6">
            What it is
          </h2>
          <p className="text-lg text-[#163247] leading-relaxed">{feature.overview}</p>
        </div>
      </section>

      {/* ALIGNMENT */}
      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
              How It Aligns with NCG & Africa
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Aligned with Rwanda's & Africa's <span className="text-[#8BCB2A]">Future</span>
            </h2>
            <p className="text-[#6D7E89] text-lg">
              Every NCG feature connects to national strategies, continental goals,
              and real needs of African technology enthusiasts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feature.alignment.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-[#EDF2F5] rounded-2xl p-7 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#8BCB2A]/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#8BCB2A]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-[#031B2A] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#6D7E89] leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section bg-white">
        <div className="container-ncg">
          <div className="max-w-3xl mb-10">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
              What You Get
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A]">
              Benefits & Deliverables
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feature.benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-5 rounded-xl bg-[#F5F9FB] border border-[#EDF2F5]"
              >
                <CheckCircle2 className="w-5 h-5 text-[#8BCB2A] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[#163247]">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
              Process
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A]">
              How It <span className="text-[#8BCB2A]">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {feature.howItWorks.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white border border-[#EDF2F5] rounded-2xl p-7 h-full">
                  <span className="font-heading font-bold text-4xl text-[#8BCB2A]/20 block mb-4">
                    {step.step}
                  </span>
                  <h3 className="font-heading font-semibold text-lg text-[#031B2A] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#6D7E89] leading-relaxed">{step.text}</p>
                </div>
                {i < feature.howItWorks.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-[#8BCB2A]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="section bg-white" id="contact">
        <div className="container-ncg max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
              Get in Touch
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Talk to Our <span className="text-[#8BCB2A]">Team</span>
            </h2>
            <p className="text-[#6D7E89]">
              Send a message about {feature.title.toLowerCase()} — we'll route it to the right team.
            </p>
          </div>

          <ContactFormInline purpose={contactPurpose} context={feature.title} />

          {/* Direct contact info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="mailto:info@nextcreaturesgroup.com"
              className="flex items-center gap-3 p-5 rounded-xl border border-[#EDF2F5] hover:border-[#8BCB2A] transition-colors"
            >
              <div className="w-11 h-11 rounded-lg bg-[#8BCB2A]/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#8BCB2A]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#6D7E89] font-bold">
                  Email us
                </p>
                <p className="font-semibold text-[#031B2A]">
                  info@nextcreaturesgroup.com
                </p>
              </div>
            </a>
            <a
              href="tel:+250788123456"
              className="flex items-center gap-3 p-5 rounded-xl border border-[#EDF2F5] hover:border-[#8BCB2A] transition-colors"
            >
              <div className="w-11 h-11 rounded-lg bg-[#8BCB2A]/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#8BCB2A]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#6D7E89] font-bold">
                  Call us
                </p>
                <p className="font-semibold text-[#031B2A]">+250 788 123 456</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA BOX */}
      <FeatureCTA feature={feature} />
    </>
  );
}