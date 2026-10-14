// src/pages/programs/PrivateTutoring.jsx
import { Home as HomeIcon, Code2, Laptop, Wifi, Cpu, Users, User, Monitor, Building2, ClipboardList, Calendar, BookOpen, TrendingUp } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const SUBJECTS = [
  { Icon: Code2, title: 'Programming', items: ['HTML/CSS', 'JavaScript', 'C / C++', 'Python', 'PHP', 'SQL'] },
  { Icon: Laptop, title: 'Computer Science', items: ['Data Structures', 'Algorithms', 'Database Systems', 'Architecture', 'OS'] },
  { Icon: Wifi, title: 'Networking', items: ['Fundamentals', 'IP Addressing', 'Subnetting', 'Routing', 'Configuration'] },
  { Icon: Cpu, title: 'Electronics & Embedded', items: ['Arduino', 'Microcontrollers', 'Sensors', 'Embedded Programming', 'IoT'] },
];

const FORMATS = [
  { Icon: User, title: '1-on-1', desc: 'Personalized sessions focused entirely on you.' },
  { Icon: Users, title: 'Small Group', desc: '2-5 learners with similar goals.' },
  { Icon: Monitor, title: 'Online', desc: 'Remote sessions from anywhere.' },
  { Icon: Building2, title: 'In-Person', desc: 'Physical sessions where available.' },
];

const STEPS = [
  { num: '01', Icon: BookOpen, title: 'Choose Subject', desc: 'Select the subject you need help with.' },
  { num: '02', Icon: Calendar, title: 'Schedule Session', desc: 'Book a time that works for you.' },
  { num: '03', Icon: User, title: 'Learn', desc: 'Get personalized instruction.' },
  { num: '04', Icon: Code2, title: 'Practice', desc: 'Apply what you\'ve learned.' },
  { num: '05', Icon: TrendingUp, title: 'Review', desc: 'Review progress and plan next steps.' },
];

export default function PrivateTutoring() {
  return (
    <>
      <CollaborationHero
        tag="NCG Private Tutoring"
        titleStart="One-to-One Learning."
        titleHighlight="Focused on You."
        titleEnd=""
        subtitle="Get personalized instruction for specific subjects. One-to-one or small-group sessions tailored to your learning needs."
        IconComponent={HomeIcon}
        primaryCTA={{ to: '/register', label: 'Book a Session' }}
        secondaryCTA={{ to: '/programs', label: 'All Programs' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Subjects We <span className="text-[#8BCB2A]">Cover</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUBJECTS.map(({ Icon, title, items }, i) => (
              <div key={i} className="bg-white border border-[#EDF2F5] rounded-2xl p-7">
                <div className="w-12 h-12 rounded-xl bg-[#8BCB2A]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#8BCB2A]" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-[#031B2A] mb-3">{title}</h3>
                <ul className="grid grid-cols-2 gap-1.5">
                  {items.map((it, ii) => (
                    <li key={ii} className="text-sm text-[#6D7E89]">• {it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Tutoring <span className="text-[#8BCB2A]">Formats</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {FORMATS.map(({ Icon, title, desc }, i) => (
              <div key={i} className="bg-white border border-[#EDF2F5] rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#8BCB2A]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#8BCB2A]" />
                </div>
                <h3 className="font-heading font-semibold text-base text-[#031B2A] mb-2">{title}</h3>
                <p className="text-sm text-[#6D7E89]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              How It <span className="text-[#8BCB2A]">Works</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {STEPS.map((s) => (
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
        tag="Book a Session"
        title="Get"
        highlight="Personalized Support"
        subtitle="One-to-one learning focused on exactly what you need."
        primary={{ to: '/register', label: 'Book a Session' }}
        secondary={{ to: '/programs', label: 'View Other Programs' }}
      />
    </>
  );
}