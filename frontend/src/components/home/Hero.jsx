// src/components/home/Hero.jsx
import { Link } from 'react-router-dom';
import {
  Code2, Bot, Cpu, Cloud, Brain, ShieldCheck,
  Network, Database, Lightbulb, Check, ArrowRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const ORBIT_ONE = [
  { Icon: Code2, delay: 0 },
  { Icon: Bot, delay: 1.5 },
  { Icon: Cpu, delay: 3 },
  { Icon: Cloud, delay: 4.5 },
];

const ORBIT_TWO = [
  { Icon: Brain, delay: 0 },
  { Icon: ShieldCheck, delay: 1.5 },
  { Icon: Network, delay: 3 },
  { Icon: Database, delay: 4.5 },
];

const TYPE_TEXTS = [
  'digital future.',
  'real-world impact.',
  'Africa\'s innovation.',
  'practical solutions.',
];

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTextIndex((i) => (i + 1) % TYPE_TEXTS.length);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#031B2A] via-[#062F4A] to-[#064B7A] text-white">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#8BCB2A] blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-[#064B7A] blur-[120px]" />
      </div>

      <div className="relative container-ncg py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT: Content */}
          <div className="fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#8BCB2A] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8BCB2A]">
                Innovation • Technology • Engineering
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6 text-white">
              Smart solutions for a{' '}
              <span className="bg-gradient-to-r from-[#8BCB2A] to-[#A8D94A] bg-clip-text text-transparent transition-all duration-500">
                {TYPE_TEXTS[textIndex]}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-xl mb-10 leading-relaxed">
              NEXT Creatures Group builds practical technology and engineering
              solutions that transform ideas into real-world impact.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#A8D94A] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-[#8BCB2A]/30"
              >
                Explore Solutions
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 border-2 border-white/20 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white/5 hover:border-[#8BCB2A] transition-all duration-300"
              >
                Join Our Programs
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <span className="block w-12 h-px bg-[#8BCB2A]" />
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium">
                Building • Testing • Improving • Impacting
              </p>
            </div>
          </div>

          {/* RIGHT: Visual */}
          <div className="relative h-[500px] lg:h-[560px] hidden lg:block">
            {/* Orbits */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="orbit-ring orbit-ring-1">
                {ORBIT_ONE.map(({ Icon, delay }, i) => (
                  <div
                    key={i}
                    className="orbit-icon"
                    style={{
                      animationDelay: `${delay}s`,
                      transform: `rotate(${i * 90}deg) translateX(160px) rotate(-${i * 90}deg)`,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>

              <div className="orbit-ring orbit-ring-2">
                {ORBIT_TWO.map(({ Icon, delay }, i) => (
                  <div
                    key={i}
                    className="orbit-icon"
                    style={{
                      animationDelay: `${delay}s`,
                      transform: `rotate(${i * 90}deg) translateX(240px) rotate(-${i * 90}deg)`,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Center card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-white/50 mb-4">
                <span>NCG / Solutions</span>
                <span className="text-[#8BCB2A] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8BCB2A] animate-pulse" />
                  Active
                </span>
              </div>

              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border border-dashed border-[#8BCB2A]/40 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#8BCB2A] to-[#6CA51A] flex items-center justify-center">
                  <span className="font-heading font-bold text-[#031B2A] text-xl">NCG</span>
                </div>
              </div>

              <h3 className="font-heading font-semibold text-white text-sm mb-1">
                Technology with purpose.
              </h3>
              <p className="text-[11px] text-white/50 mb-4">
                Software • Smart Systems • Engineering
              </p>

              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="w-1 h-4 bg-[#8BCB2A]/40 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute top-[15%] left-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 float-anim">
              <div className="w-9 h-9 rounded-lg bg-[#8BCB2A]/20 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-[#8BCB2A]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Innovation</p>
                <p className="text-[10px] text-white/50">Ideas → Solutions</p>
              </div>
            </div>

            <div className="absolute bottom-[15%] right-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 float-anim" style={{ animationDelay: '1.5s' }}>
              <div className="w-9 h-9 rounded-lg bg-[#8BCB2A] flex items-center justify-center">
                <Check className="w-4 h-4 text-[#031B2A]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Practical Impact</p>
                <p className="text-[10px] text-white/50">Built for real problems</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline animations */}
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .orbit-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          animation: orbit 40s linear infinite;
        }
        .orbit-ring-2 {
          animation-duration: 60s;
          animation-direction: reverse;
        }
        .orbit-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 44px;
          height: 44px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8BCB2A;
          margin: -22px 0 0 -22px;
        }
        .float-anim {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}