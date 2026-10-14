// src/components/shared/FeatureCTA.jsx
import { Link } from 'react-router-dom';
import { ArrowRight, Send, Heart } from 'lucide-react';

export default function FeatureCTA({ feature }) {
  if (!feature?.cta) return null;
  const { primary, secondary, donation } = feature.cta;

  return (
    <section className="section bg-gradient-to-br from-[#031B2A] via-[#062F4A] to-[#064B7A] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-[#8BCB2A] blur-[120px]" />
      </div>

      <div className="relative container-ncg text-center">
        <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] mb-4">
          Ready to Get Started?
        </span>
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 max-w-3xl mx-auto">
          Let's build something meaningful together.
        </h2>
        <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
          Whether you want to partner, collaborate, fund a project, or simply learn more —
          NCG is ready to explore what's possible with you.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {primary && (
            <Link
              to={primary.to}
              className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#A8D94A] transition-all"
            >
              <ArrowRight className="w-4 h-4" /> {primary.label}
            </Link>
          )}
          {secondary && (
            <Link
              to={secondary.to}
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white/10 transition-all"
            >
              <Send className="w-4 h-4" /> {secondary.label}
            </Link>
          )}
          {donation && (
            <Link
              to={donation.to}
              className="inline-flex items-center gap-2 border-2 border-[#8BCB2A] text-[#8BCB2A] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#8BCB2A] hover:text-[#031B2A] transition-all"
            >
              <Heart className="w-4 h-4" /> {donation.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}