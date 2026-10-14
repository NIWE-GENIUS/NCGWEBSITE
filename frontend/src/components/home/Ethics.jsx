// src/components/home/Ethics.jsx
import { ShieldCheck, Lock, Lightbulb, Users, Star, Handshake } from 'lucide-react';

const COMMITMENTS = [
  { Icon: ShieldCheck, title: 'Integrity', desc: 'We act honestly and responsibly in our decisions, partnerships, and work.' },
  { Icon: Lock, title: 'Privacy & Security', desc: 'We respect data privacy and prioritize the security of the systems and information we handle.' },
  { Icon: Lightbulb, title: 'Responsible Innovation', desc: 'We consider the potential social, economic, and environmental consequences of the technologies we develop.' },
  { Icon: Users, title: 'Inclusivity & Respect', desc: 'We value diverse perspectives and strive to create opportunities where people can learn, participate, and contribute.' },
  { Icon: Star, title: 'Professional Excellence', desc: 'We take responsibility for the quality, reliability, and continuous improvement of our work.' },
  { Icon: Handshake, title: 'Accountability', desc: 'We stand behind our decisions, learn from mistakes, and remain accountable to our clients, partners, team, and communities.' },
];

export default function Ethics() {
  return (
    <section className="section bg-white">
      <div className="container-ncg">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
            Ethics & Integrity
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A] mb-6">
            Technology Built on <span className="text-[#8BCB2A]">Trust</span>
          </h2>
          <div className="space-y-4 text-[#6D7E89] text-left md:text-center">
            <p>
              At NEXT Creatures Group Ltd, we believe meaningful innovation must be guided by
              integrity, responsibility, respect, and accountability. We are committed to developing
              technology that creates value while considering its impact on people, communities,
              businesses, and the environment.
            </p>
            <p>
              We conduct our work with transparency and professionalism, protect the information
              entrusted to us, respect intellectual property, and continuously strive to deliver
              solutions that are safe, reliable, inclusive, and responsible.
            </p>
            <p className="text-[#031B2A] font-medium">
              <strong>Our principle:</strong> Innovate with purpose. Build with integrity. Create lasting impact.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {COMMITMENTS.map(({ Icon, title, desc }, i) => (
            <div key={i} className="flex gap-4 p-6 rounded-xl border border-[#EDF2F5] hover:border-[#8BCB2A]/40 hover:bg-[#F5F9FB] transition-all duration-300">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#8BCB2A]/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#8BCB2A]" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-base text-[#031B2A] mb-1.5">{title}</h3>
                <p className="text-sm text-[#6D7E89] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}