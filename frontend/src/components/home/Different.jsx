// src/components/home/Different.jsx
import { Search, Wrench, Combine, UserCheck } from 'lucide-react';

const ITEMS = [
  {
    Icon: Search,
    title: 'Problem-First',
    desc: 'We don\'t ask "What technology can we sell?" We ask "What problem are we trying to solve?"',
  },
  {
    Icon: Wrench,
    title: 'Build, Not Just Advise',
    desc: 'Ideas are transformed into prototypes, software, smart systems, and practical solutions.',
  },
  {
    Icon: Combine,
    title: 'Combine Disciplines',
    desc: 'Software, engineering, IoT, research, creativity, entrepreneurship, and education work together.',
  },
  {
    Icon: UserCheck,
    title: 'Develop People & Technology',
    desc: 'Our programs give young people opportunities to learn, build, experiment, and gain practical experience.',
  },
];

export default function Different() {
  return (
    <section className="section bg-white">
      <div className="container-ncg">
        <div className="text-center max-w-3xl mx-auto mb-14 reveal">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
            What Makes Us Different
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A] mb-4">
            More Than an <span className="text-[#8BCB2A]">ICT Company</span>
          </h2>
          <p className="text-[#6D7E89] text-lg">
            We start with problems, not technology. We build, not just advise. We combine disciplines
            and develop people alongside technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEMS.map(({ Icon, title, desc }, i) => (
            <div
              key={i}
              className="group bg-white border border-[#EDF2F5] rounded-xl p-7 hover:shadow-xl hover:shadow-[#064B7A]/5 hover:-translate-y-1 hover:border-[#8BCB2A]/40 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-[#F5F9FB] group-hover:bg-[#8BCB2A]/10 flex items-center justify-center mb-5 transition-colors">
                <Icon className="w-7 h-7 text-[#064B7A] group-hover:text-[#8BCB2A] transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-[#031B2A] mb-3">
                {title}
              </h3>
              <p className="text-sm text-[#6D7E89] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}