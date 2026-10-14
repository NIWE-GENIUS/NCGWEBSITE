// src/pages/collaboration/Strategic.jsx
import { Handshake, Target, Network, TrendingUp, Users, ShieldCheck } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const AREAS = [
  { Icon: Target, title: 'Education & Training', desc: 'Partner on bootcamps, workshops, internships, and skill development programs for young people.' },
  { Icon: Network, title: 'Technology Development', desc: 'Collaborate on software, IoT, AI, and engineering projects that solve real problems.' },
  { Icon: TrendingUp, title: 'Innovation & Research', desc: 'Jointly explore emerging technologies, conduct research, and develop innovative solutions.' },
  { Icon: Users, title: 'Community Impact', desc: 'Work together on initiatives that empower communities and drive social change.' },
  { Icon: ShieldCheck, title: 'Startup Support', desc: 'Support startups and entrepreneurs through mentorship, resources, and funding connections.' },
  { Icon: Handshake, title: 'Development & Sustainability', desc: 'Partner on projects that advance sustainable development goals through technology.' },
];

const STEPS = [
  { num: '01', title: 'Reach Out', desc: 'Contact us to express interest and share your vision.' },
  { num: '02', title: 'Discovery', desc: 'We discuss goals, opportunities, and areas of mutual interest.' },
  { num: '03', title: 'Design', desc: 'Co-create a partnership framework and action plan.' },
  { num: '04', title: 'Launch', desc: 'Implement initiatives together and track impact.' },
];

export default function Strategic() {
  return (
    <>
      <CollaborationHero
        tag="Strategic Partnerships"
        titleStart="Work With NCG on"
        titleHighlight="Long-Term Impact"
        titleEnd=""
        subtitle="Join us in building a stronger technology and innovation ecosystem through strategic collaboration."
        IconComponent={Handshake}
        primaryCTA={{ to: '/register', label: 'Become a Partner' }}
        secondaryCTA={{ to: '/contact', label: 'Contact Us' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">Overview</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-6">
                Strategic <span className="text-[#8BCB2A]">Partnerships</span>
              </h2>
              <p className="text-[#6D7E89] leading-relaxed mb-4">
                Strategic partnerships are the foundation of NCG's ecosystem. We work with organizations
                that share our vision of using technology to solve real problems and create lasting impact.
              </p>
              <p className="text-[#6D7E89] leading-relaxed">
                Whether you represent a corporation, NGO, government institution, or international
                organization, we can collaborate on initiatives that advance technology, education,
                innovation, and community development in Rwanda and beyond.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['Co-create initiatives', 'Access NCG talent', 'Shared resources', 'Measurable impact'].map((t, i) => (
                <div key={i} className="flex items-start gap-2 p-4 rounded-xl bg-[#F5F9FB]">
                  <div className="w-8 h-8 rounded-lg bg-[#8BCB2A]/20 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#8BCB2A]" />
                  </div>
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
              Partnership <span className="text-[#8BCB2A]">Areas</span>
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

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A]">
              How It <span className="text-[#8BCB2A]">Works</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#064B7A] text-white font-heading font-bold flex items-center justify-center text-xl mb-4">
                  {s.num}
                </div>
                <h3 className="font-heading font-semibold text-lg text-[#031B2A] mb-2">{s.title}</h3>
                <p className="text-sm text-[#6D7E89]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABox
        tag="Start Your Partnership"
        title="Ready to Partner"
        highlight="With NCG?"
        subtitle="Let's explore how we can work together to create lasting impact."
        primary={{ to: '/register', label: 'Become a Partner' }}
        secondary={{ to: '/contact', label: 'Contact Us' }}
      />
    </>
  );
}