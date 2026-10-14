// src/pages/programs/Internship.jsx
import {
  Briefcase, Code2, Cpu, FlaskConical, Paintbrush, Megaphone,
  UserCheck, Users, FolderKanban, Target, Award,
} from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const DEPARTMENTS = [
  { Icon: Code2, title: 'Technology', items: ['Frontend Development', 'Backend Development', 'Full Stack', 'Mobile Development'] },
  { Icon: Cpu, title: 'Engineering', items: ['IoT & Embedded', 'Electronics', 'Automation'] },
  { Icon: FlaskConical, title: 'Innovation', items: ['Research', 'Product Development', 'Prototyping'] },
  { Icon: Paintbrush, title: 'Creative', items: ['Animation', 'Graphic Design', 'Content Creation'] },
  { Icon: Megaphone, title: 'Business', items: ['Entrepreneurship', 'Marketing', 'Communication', 'Project Management'] },
];

const JOURNEY = [
  { num: '01', title: 'Orientation', desc: 'Introduction to NCG culture, team, and expectations.' },
  { num: '02', title: 'Team Assignment', desc: 'Join a team and start contributing to real projects.' },
  { num: '03', title: 'Project Work', desc: 'Work on meaningful projects with mentorship.' },
  { num: '04', title: 'Mentorship', desc: 'Guidance from experienced professionals.' },
  { num: '05', title: 'Evaluation', desc: 'Feedback and performance review.' },
  { num: '06', title: 'Completion', desc: 'Receive certificate and prepare for next steps.' },
];

const BENEFITS = [
  { Icon: UserCheck, title: 'Practical Experience', desc: 'Work on real projects that matter.' },
  { Icon: Users, title: 'Mentorship', desc: 'Learn from experienced professionals.' },
  { Icon: FolderKanban, title: 'Real Projects', desc: 'Build a portfolio of meaningful work.' },
  { Icon: Target, title: 'Professional Growth', desc: 'Grow your skills and career readiness.' },
  { Icon: Award, title: 'Certificate', desc: 'Earn a recognized certificate.' },
  { Icon: Briefcase, title: 'Network Building', desc: 'Connect with professionals and peers.' },
];

export default function Internship() {
  return (
    <>
      <CollaborationHero
        tag="NCG Internship"
        titleStart="Learn by Working on"
        titleHighlight="Real Projects"
        titleEnd=""
        subtitle="Experience technology in the real world. Work alongside professionals, contribute to meaningful projects, and build your career."
        IconComponent={Briefcase}
        primaryCTA={{ to: '/register', label: 'Apply Now' }}
        secondaryCTA={{ to: '/programs', label: 'All Programs' }}
      />

      {/* Overview */}
      <section className="section bg-white">
        <div className="container-ncg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
                Internship Overview
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-6">
                Professional <span className="text-[#8BCB2A]">Experience</span>
              </h2>
              <p className="text-[#6D7E89] leading-relaxed mb-6">
                Our internship program gives you the opportunity to work on real projects,
                learn from experienced professionals, and build a portfolio of work that
                demonstrates your capabilities.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { k: 'Duration', v: '3-6 Months' },
                  { k: 'Format', v: 'Physical / Online / Hybrid' },
                  { k: 'Certificate', v: 'Yes' },
                  { k: 'Departments', v: '5 available' },
                ].map((d, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#F5F9FB]">
                    <p className="text-xs uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                      {d.k}
                    </p>
                    <p className="text-sm text-[#031B2A] font-semibold">{d.v}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#064B7A] to-[#031B2A] text-white">
              <p className="text-sm uppercase tracking-wider text-[#8BCB2A] font-bold mb-3">
                Apply Now
              </p>
              <p className="text-white/70 leading-relaxed">
                Take the first step toward your professional career. Applications are reviewed
                on a rolling basis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Internship <span className="text-[#8BCB2A]">Departments</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEPARTMENTS.map(({ Icon, title, items }, i) => (
              <div key={i} className="bg-white border border-[#EDF2F5] rounded-xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[#8BCB2A]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#8BCB2A]" />
                </div>
                <h3 className="font-heading font-semibold text-base text-[#031B2A] mb-3">
                  {title}
                </h3>
                <ul className="space-y-1.5">
                  {items.map((it, ii) => (
                    <li key={ii} className="text-sm text-[#6D7E89]">• {it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Your Internship <span className="text-[#8BCB2A]">Journey</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {JOURNEY.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#064B7A] text-white font-heading font-bold flex items-center justify-center text-lg mb-3">
                  {s.num}
                </div>
                <h3 className="font-heading font-semibold text-sm text-[#031B2A] mb-1">
                  {s.title}
                </h3>
                <p className="text-xs text-[#6D7E89]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              What Interns <span className="text-[#8BCB2A]">Receive</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map(({ Icon, title, desc }, i) => (
              <div key={i} className="bg-white border border-[#EDF2F5] rounded-xl p-6">
                <div className="w-12 h-12 rounded-xl bg-[#8BCB2A]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#8BCB2A]" />
                </div>
                <h3 className="font-heading font-semibold text-base text-[#031B2A] mb-2">
                  {title}
                </h3>
                <p className="text-sm text-[#6D7E89] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABox
        tag="Start Your Career"
        title="Apply for an"
        highlight="Internship"
        subtitle="Take the first step toward your professional career."
        primary={{ to: '/register', label: 'Apply Now' }}
        secondary={{ to: '/programs', label: 'View Other Programs' }}
      />
    </>
  );
}