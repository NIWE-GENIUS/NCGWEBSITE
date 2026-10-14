// src/components/home/Process.jsx
import { Link } from 'react-router-dom';
import { Search, Pencil, Wrench, TrendingUp, ArrowRight } from 'lucide-react';

const STEPS = [
  { Icon: Search, num: '01', title: 'Discover', desc: 'Understand the problem' },
  { Icon: Pencil, num: '02', title: 'Design', desc: 'Research and design the solution' },
  { Icon: Wrench, num: '03', title: 'Build', desc: 'Prototype, develop, and test' },
  { Icon: TrendingUp, num: '04', title: 'Scale', desc: 'Deploy and create lasting impact' },
];

export default function Process() {
  return (
    <section className="section bg-[#F5F9FB]">
      <div className="container-ncg">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
            Our Innovation Process
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A]">
            From Challenge to <span className="text-[#8BCB2A]">Impact</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[#8BCB2A]/30 to-transparent" />

          {STEPS.map(({ Icon, num, title, desc }, i) => (
            <div key={i} className="relative text-center">
              <div className="relative inline-block mb-5">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-white border border-[#EDF2F5] flex items-center justify-center shadow-sm relative z-10">
                  <Icon className="w-9 h-9 text-[#064B7A]" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#8BCB2A] text-white font-heading font-bold text-xs flex items-center justify-center z-20">
                  {num}
                </span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#031B2A] mb-2">{title}</h3>
              <p className="text-sm text-[#6D7E89]">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/innovation"
            className="inline-flex items-center gap-2 bg-[#064B7A] text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-[#062F4A] hover:translate-y-[-2px] transition-all"
          >
            Explore Our Innovation
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}