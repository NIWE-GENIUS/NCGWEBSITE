// src/pages/collaboration/Technology.jsx
import { Cpu, Code2, Cloud, Shield, Wifi, Bot } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const AREAS = [
  { Icon: Code2, title: 'Software Development', desc: 'Collaborate on web, mobile, enterprise, and custom software projects.' },
  { Icon: Bot, title: 'AI & Machine Learning', desc: 'Build AI-powered solutions that solve real problems.' },
  { Icon: Wifi, title: 'IoT & Smart Systems', desc: 'Develop connected devices and smart automation systems.' },
  { Icon: Cloud, title: 'Cloud & Infrastructure', desc: 'Cloud architecture, DevOps, and infrastructure projects.' },
  { Icon: Shield, title: 'Cybersecurity', desc: 'Security assessment, implementation, and consulting.' },
  { Icon: Cpu, title: 'Engineering & Hardware', desc: 'Embedded systems, electronics, and hardware engineering.' },
];

export default function Technology() {
  return (
    <>
      <CollaborationHero
        tag="Technology Collaboration"
        titleStart="Build"
        titleHighlight="Technology"
        titleEnd="Together"
        subtitle="Collaborate on software, IoT, AI, cloud, and engineering projects that solve real problems."
        IconComponent={Cpu}
        primaryCTA={{ to: '/register', label: 'Start Collaboration' }}
        secondaryCTA={{ to: '/contact', label: 'Contact Us' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Technology <span className="text-[#8BCB2A]">Partnership Areas</span>
            </h2>
            <p className="text-[#6D7E89] text-lg">
              Whether you're a startup, enterprise, or research institution, we can collaborate on technology.
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
        tag="Partner With Us"
        title="Build Technology"
        highlight="With NCG"
        subtitle="Let's collaborate on technology projects that create real impact."
        primary={{ to: '/register', label: 'Start Collaboration' }}
        secondary={{ to: '/contact', label: 'Contact Us' }}
      />
    </>
  );
}