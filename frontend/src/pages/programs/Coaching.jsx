// src/pages/programs/Coaching.jsx
import { Target, Briefcase, Code2, FolderKanban, Lightbulb, ClipboardList, Map, MessageCircle, TrendingUp } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const AREAS = [
  { Icon: Briefcase, title: 'Career Coaching', items: ['Career direction', 'Skills development', 'Portfolio strategy', 'CV/LinkedIn', 'Job preparation'] },
  { Icon: Code2, title: 'Technology Coaching', items: ['Programming', 'Web development', 'Software architecture', 'IoT & embedded', 'Cybersecurity'] },
  { Icon: FolderKanban, title: 'Project Coaching', items: ['Idea to planning', 'Development', 'Testing', 'Deployment', 'Project management'] },
  { Icon: Lightbulb, title: 'Entrepreneurship Coaching', items: ['Idea validation', 'Business model', 'MVP development', 'Pitch preparation', 'Product strategy'] },
];

const STEPS = [
  { Icon: ClipboardList, num: '01', title: 'Assessment', desc: 'Understand your current level and goals.' },
  { Icon: Map, num: '02', title: 'Roadmap', desc: 'Create a personalized development plan.' },
  { Icon: MessageCircle, num: '03', title: 'Coaching Sessions', desc: 'Work through challenges with a coach.' },
  { Icon: TrendingUp, num: '04', title: 'Progress Review', desc: 'Measure progress and adjust the roadmap.' },
];

export default function Coaching() {
  return (
    <>
      <CollaborationHero
        tag="NCG Coaching"
        titleStart="Don't Learn Alone."
        titleHighlight="Build with Guidance."
        titleEnd=""
        subtitle="Get personalized guidance to help you reach your technology, career, project, or entrepreneurship goals."
        IconComponent={Target}
        primaryCTA={{ to: '/register', label: 'Request Coaching' }}
        secondaryCTA={{ to: '/programs', label: 'All Programs' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              How Coaching <span className="text-[#8BCB2A]">Works</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ Icon, num, title, desc }) => (
              <div key={num} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#8BCB2A]/10 flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-[#8BCB2A]" />
                </div>
                <h3 className="font-heading font-bold text-lg text-[#031B2A] mb-2">{num} — {title}</h3>
                <p className="text-sm text-[#6D7E89]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Coaching <span className="text-[#8BCB2A]">Areas</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AREAS.map(({ Icon, title, items }, i) => (
              <div key={i} className="bg-white border border-[#EDF2F5] rounded-2xl p-7">
                <div className="w-12 h-12 rounded-xl bg-[#8BCB2A]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#8BCB2A]" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-[#031B2A] mb-3">{title}</h3>
                <ul className="space-y-1.5">
                  {items.map((it, ii) => (
                    <li key={ii} className="text-sm text-[#6D7E89] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8BCB2A]" /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABox
        tag="Find Your Coach"
        title="Get"
        highlight="Personalized Guidance"
        subtitle="Take the next step in your journey with expert coaching."
        primary={{ to: '/register', label: 'Request Coaching' }}
        secondary={{ to: '/programs', label: 'View Other Programs' }}
      />
    </>
  );
}