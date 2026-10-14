// src/pages/collaboration/Education.jsx
import { GraduationCap, Laptop, Briefcase, Heart, Users, FolderKanban, Award } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const AREAS = [
  { Icon: Laptop, title: 'Training Programs', desc: 'Develop and deliver technology training programs for students and professionals.' },
  { Icon: Briefcase, title: 'Internships', desc: 'Create internship opportunities that provide real-world professional experience.' },
  { Icon: Heart, title: 'Scholarships', desc: 'Support talented young people through scholarships and financial assistance.' },
  { Icon: Users, title: 'Mentorship', desc: 'Connect students with experienced mentors and role models.' },
  { Icon: FolderKanban, title: 'Practical Projects', desc: 'Engage students in real-world projects that build skills and confidence.' },
  { Icon: Award, title: 'Career Development', desc: 'Support young people in building successful careers in technology.' },
];

export default function Education() {
  return (
    <>
      <CollaborationHero
        tag="Education & Talent Development"
        titleStart="Build the"
        titleHighlight="Future"
        titleEnd=""
        subtitle="Create opportunities for students and young professionals through training, internships, scholarships, and mentorship."
        IconComponent={GraduationCap}
        primaryCTA={{ to: '/register', label: 'Partner With Us' }}
        secondaryCTA={{ to: '/contact', label: 'Contact Us' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">Overview</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-6">
                Education & Talent <span className="text-[#8BCB2A]">Development</span>
              </h2>
              <p className="text-[#6D7E89] leading-relaxed mb-4">
                NCG is committed to developing the next generation of technology professionals. We
                partner with educational institutions, companies, and organizations to create learning
                opportunities, bridge the skills gap, and build pathways to meaningful careers.
              </p>
              <p className="text-[#6D7E89] leading-relaxed">
                Together, we can create programs that equip young people with the skills, experience,
                and confidence they need to succeed in the technology sector.
              </p>
            </div>
            <div className="space-y-3">
              {['Practical skills development', 'Real-world experience', 'Career pathways', 'Talent pipeline development'].map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F9FB]">
                  <span className="w-2 h-2 rounded-full bg-[#8BCB2A]" />
                  <span className="text-sm text-[#163247]">{t}</span>
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
              Program <span className="text-[#8BCB2A]">Areas</span>
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

      <CTABox
        tag="Start Building"
        title="Develop Talent"
        highlight="With NCG"
        subtitle="Let's work together to build the next generation of technology professionals."
        primary={{ to: '/register', label: 'Partner With Us' }}
        secondary={{ to: '/contact', label: 'Contact Us' }}
      />
    </>
  );
}