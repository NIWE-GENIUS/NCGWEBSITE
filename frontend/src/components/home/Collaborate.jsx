// src/components/home/Collaborate.jsx
import { Link } from 'react-router-dom';
import {
  Handshake, Building2, Globe2, School, HeartHandshake,
  Users, GraduationCap, Lightbulb, Rocket, ArrowRight, Heart, MessageCircle,
} from 'lucide-react';
import useCountUp from './useCountUp';

const ECOSYSTEM_NODES = [
  { Icon: HeartHandshake, title: 'NGOs', sub: 'Community & Development' },
  { Icon: Building2, title: 'Companies', sub: 'Private Sector' },
  { Icon: School, title: 'Institutions', sub: 'Education & Research' },
  { Icon: Handshake, title: 'Investors', sub: 'Funding & Support' },
  { Icon: Users, title: 'Experts', sub: 'Mentors & Specialists' },
  { Icon: GraduationCap, title: 'Schools', sub: 'TVET & Secondary' },
];

const COLLAB_CARDS = [
  {
    Icon: Handshake,
    num: '01',
    title: 'Strategic Partnerships',
    desc: 'Work with NCG on long-term technology, education, innovation, and community initiatives that create lasting impact.',
    tags: ['Long-term', 'Impact', 'Ecosystem'],
    color: '#064B7A',
    link: '/partnership',
  },
  {
    Icon: Building2,
    num: '02',
    title: 'Corporate Collaboration',
    desc: 'Partner with NCG to develop solutions, support talent development, sponsor programs, or engage with emerging technology professionals.',
    tags: ['Business', 'Talent', 'Innovation'],
    color: '#8BCB2A',
    link: '/collaboration',
  },
  {
    Icon: Globe2,
    num: '03',
    title: 'NGO & Development',
    desc: 'Collaborate on ICT education, digital inclusion, youth empowerment, community development, and technology-for-impact initiatives.',
    tags: ['Social Impact', 'Inclusion', 'Empowerment'],
    color: '#F39C12',
    link: '/collaboration',
  },
  {
    Icon: School,
    num: '04',
    title: 'Schools & TVET',
    desc: 'Partner with secondary schools and TVET institutions to deliver ICT education, practical skills training, and technology programs for students.',
    tags: ['Education', 'Skills', 'Youth'],
    color: '#9B59B6',
    link: '/collaboration',
  },
  {
    Icon: HeartHandshake,
    num: '05',
    title: 'Investment & Sponsorship',
    desc: 'Support promising projects, programs, startups, and technology initiatives through investment, sponsorship, or other forms of financial support.',
    tags: ['Funding', 'Startups', 'Growth'],
    color: '#16A085',
    link: '/donate',
  },
  {
    Icon: Users,
    num: '06',
    title: 'Knowledge & Expertise',
    desc: 'Contribute as a mentor, trainer, researcher, technical expert, or industry professional to help build the next generation of innovators.',
    tags: ['Mentorship', 'Training', 'Research'],
    color: '#E67E22',
    link: '/collaboration',
  },
  {
    Icon: GraduationCap,
    num: '07',
    title: 'Education & Talent',
    desc: 'Help create opportunities for students and young professionals through training, internships, scholarships, mentorship, and practical projects.',
    tags: ['Training', 'Internships', 'Scholarships'],
    color: '#E91E63',
    link: '/collaboration',
  },
  {
    Icon: Lightbulb,
    num: '08',
    title: 'Innovation Collaboration',
    desc: 'Bring a problem, idea, technology, or opportunity and work with NCG to research, prototype, test, and develop a practical solution.',
    tags: ['Prototyping', 'R&D', 'Solutions'],
    color: '#E74C3C',
    link: '/collaboration',
  },
];

const STATS = [
  { target: 50, suffix: '+', label: 'Active Partnerships' },
  { target: 1000, suffix: '+', label: 'Students Impacted' },
  { target: 25, suffix: '+', label: 'Schools & Institutions' },
  { target: 15, suffix: '+', label: 'Corporate Partners' },
];

function StatItem({ target, suffix, label }) {
  const { value, ref } = useCountUp(target);
  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-heading font-bold text-[#8BCB2A]">
        {value}
        <span>{suffix}</span>
      </p>
      <p className="text-xs uppercase tracking-[0.15em] text-white/60 mt-2">{label}</p>
    </div>
  );
}

export default function Collaborate() {
  return (
    <section className="relative overflow-hidden bg-[#031B2A] text-white py-20 md:py-28">
      {/* Background rings */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-72 -bottom-72 w-[800px] h-[800px] rounded-full border border-[#8BCB2A]/5 animate-[spin_40s_linear_infinite]" />
        <div className="absolute -left-52 -top-52 w-[500px] h-[500px] rounded-full border border-[#8BCB2A]/5 animate-[spin_50s_linear_infinite_reverse]" />
      </div>

      <div className="relative container-ncg">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] mb-3">
            <Handshake className="w-4 h-4" />
            Collaborate With NCG
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
            Together, We Can Advance{' '}
            <span className="bg-gradient-to-r from-[#8BCB2A] to-[#A8D94A] bg-clip-text text-transparent">
              Technology & Innovation
            </span>{' '}
            in Rwanda
          </h2>
          <p className="text-white/60 text-base md:text-lg leading-relaxed">
            Technology creates greater impact when people, organizations, businesses, and communities
            work together. NEXT Creatures Group collaborates with NGOs, private companies, educational
            institutions, technology organizations, investors, development partners, and individual
            supporters to create opportunities, develop practical solutions, strengthen ICT skills,
            and support innovation in Rwanda.
          </p>
        </div>

        {/* Ecosystem Diagram */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {ECOSYSTEM_NODES.slice(0, 3).map(({ Icon, title, sub }, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center hover:bg-white/10 hover:border-[#8BCB2A]/30 hover:-translate-y-1 transition-all duration-300"
              >
                <Icon className="w-7 h-7 text-[#8BCB2A] mx-auto mb-2" />
                <h4 className="font-heading font-semibold text-sm text-white mb-0.5">{title}</h4>
                <p className="text-[10px] text-white/50">{sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#8BCB2A] to-[#6CA51A] rounded-xl p-6 text-center mb-4">
            <Rocket className="w-8 h-8 text-[#031B2A] mx-auto mb-2" />
            <h4 className="font-heading font-bold text-[#031B2A] text-lg mb-0.5">NCG</h4>
            <p className="text-[#031B2A]/70 text-xs">Innovation Hub</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {ECOSYSTEM_NODES.slice(3, 6).map(({ Icon, title, sub }, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center hover:bg-white/10 hover:border-[#8BCB2A]/30 hover:-translate-y-1 transition-all duration-300"
              >
                <Icon className="w-7 h-7 text-[#8BCB2A] mx-auto mb-2" />
                <h4 className="font-heading font-semibold text-sm text-white mb-0.5">{title}</h4>
                <p className="text-[10px] text-white/50">{sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-[#8BCB2A]/10 to-[#064B7A]/10 border border-[#8BCB2A]/20 rounded-xl p-5 text-center">
            <Rocket className="w-6 h-6 text-[#8BCB2A] mx-auto mb-2" />
            <p className="font-heading font-semibold text-white text-base mb-0.5">
              ICT & Innovation Ecosystem
            </p>
            <p className="text-xs text-white/60">Skills • Projects • Jobs • Impact in Rwanda</p>
          </div>
        </div>

        {/* 8 Collaboration cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {COLLAB_CARDS.map(({ Icon, num, title, desc, tags, color, link }, i) => (
            <div
              key={i}
              className="group relative bg-white/[0.04] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.08] hover:border-[#8BCB2A]/20 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div
                className="absolute inset-x-0 -bottom-20 h-40 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl rounded-full"
                style={{ background: color }}
              />

              <div className="relative flex items-center justify-between mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <span className="font-heading font-bold text-2xl text-white/10">
                  {num}
                </span>
              </div>

              <h4 className="relative font-heading font-semibold text-white text-base mb-2.5">
                {title}
              </h4>
              <p className="relative text-[13px] text-white/60 leading-relaxed mb-4">
                {desc}
              </p>

              <div className="relative flex flex-wrap gap-1.5 mb-5">
                {tags.map((t, ti) => (
                  <span
                    key={ti}
                    className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <Link
                to={link}
                className="relative inline-flex items-center gap-1.5 text-xs font-semibold text-[#8BCB2A] hover:gap-2.5 transition-all"
              >
                Learn More
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14">
          {STATS.map((s, i) => (
            <StatItem key={i} {...s} />
          ))}
        </div>

        {/* CTA */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
            Let's Build a Stronger ICT & Innovation Ecosystem Together
          </h3>
          <p className="text-white/60 max-w-2xl mx-auto mb-8">
            Whether you want to support young talent, develop a technology project, sponsor an
            educational program, explore a business partnership, invest in innovation, or contribute
            your expertise — there is an opportunity to work with NCG.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-6 py-3 rounded-lg hover:bg-[#A8D94A] hover:translate-y-[-2px] transition-all"
            >
              <Handshake className="w-4 h-4" />
              Become a Partner
            </Link>
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 border-2 border-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/5 hover:border-[#8BCB2A] transition-all"
            >
              <Heart className="w-4 h-4" />
              Support an Initiative
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border-2 border-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/5 hover:border-[#8BCB2A] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Start a Collaboration
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}