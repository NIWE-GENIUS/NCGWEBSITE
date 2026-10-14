// src/components/home/Insights.jsx
import { Link } from 'react-router-dom';
import { Sparkles, Wrench, BookOpen, ArrowRight } from 'lucide-react';

const ITEMS = [
  {
    Icon: Sparkles,
    tag: 'Innovation',
    title: 'Exploring Emerging Technologies',
    desc: 'How AI, IoT, and automation are creating new possibilities for solving local challenges.',
  },
  {
    Icon: Wrench,
    tag: 'Projects',
    title: 'Behind the Scenes: Smart Irrigation',
    desc: 'A look at how we developed an intelligent irrigation system for agricultural applications.',
  },
  {
    Icon: BookOpen,
    tag: 'Technology',
    title: 'Practical Insights from the NCG Team',
    desc: 'Lessons learned from building technology solutions for real-world problems.',
  },
];

export default function Insights() {
  return (
    <section className="section bg-[#F5F9FB]">
      <div className="container-ncg">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
            From the NCG Ecosystem
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A]">
            Insights & <span className="text-[#8BCB2A]">Updates</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ITEMS.map(({ Icon, tag, title, desc }, i) => (
            <Link
              key={i}
              to="/blog"
              className="group bg-white border border-[#EDF2F5] rounded-2xl p-7 hover:shadow-xl hover:shadow-[#064B7A]/5 hover:-translate-y-1.5 hover:border-[#8BCB2A]/40 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#8BCB2A]/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#8BCB2A]" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#8BCB2A]">
                  {tag}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-[#031B2A] mb-3 group-hover:text-[#064B7A] transition-colors">
                {title}
              </h3>
              <p className="text-sm text-[#6D7E89] leading-relaxed mb-5">{desc}</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#064B7A] group-hover:text-[#8BCB2A] transition-colors">
                Read More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}