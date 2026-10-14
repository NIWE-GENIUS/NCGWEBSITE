// src/components/home/FinalCTA.jsx
import { Link } from 'react-router-dom';
import { Send, Handshake } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="section bg-gradient-to-br from-[#031B2A] via-[#062F4A] to-[#064B7A] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-[#8BCB2A] blur-[120px]" />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 rounded-full bg-[#064B7A] blur-[120px]" />
      </div>

      <div className="relative container-ncg">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] mb-4">
            Let's Create
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 text-balance">
            Have a Problem <span className="text-[#8BCB2A]">Worth Solving?</span>
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
            Tell us about your challenge, idea, project, or opportunity. Whether you're an
            organization, entrepreneur, student, developer, engineer, or innovator — let's explore
            what technology can make possible.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#A8D94A] hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-[#8BCB2A]/30 transition-all"
            >
              <Send className="w-4 h-4" />
              Start a Project
            </Link>
            <Link
              to="/partnership"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white hover:text-[#064B7A] transition-all"
            >
              <Handshake className="w-4 h-4" />
              Partner With NCG
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}