// src/pages/collaboration/PartnershipProgram.jsx
import { Handshake, Award, Users, TrendingUp, Star, Target } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const BENEFITS = [
  { Icon: Star, title: 'Recognition', desc: 'Be recognized as an NCG partner across our communications.' },
  { Icon: Users, title: 'Network Access', desc: 'Connect with our ecosystem of partners, experts, and innovators.' },
  { Icon: TrendingUp, title: 'Growth Opportunities', desc: 'Joint initiatives and opportunities to grow together.' },
  { Icon: Award, title: 'Priority Support', desc: 'Dedicated partnership manager and priority support.' },
  { Icon: Target, title: 'Strategic Alignment', desc: 'Co-create initiatives aligned with your organization\'s goals.' },
  { Icon: Handshake, title: 'Long-Term Relationship', desc: 'Build a lasting partnership with a growing innovation ecosystem.' },
];

export default function PartnershipProgram() {
  return (
    <>
      <CollaborationHero
        tag="NCG Partnership Program"
        titleStart="Join the"
        titleHighlight="NCG Partnership Program"
        titleEnd=""
        subtitle="Formalize your collaboration with NCG through our structured partnership program."
        IconComponent={Handshake}
        primaryCTA={{ to: '/register', label: 'Apply Now' }}
        secondaryCTA={{ to: '/contact', label: 'Talk to Us' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Partnership <span className="text-[#8BCB2A]">Benefits</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ Icon, title, desc }, i) => (
              <div key={i} className="bg-white border border-[#EDF2F5] rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#8BCB2A]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#8BCB2A]" />
                </div>
                <h3 className="font-heading font-semibold text-base text-[#031B2A] mb-2">{title}</h3>
                <p className="text-sm text-[#6D7E89] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABox
        tag="Join Our Program"
        title="Apply for the"
        highlight="NCG Partnership Program"
        subtitle="Take your partnership with NCG to the next level."
        primary={{ to: '/register', label: 'Apply Now' }}
        secondary={{ to: '/contact', label: 'Talk to Us' }}
      />
    </>
  );
}