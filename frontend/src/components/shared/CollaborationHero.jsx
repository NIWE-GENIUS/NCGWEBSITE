// src/components/shared/CollaborationHero.jsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CollaborationHero({
  tag,
  titleStart,
  titleHighlight,
  titleEnd,
  subtitle,
  IconComponent,
  primaryCTA = { to: '/register', label: 'Get Started' },
  secondaryCTA = { to: '/contact', label: 'Contact Us' },
}) {
  const Icon = IconComponent;
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#031B2A] via-[#062F4A] to-[#064B7A] text-white">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#8BCB2A] blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-[#064B7A] blur-[120px]" />
      </div>

      <div className="relative container-ncg py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          {Icon && (
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#8BCB2A]/15 border border-[#8BCB2A]/30 flex items-center justify-center">
              <Icon className="w-10 h-10 text-[#8BCB2A]" />
            </div>
          )}

          {tag && (
            <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] mb-3">
              {tag}
            </span>
          )}

          <h1 className="text-4xl md:text-6xl font-heading font-bold leading-[1.1] mb-6 text-white">
            {titleStart}{' '}
            <span className="bg-gradient-to-r from-[#8BCB2A] to-[#A8D94A] bg-clip-text text-transparent">
              {titleHighlight}
            </span>{' '}
            {titleEnd}
          </h1>

          <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">{subtitle}</p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to={primaryCTA.to} className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#A8D94A] transition-all">
              {primaryCTA.label} <ArrowRight className="w-4 h-4" />
            </Link>
            {secondaryCTA && (
              <Link to={secondaryCTA.to} className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white hover:text-[#064B7A] transition-all">
                {secondaryCTA.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}