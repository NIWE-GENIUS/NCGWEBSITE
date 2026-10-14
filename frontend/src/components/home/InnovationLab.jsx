// src/components/home/InnovationLab.jsx
import { Link } from 'react-router-dom';
import { FlaskConical, Boxes, Cpu, BarChart3, Handshake, ArrowRight } from 'lucide-react';

const ITEMS = [
  { Icon: FlaskConical, title: 'Research & Development', desc: 'Exploring emerging technologies and new possibilities' },
  { Icon: Boxes, title: 'Prototyping', desc: 'Turning concepts into functional prototypes' },
  { Icon: Cpu, title: 'Emerging Technologies', desc: 'AI • IoT • Robotics • Automation • Embedded Systems' },
  { Icon: BarChart3, title: 'Data & Analytics', desc: 'Using data to understand problems and measure impact' },
  { Icon: Handshake, title: 'Collaboration', desc: 'Connecting innovators, developers, engineers, and communities' },
];

export default function InnovationLab() {
  return (
    <section className="section bg-white">
      <div className="container-ncg">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
            Innovation Lab
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A]">
            Where Ideas Become <span className="text-[#8BCB2A]">Reality</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-12">
          {ITEMS.map(({ Icon, title, desc }, i) => (
            <div key={i} className="group text-center p-6 rounded-xl border border-[#EDF2F5] hover:border-[#8BCB2A]/40 hover:bg-[#F5F9FB] hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#F5F9FB] group-hover:bg-[#8BCB2A] flex items-center justify-center transition-colors">
                <Icon className="w-7 h-7 text-[#064B7A] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-sm text-[#031B2A] mb-2">{title}</h3>
              <p className="text-xs text-[#6D7E89] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/innovation"
            className="inline-flex items-center gap-2 bg-[#064B7A] text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-[#062F4A] hover:translate-y-[-2px] transition-all"
          >
            Explore the Innovation Lab
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}