// src/components/shared/CTABox.jsx
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';

export default function CTABox({
  tag = "Ready to Start?",
  title = "Begin Your Journey",
  highlight = "Today",
  subtitle = "Let's build something meaningful together.",
  primary = { to: '/register', label: 'Get Started' },
  secondary = { to: '/contact', label: 'Contact Us' },
}) {
  return (
    <section className="section bg-gradient-to-br from-[#031B2A] via-[#062F4A] to-[#064B7A] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-[#8BCB2A] blur-[120px]" />
      </div>
      <div className="relative container-ncg text-center">
        <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] mb-4">
          {tag}
        </span>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
          {title} <span className="text-[#8BCB2A]">{highlight}</span>
        </h2>
        <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">{subtitle}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to={primary.to} className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#A8D94A] transition-all">
            <Send className="w-4 h-4" /> {primary.label}
          </Link>
          {secondary && (
            <Link to={secondary.to} className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white hover:text-[#064B7A] transition-all">
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}