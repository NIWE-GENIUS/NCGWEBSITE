// src/pages/collaboration/Schools.jsx
import { School, Laptop, GraduationCap, Users, BookOpen, Rocket, Wrench, Award } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const AREAS = [
  { Icon: Laptop, title: 'ICT Skills Training', desc: 'Practical ICT training for students — programming, web development, networking, and digital literacy.' },
  { Icon: GraduationCap, title: 'Teacher Training', desc: 'Professional development for teachers to deliver effective ICT education.' },
  { Icon: Users, title: 'Student Projects', desc: 'Technology projects, hackathons, and competitions that encourage innovation.' },
  { Icon: Wrench, title: 'Lab Equipment Support', desc: 'Assist schools in setting up computer, IoT, and robotics labs.' },
  { Icon: BookOpen, title: 'Curriculum Development', desc: 'Enhance ICT curricula that align with industry needs and national standards.' },
  { Icon: Award, title: 'Career Pathways', desc: 'Create clear pathways from school to further education, internships, or employment.' },
  { Icon: Rocket, title: 'Entrepreneurship Programs', desc: 'Introduce students to technology entrepreneurship and innovation.' },
  { Icon: School, title: 'Industry Connections', desc: 'Connect schools with technology companies and professionals.' },
];

export default function Schools() {
  return (
    <>
      <CollaborationHero
        tag="Schools & TVET Partnerships"
        titleStart="Build Future-Ready"
        titleHighlight="Students"
        titleEnd=""
        subtitle="Partner with NCG to deliver ICT education, practical skills training, and technology programs that prepare students for the digital economy."
        IconComponent={School}
        primaryCTA={{ to: '/register', label: 'Partner With Us' }}
        secondaryCTA={{ to: '/contact', label: 'Contact Us' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-4">
              Partnering for the <span className="text-[#8BCB2A]">Next Generation</span>
            </h2>
            <p className="text-[#6D7E89] text-lg">
              We partner with secondary schools and TVET institutions to deliver practical ICT education and technology programs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
        tag="Partner With NCG"
        title="Build Future-Ready"
        highlight="Students"
        subtitle="Let's work together to equip students with the technology skills they need to succeed."
        primary={{ to: '/register', label: 'Partner With Us' }}
        secondary={{ to: '/contact', label: 'Contact Us' }}
      />
    </>
  );
}