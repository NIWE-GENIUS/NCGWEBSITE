// src/pages/innovation/Innovation.jsx
import { Lightbulb, Search, Code2, TrendingUp, FlaskConical, Boxes, BarChart3, Handshake } from 'lucide-react';
import CTABox from '../../components/shared/CTABox';

const PHILOSOPHY = [
  { Icon: Lightbulb, title: 'Problem-First', desc: 'We start with real user pain points, not technology looking for a problem.' },
  { Icon: FlaskConical, title: 'Evidence-Driven', desc: 'Every idea is tested, validated, and improved using real data.' },
  { Icon: Handshake, title: 'Human-Centered', desc: 'We design with people, not just for them.' },
  { Icon: TrendingUp, title: 'Impact-Focused', desc: 'We measure what matters: outcomes, adoption, and real-world value.' },
];

const PROCESS = [
  { num: '01', Icon: Lightbulb, title: 'Idea Generation', desc: 'Identify problems, conduct research, turn insights into hypotheses.' },
  { num: '02', Icon: Search, title: 'Research & Design', desc: 'Deep research, feasibility, and solution blueprints.' },
  { num: '03', Icon: Code2, title: 'Build & Test', desc: 'Build MVPs, run usability testing, iterate quickly.' },
  { num: '04', Icon: TrendingUp, title: 'Impact & Scale', desc: 'Deploy, measure impact, and scale for real value.' },
];

const LAB = [
  { Icon: FlaskConical, title: 'R&D', desc: 'Emerging tech, horizon scanning, viability concepts.' },
  { Icon: Boxes, title: 'Prototyping', desc: 'Rapid MVPs with clear validation purpose.' },
  { Icon: BarChart3, title: 'Data & Analytics', desc: 'Metrics, dashboards, and impact evaluation.' },
  { Icon: Handshake, title: 'Collaboration', desc: 'Co-creation with partners and communities.' },
];

export default function Innovation() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#031B2A] via-[#062F4A] to-[#064B7A] text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#8BCB2A] blur-[100px]" />
        </div>
        <div className="relative container-ncg py-20 md:py-28 text-center">
          <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] mb-3">
            Innovation Lab
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold leading-[1.1] mb-6 text-white">
            Turn Your Dreams Into{' '}
            <span className="bg-gradient-to-r from-[#8BCB2A] to-[#A8D94A] bg-clip-text text-transparent">
              Innovative Projects
            </span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            We transform bold ideas into real-world solutions that solve problems, create value, and shape the future.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A] mb-4">
              Innovation That <span className="text-[#8BCB2A]">Creates Impact</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PHILOSOPHY.map(({ Icon, title, desc }, i) => (
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

      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A] mb-4">
              From <span className="text-[#8BCB2A]">Idea</span> to <span className="text-[#8BCB2A]">Impact</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map(({ num, Icon, title, desc }) => (
              <div key={num} className="bg-white border border-[#EDF2F5] rounded-2xl p-7 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#064B7A] text-white flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-heading font-bold text-3xl text-[#8BCB2A]/20">{num}</span>
                </div>
                <h3 className="font-heading font-semibold text-lg text-[#031B2A] mb-2">{title}</h3>
                <p className="text-sm text-[#6D7E89] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A] mb-4">
              The <span className="text-[#8BCB2A]">Innovation Lab</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LAB.map(({ Icon, title, desc }, i) => (
              <div key={i} className="bg-[#F5F9FB] border border-[#EDF2F5] rounded-xl p-6 hover:border-[#8BCB2A]/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#8BCB2A]/15 flex items-center justify-center mb-4">
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
        tag="Ready to Innovate"
        title="Turn Your Dream Into an"
        highlight="Innovative Project"
        subtitle="Let's work together to solve real problems and create meaningful impact."
        primary={{ to: '/register', label: 'Start Your Innovation' }}
        secondary={{ to: '/contact', label: 'Contact Us' }}
      />
    </>
  );
}