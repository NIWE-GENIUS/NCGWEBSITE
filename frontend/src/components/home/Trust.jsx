// src/components/home/Trust.jsx
import { Building2, GraduationCap, Users, Rocket, FlaskConical, Globe2 } from 'lucide-react';

const LOGOS = [
  { Icon: Globe2, name: 'Rwanda ICT' },
  { Icon: Rocket, name: 'Innovation Hub' },
  { Icon: GraduationCap, name: 'University Partners' },
  { Icon: Users, name: 'Tech Community' },
  { Icon: Building2, name: 'Startup Network' },
  { Icon: FlaskConical, name: 'Research Labs' },
];

export default function Trust() {
  return (
    <section className="section bg-white">
      <div className="container-ncg">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
            Our Ecosystem
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A]">
            Trusted by People Who <span className="text-[#8BCB2A]">Believe in Innovation</span>
          </h2>
        </div>

        <p className="text-center text-[#6D7E89] max-w-2xl mx-auto mb-10">
          We collaborate with students, organizations, innovators, educators, entrepreneurs, and
          technology communities to turn ideas into impact.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {LOGOS.map(({ Icon, name }, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-5 rounded-xl border border-[#EDF2F5] hover:border-[#8BCB2A]/40 hover:-translate-y-1 transition-all duration-300">
              <Icon className="w-8 h-8 text-[#064B7A]" />
              <p className="text-xs font-medium text-[#6D7E89] text-center">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}