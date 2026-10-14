// src/pages/collaboration/CollaborationHub.jsx
import { Link } from 'react-router-dom';
import {
  Handshake, Building2, Globe2, School, HeartHandshake, Users,
  GraduationCap, Lightbulb, ArrowRight, Cpu, FlaskConical, Network,
} from 'lucide-react';
import CTABox from '../../components/shared/CTABox';

const COLLAB_TYPES = [
  { Icon: Handshake, title: 'Strategic Partnerships', desc: 'Long-term technology, education, and community initiatives that create lasting impact.', slug: 'strategic', color: '#064B7A' },
  { Icon: Building2, title: 'Corporate Collaboration', desc: 'Develop solutions, support talent, sponsor programs, and engage with emerging professionals.', slug: 'corporate', color: '#8BCB2A' },
  { Icon: Globe2, title: 'NGO & Development', desc: 'ICT education, digital inclusion, youth empowerment, and technology-for-impact initiatives.', slug: 'ngo', color: '#F39C12' },
  { Icon: School, title: 'Schools & TVET', desc: 'Deliver ICT education and practical skills training to schools and TVET institutions.', slug: 'schools', color: '#9B59B6' },
  { Icon: HeartHandshake, title: 'Investment & Sponsorship', desc: 'Support projects, programs, startups, and technology initiatives through funding.', slug: 'investment', color: '#16A085' },
  { Icon: Users, title: 'Knowledge & Expertise', desc: 'Contribute as a mentor, trainer, researcher, or industry professional.', slug: 'expert', color: '#E67E22' },
  { Icon: GraduationCap, title: 'Education & Talent', desc: 'Create opportunities through training, internships, scholarships, and mentorship.', slug: 'education', color: '#E91E63' },
  { Icon: Lightbulb, title: 'Innovation Collaboration', desc: 'Bring a problem, idea, or opportunity and work with NCG to research, prototype, and develop.', slug: 'innovation', color: '#E74C3C' },
  { Icon: Cpu, title: 'Technology Collaboration', desc: 'Collaborate on software, IoT, AI, and engineering projects that solve real problems.', slug: 'technology', color: '#3498DB' },
  { Icon: Network, title: 'Community Collaboration', desc: 'Engage with tech communities, developer groups, and grassroots initiatives.', slug: 'community', color: '#1ABC9C' },
  { Icon: FlaskConical, title: 'Government Collaboration', desc: 'Partner on national digital initiatives, policy, and public-sector innovation.', slug: 'government', color: '#34495E' },
  { Icon: Handshake, title: 'Partnership Program', desc: 'Join NCG\'s formal partnership program with structured engagement and benefits.', slug: 'partnership', color: '#8E44AD' },
];

export default function CollaborationHub() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#031B2A] via-[#062F4A] to-[#064B7A] text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#8BCB2A] blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-[#064B7A] blur-[120px]" />
        </div>

        <div className="relative container-ncg py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] mb-3">
              <Handshake className="w-4 h-4" /> Collaborate With NCG
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold leading-[1.1] mb-6 text-white">
              Together, We Can Advance{' '}
              <span className="bg-gradient-to-r from-[#8BCB2A] to-[#A8D94A] bg-clip-text text-transparent">
                Technology & Innovation
              </span>{' '}
              in Rwanda
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              NCG collaborates with NGOs, private companies, educational institutions, technology
              organizations, investors, development partners, and individual supporters to create
              opportunities, develop practical solutions, strengthen ICT skills, and support
              innovation in Rwanda.
            </p>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="section bg-[#F5F9FB]">
        <div className="container-ncg">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
              Ways to Collaborate
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A] mb-4">
              Choose Your <span className="text-[#8BCB2A]">Path</span>
            </h2>
            <p className="text-[#6D7E89] text-lg">
              Every collaboration is unique. Find the path that fits your organization, expertise, or goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLLAB_TYPES.map(({ Icon, title, desc, slug, color }) => (
              <Link
                key={slug}
                to={`/features/${slug}`}
                className="group relative bg-white border border-[#EDF2F5] rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={{ background: color }} />
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                  >
                    <Icon className="w-7 h-7" style={{ color }} />
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-lg text-[#031B2A] mb-2 group-hover:text-[#064B7A] transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-[#6D7E89] leading-relaxed mb-4">{desc}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#064B7A] group-hover:text-[#8BCB2A] transition-colors">
                  Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABox
        tag="Let's Build Together"
        title="Ready to Collaborate"
        highlight="With NCG?"
        subtitle="Tell us how you'd like to work together — we'll find the right path forward."
        primary={{ to: '/register', label: 'Become a Partner' }}
        secondary={{ to: '/contact?purpose=partnership', label: 'Contact Us' }}
      />
    </>
  );
}