// src/pages/collaboration/Investment.jsx
import { HeartHandshake, Rocket, GraduationCap, FlaskConical, Cpu, Users, Globe2 } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const AREAS = [
  { Icon: Rocket, title: 'Startup Investment', desc: 'Invest in promising technology startups and innovative business ventures.' },
  { Icon: GraduationCap, title: 'Education Programs', desc: 'Sponsor bootcamps, training programs, and skill development initiatives.' },
  { Icon: FlaskConical, title: 'Research & Innovation', desc: 'Support research projects that address real challenges.' },
  { Icon: Cpu, title: 'Technology Projects', desc: 'Invest in technology development projects that create practical solutions.' },
  { Icon: Users, title: 'Community Initiatives', desc: 'Support community programs that create social and economic impact.' },
  { Icon: Globe2, title: 'Ecosystem Development', desc: 'Invest in the growth of Rwanda\'s technology and innovation ecosystem.' },
];

export default function Investment() {
  return (
    <>
      <CollaborationHero
        tag="Investment & Sponsorship"
        titleStart="Support"
        titleHighlight="Innovation"
        titleEnd=""
        subtitle="Invest in promising projects, programs, startups, and technology initiatives that are shaping Rwanda's digital future."
        IconComponent={HeartHandshake}
        primaryCTA={{ to: '/register', label: 'Invest With Us' }}
        secondaryCTA={{ to: '/contact', label: 'Contact Us' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">Overview</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-6">
                Investment & <span className="text-[#8BCB2A]">Sponsorship</span>
              </h2>
              <p className="text-[#6D7E89] leading-relaxed mb-4">
                NCG offers investors and sponsors the opportunity to support innovative technology
                projects, programs, and startups that are creating real impact in Rwanda and beyond.
              </p>
              <p className="text-[#6D7E89] leading-relaxed">
                Whether you're an individual investor, a corporate sponsor, or a development partner,
                your support can help accelerate technology innovation and create opportunities for
                young people.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#064B7A] to-[#031B2A] text-white">
              <p className="text-sm uppercase tracking-wider text-[#8BCB2A] font-bold mb-2">Why NCG</p>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✓ Support impactful, real-world projects</li>
                <li>✓ Direct access to promising startups</li>
                <li>✓ Visible social and economic return</li>
                <li>✓ Partnership with a growing ecosystem</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A]">
              Investment <span className="text-[#8BCB2A]">Opportunities</span>
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
        tag="Start Investing"
        title="Support Innovation"
        highlight="With NCG"
        subtitle="Let's explore how you can invest in technology initiatives that create lasting impact."
        primary={{ to: '/register', label: 'Invest With Us' }}
        secondary={{ to: '/contact', label: 'Contact Us' }}
      />
    </>
  );
}