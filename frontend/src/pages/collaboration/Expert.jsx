// src/pages/collaboration/Expert.jsx
import { Users, GraduationCap, FlaskConical, Code2, Megaphone, Handshake } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const AREAS = [
  { Icon: Users, title: 'Mentorship', desc: 'Guide young professionals and students in their technology and career development.' },
  { Icon: GraduationCap, title: 'Training & Facilitation', desc: 'Deliver workshops, training sessions, and capacity-building programs.' },
  { Icon: FlaskConical, title: 'Research & Development', desc: 'Contribute to research projects and innovation initiatives.' },
  { Icon: Code2, title: 'Technical Expertise', desc: 'Share technical knowledge in software, engineering, IoT, AI, or other areas.' },
  { Icon: Megaphone, title: 'Industry Insights', desc: 'Share industry perspectives and bridge the gap between education and employment.' },
  { Icon: Handshake, title: 'Professional Development', desc: 'Support young professionals in building successful careers in technology.' },
];

export default function Expert() {
  return (
    <>
      <CollaborationHero
        tag="Knowledge & Expertise"
        titleStart="Share Your"
        titleHighlight="Skills"
        titleEnd=""
        subtitle="Contribute as a mentor, trainer, researcher, technical expert, or industry professional."
        IconComponent={Users}
        primaryCTA={{ to: '/register', label: 'Contribute Your Expertise' }}
        secondaryCTA={{ to: '/contact', label: 'Contact Us' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">Overview</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-6">
                Knowledge & <span className="text-[#8BCB2A]">Expertise</span>
              </h2>
              <p className="text-[#6D7E89] leading-relaxed mb-4">
                NCG is built on the power of shared knowledge. We invite industry professionals,
                researchers, educators, and technical experts to contribute their expertise to our
                ecosystem.
              </p>
              <p className="text-[#6D7E89] leading-relaxed">
                Whether you want to mentor young talent, deliver training, conduct research, or share
                industry insights, your expertise can help shape the next generation of innovators.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['Mentor emerging talent', 'Share industry insights', 'Contribute to research', 'Build your network'].map((t, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#F5F9FB] border border-[#EDF2F5]">
                  <p className="text-sm text-[#163247] font-medium">{t}</p>
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
              Expertise <span className="text-[#8BCB2A]">Areas</span>
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
        tag="Share Your Expertise"
        title="Contribute Your Skills"
        highlight="With NCG"
        subtitle="Let's explore how your knowledge can help build Rwanda's technology ecosystem."
        primary={{ to: '/register', label: 'Contribute Your Expertise' }}
        secondary={{ to: '/contact', label: 'Contact Us' }}
      />
    </>
  );
}