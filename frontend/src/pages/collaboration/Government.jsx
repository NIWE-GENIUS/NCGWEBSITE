// src/pages/collaboration/Government.jsx
import { FlaskConical, Building2, Cpu, GraduationCap, BarChart3, Globe2 } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const AREAS = [
  { Icon: Building2, title: 'Digital Government', desc: 'Support public-sector digital transformation and e-government services.' },
  { Icon: Cpu, title: 'Public Infrastructure', desc: 'Collaborate on national technology infrastructure and smart systems.' },
  { Icon: GraduationCap, title: 'ICT Education Policy', desc: 'Contribute to national ICT education strategy and curriculum development.' },
  { Icon: FlaskConical, title: 'Innovation Programs', desc: 'Partner on national innovation challenges and research programs.' },
  { Icon: BarChart3, title: 'Data & Analytics', desc: 'Build data platforms that support public decision-making.' },
  { Icon: Globe2, title: 'Regional Development', desc: 'Extend technology impact across the East African region.' },
];

export default function Government() {
  return (
    <>
      <CollaborationHero
        tag="Government Collaboration"
        titleStart="Partner on"
        titleHighlight="Public Innovation"
        titleEnd=""
        subtitle="Collaborate on national digital initiatives, public-sector technology, and policy."
        IconComponent={FlaskConical}
        primaryCTA={{ to: '/register', label: 'Partner With Us' }}
        secondaryCTA={{ to: '/contact', label: 'Contact Us' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Government <span className="text-[#8BCB2A]">Partnership Areas</span>
            </h2>
            <p className="text-[#6D7E89] text-lg">
              We collaborate with government institutions on national digital initiatives.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AREAS.map(({ Icon, title, desc }, i) => (
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
        tag="Public Partnership"
        title="Collaborate on"
        highlight="National Innovation"
        subtitle="Let's explore how we can work together on technology for public good."
        primary={{ to: '/register', label: 'Partner With Us' }}
        secondary={{ to: '/contact', label: 'Contact Us' }}
      />
    </>
  );
}