// src/pages/programs/OnlineLearning.jsx
import { BookOpen, Code2, Database, Shield, Wifi, Cpu, Brain, Video, FileText, ClipboardList, Award, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const CATEGORIES = [
  { Icon: Code2, title: 'Web Development', desc: 'HTML, CSS, JavaScript, React, Node.js' },
  { Icon: Database, title: 'Programming', desc: 'Python, C, C++, PHP, SQL' },
  { Icon: Shield, title: 'Cybersecurity', desc: 'Security fundamentals, ethical hacking' },
  { Icon: Wifi, title: 'Networking', desc: 'Fundamentals, IP addressing, routing' },
  { Icon: Cpu, title: 'IoT & Embedded', desc: 'Arduino, sensors, embedded programming' },
  { Icon: Brain, title: 'AI & Data', desc: 'Machine learning, data science, AI' },
];

const FEATURES = [
  { Icon: Video, title: 'Video Lessons', desc: 'Expert-led tutorials' },
  { Icon: FileText, title: 'PDFs & Notes', desc: 'Comprehensive materials' },
  { Icon: Code2, title: 'Coding Exercises', desc: 'Hands-on challenges' },
  { Icon: ClipboardList, title: 'Quizzes', desc: 'Test your understanding' },
  { Icon: CheckCircle2, title: 'Assignments', desc: 'Submit and get feedback' },
  { Icon: TrendingUp, title: 'Progress Tracking', desc: 'See your journey' },
  { Icon: Users, title: 'Community', desc: 'Learn with peers' },
  { Icon: Award, title: 'Certificates', desc: 'Earn on completion' },
];

const STRUCTURE = [
  { num: '01', title: 'Lessons', desc: 'Video lessons and materials' },
  { num: '02', title: 'Practice', desc: 'Apply what you\'ve learned' },
  { num: '03', title: 'Quizzes', desc: 'Test understanding' },
  { num: '04', title: 'Projects', desc: 'Build something real' },
  { num: '05', title: 'Assessment', desc: 'Get evaluated' },
  { num: '06', title: 'Certificate', desc: 'Earn your certificate' },
];

export default function OnlineLearning() {
  return (
    <>
      <CollaborationHero
        tag="NCG Online Learning"
        titleStart="Learn. Practice."
        titleHighlight="Build. Anywhere."
        titleEnd=""
        subtitle="Learn technology at your own pace. Access courses, practice exercises, build projects, and earn certificates."
        IconComponent={BookOpen}
        primaryCTA={{ to: '/register', label: 'Start Learning' }}
        secondaryCTA={{ to: '/programs', label: 'All Programs' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Course <span className="text-[#8BCB2A]">Categories</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map(({ Icon, title, desc }, i) => (
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
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Learning <span className="text-[#8BCB2A]">Features</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {FEATURES.map(({ Icon, title, desc }, i) => (
              <div key={i} className="bg-white border border-[#EDF2F5] rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#8BCB2A]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#8BCB2A]" />
                </div>
                <h3 className="font-heading font-semibold text-sm text-[#031B2A] mb-1">{title}</h3>
                <p className="text-xs text-[#6D7E89]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              How Courses <span className="text-[#8BCB2A]">Work</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {STRUCTURE.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#064B7A] text-white font-heading font-bold flex items-center justify-center text-lg mb-3">
                  {s.num}
                </div>
                <h3 className="font-heading font-semibold text-sm text-[#031B2A] mb-1">{s.title}</h3>
                <p className="text-xs text-[#6D7E89]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABox
        tag="Start Learning"
        title="Create Your"
        highlight="Learning Account"
        subtitle="Access all courses, track progress, and earn certificates."
        primary={{ to: '/register', label: 'Get Started' }}
        secondary={{ to: '/programs', label: 'View Other Programs' }}
      />
    </>
  );
}