// src/pages/collaboration/InnovationCollab.jsx
import { Lightbulb, Search, FlaskConical, Boxes, CheckCircle2, Rocket } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const AREAS = [
  { Icon: Search, title: 'Problem Discovery', desc: 'Work together to identify and define problems worth solving.' },
  { Icon: FlaskConical, title: 'Research & Feasibility', desc: 'Explore technical feasibility, market potential, and solution approaches.' },
  { Icon: Boxes, title: 'Prototyping', desc: 'Develop functional prototypes to test and validate ideas quickly.' },
  { Icon: Lightbulb, title: 'Development', desc: 'Build full-scale solutions using software, hardware, and smart systems.' },
  { Icon: CheckCircle2, title: 'Testing & Validation', desc: 'Test solutions in real-world conditions and iterate based on feedback.' },
  { Icon: Rocket, title: 'Deployment & Scaling', desc: 'Launch solutions and scale them for maximum impact.' },
];

const STEPS = [
  { num: '01', title: 'Ideation', desc: 'Share your idea, problem, or opportunity with NCG.' },
  { num: '02', title: 'Discovery', desc: 'We research and explore potential solutions together.' },
  { num: '03', title: 'Prototype', desc: 'Develop a working prototype to test the concept.' },
  { num: '04', title: 'Build', desc: 'Develop the full solution with your input and feedback.' },
  { num: '05', title: 'Launch', desc: 'Deploy the solution and measure its impact.' },
];

export default function InnovationCollab() {
  return (
    <>
      <CollaborationHero
        tag="Innovation Collaboration"
        titleStart="Turn Ideas Into"
        titleHighlight="Reality"
        titleEnd=""
        subtitle="Bring a problem, idea, or opportunity and work with NCG to research, prototype, test, and develop a practical solution."
        IconComponent={Lightbulb}
        primaryCTA={{ to: '/register', label: 'Start a Project' }}
        secondaryCTA={{ to: '/contact', label: 'Contact Us' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Innovation & Project <span className="text-[#8BCB2A]">Collaboration</span>
            </h2>
            <p className="text-[#6D7E89] text-lg">
              Whether you have a problem to solve, an idea to develop, or a technology to explore, we can collaborate.
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

      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A]">
              How We <span className="text-[#8BCB2A]">Collaborate</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {STEPS.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#064B7A] text-white font-heading font-bold flex items-center justify-center text-lg mb-3">
                  {s.num}
                </div>
                <h3 className="font-heading font-semibold text-base text-[#031B2A] mb-2">{s.title}</h3>
                <p className="text-xs text-[#6D7E89]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABox
        tag="Start Collaborating"
        title="Turn Your Idea Into"
        highlight="Reality"
        subtitle="Let's explore how we can work together to bring your vision to life."
        primary={{ to: '/register', label: 'Start a Project' }}
        secondary={{ to: '/contact', label: 'Contact Us' }}
      />
    </>
  );
}