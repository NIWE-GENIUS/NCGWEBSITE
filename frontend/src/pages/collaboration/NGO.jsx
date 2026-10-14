// src/pages/collaboration/NGO.jsx
import { Globe2, Laptop, Users, Wifi, Lightbulb, Heart, Rocket } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const AREAS = [
  { Icon: Laptop, title: 'Digital Skills Training', desc: 'Deliver ICT training programs that equip young people with employable digital skills.' },
  { Icon: Users, title: 'Youth Empowerment', desc: 'Create opportunities for young people to develop skills, build confidence, and pursue careers.' },
  { Icon: Wifi, title: 'Digital Inclusion', desc: 'Bridge the digital divide and ensure access to technology for all.' },
  { Icon: Lightbulb, title: 'Innovation for Development', desc: 'Develop technology solutions that address social challenges and community needs.' },
  { Icon: Heart, title: 'Community Programs', desc: 'Implement community-based initiatives that create lasting social and economic impact.' },
  { Icon: Rocket, title: 'Entrepreneurship Support', desc: 'Support young entrepreneurs in building sustainable businesses that create jobs.' },
];

export default function NGO() {
  return (
    <>
      <CollaborationHero
        tag="NGO & Development"
        titleStart="Collaborate for"
        titleHighlight="Social Impact"
        titleEnd=""
        subtitle="Partner with NCG on ICT education, digital inclusion, youth empowerment, and technology-for-impact initiatives."
        IconComponent={Globe2}
        primaryCTA={{ to: '/register', label: 'Partner With Us' }}
        secondaryCTA={{ to: '/contact', label: 'Contact Us' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">Overview</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-6">
                NGO & Development <span className="text-[#8BCB2A]">Partnerships</span>
              </h2>
              <p className="text-[#6D7E89] leading-relaxed mb-4">
                NCG is committed to using technology as a tool for social impact. We partner with NGOs,
                development organizations, and community groups to deliver programs that empower
                people, create opportunities, and drive sustainable development.
              </p>
              <p className="text-[#6D7E89] leading-relaxed">
                Together, we can leverage technology to address social challenges, build digital skills,
                and create pathways to employment and entrepreneurship.
              </p>
            </div>
            <div className="space-y-3">
              {['Technology for social impact', 'Youth empowerment', 'Digital inclusion', 'Sustainable development'].map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F9FB]">
                  <div className="w-6 h-6 rounded-full bg-[#8BCB2A]/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#8BCB2A]" />
                  </div>
                  <span className="text-sm text-[#163247]">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A]">
              Impact <span className="text-[#8BCB2A]">Areas</span>
            </h2>
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
        tag="Start Collaborating"
        title="Partner With NCG for"
        highlight="Social Impact"
        subtitle="Let's work together to use technology as a force for good in communities across Rwanda."
        primary={{ to: '/register', label: 'Partner With Us' }}
        secondary={{ to: '/contact', label: 'Contact Us' }}
      />
    </>
  );
}