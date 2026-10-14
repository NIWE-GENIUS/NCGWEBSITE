// src/pages/collaboration/Corporate.jsx
import { Building2, Users, FlaskConical, Heart, Handshake, GraduationCap } from 'lucide-react';
import CollaborationHero from '../../components/shared/CollaborationHero';
import CTABox from '../../components/shared/CTABox';

const AREAS = [
  { Icon: GraduationCap, title: 'Talent Engagement', desc: 'Connect with emerging technology professionals through internships, hiring, and mentorship.' },
  { Icon: FlaskConical, title: 'Solution Co-Development', desc: 'Collaborate with NCG\'s technical team to develop innovative products and solutions.' },
  { Icon: Handshake, title: 'Program Sponsorship', desc: 'Sponsor bootcamps, training programs, innovation challenges, and community initiatives.' },
  { Icon: Users, title: 'Expertise Sharing', desc: 'Contribute industry expertise through workshops, guest lectures, and mentorship.' },
  { Icon: Building2, title: 'Project Collaboration', desc: 'Work with NCG on technology projects, research, and innovation initiatives.' },
  { Icon: Heart, title: 'CSR & Community Impact', desc: 'Support community development through technology education and empowerment programs.' },
];

export default function Corporate() {
  return (
    <>
      <CollaborationHero
        tag="Corporate Collaboration"
        titleStart="Partner With NCG to"
        titleHighlight="Build the Future"
        titleEnd=""
        subtitle="Engage with emerging technology professionals, support talent development, and co-create innovative solutions."
        IconComponent={Building2}
        primaryCTA={{ to: '/register', label: 'Partner With Us' }}
        secondaryCTA={{ to: '/contact', label: 'Contact Us' }}
      />

      <section className="section bg-white">
        <div className="container-ncg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">Overview</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#031B2A] mb-6">
                Corporate <span className="text-[#8BCB2A]">Collaboration</span>
              </h2>
              <p className="text-[#6D7E89] leading-relaxed mb-4">
                NCG offers corporations a unique opportunity to engage with Rwanda's emerging
                technology ecosystem. Partner with us to access talent, co-develop solutions, sponsor
                programs, and contribute to the growth of the technology sector.
              </p>
              <p className="text-[#6D7E89] leading-relaxed">
                Whether you're looking to recruit top talent, develop new products, or support community
                initiatives, NCG provides a platform for meaningful corporate engagement.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['Access to skilled talent', 'Co-creation of solutions', 'Brand visibility', 'CSR support'].map((t, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#F5F9FB] border border-[#EDF2F5]">
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
              Engagement <span className="text-[#8BCB2A]">Opportunities</span>
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
        tag="Start Collaborating"
        title="Engage With"
        highlight="NCG"
        subtitle="Let's explore how your corporation can partner with NCG to build technology and develop talent."
        primary={{ to: '/register', label: 'Partner With Us' }}
        secondary={{ to: '/contact', label: 'Contact Us' }}
      />
    </>
  );
}