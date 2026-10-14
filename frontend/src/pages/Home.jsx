// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Code2, Bot, Workflow, Cloud, Shield,
  Cpu, Zap, Sprout, Lightbulb, GraduationCap, Sparkles,
  Handshake, Building2, Globe2, School, HeartHandshake, Users,
  Rocket, Briefcase, BookOpen, Target, Home as HomeIcon,
  Search, Wrench, Combine, UserCheck,
  FlaskConical, Boxes, BarChart3,
  ShieldCheck, Lock, Star, CheckCircle2,
  Send, Quote, User2, TrendingUp, ArrowDown,
} from 'lucide-react';
import api from '../lib/api';
import useCountUp from '../components/home/useCountUp';

/* ================= HERO ================= */
function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const TEXTS = ['digital future.', 'real-world impact.', "Africa's innovation.", 'practical solutions.'];

  useEffect(() => {
    const t = setInterval(() => setTextIndex((i) => (i + 1) % TEXTS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const FLOATING_ICONS = [
    { cls: 'ri-code-s-slash-line', label: 'Code', top: '12%', left: '4%', delay: '0s' },
    { cls: 'ri-robot-2-line', label: 'AI', top: '22%', right: '3%', delay: '0.8s' },
    { cls: 'ri-cpu-line', label: 'Hardware', bottom: '18%', left: '3%', delay: '1.6s' },
    { cls: 'ri-cloud-line', label: 'Cloud', top: '52%', right: '2%', delay: '2.4s' },
    { cls: 'ri-shield-check-line', label: 'Security', bottom: '8%', right: '14%', delay: '3.2s' },
    { cls: 'ri-database-2-line', label: 'Data', top: '4%', right: '30%', delay: '4s' },
    { cls: 'ri-wifi-line', label: 'IoT', bottom: '5%', left: '26%', delay: '0.4s' },
    { cls: 'ri-flask-line', label: 'R&D', top: '40%', left: '2%', delay: '1.2s' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#031B2A] via-[#062F4A] to-[#064B7A] text-white">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#8BCB2A] blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-[#064B7A] blur-[120px]" />
      </div>

      <div className="relative container-ncg py-16 md:py-24 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#8BCB2A] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8BCB2A]">
                Innovation • Technology • Engineering
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] mb-6 text-white">
              Smart solutions for a{' '}
              <span className="bg-gradient-to-r from-[#8BCB2A] to-[#A8D94A] bg-clip-text text-transparent transition-all duration-500">
                {TEXTS[textIndex]}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-xl mb-10 leading-relaxed">
              NEXT Creatures Group builds practical technology and engineering
              solutions that transform ideas into real-world impact.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/programs" className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#A8D94A] transition-all duration-300 hover:-translate-y-0.5">
                Explore Programs <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 border-2 border-white/20 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white/5 hover:border-[#8BCB2A] transition-all duration-300">
                <i className="ri-information-line text-lg" /> About NCG
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <span className="block w-12 h-px bg-[#8BCB2A]" />
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium">
                Building • Testing • Improving • Impacting
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative h-[480px] lg:h-[520px] flex items-center justify-center">
            <div className="relative w-[280px] md:w-[360px] pulse-glow">
              <div className="bg-white rounded-3xl p-8 border border-white/20">
                <img src="/logo.png" alt="NEXT Creatures Group" className="w-full h-auto object-contain" />
              </div>
            </div>

            {FLOATING_ICONS.map((icon, i) => (
              <div
                key={i}
                className="absolute flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl px-3 py-2 hover:bg-[#8BCB2A]/20 hover:border-[#8BCB2A]/40 transition-all duration-300 float-anim"
                style={{
                  top: icon.top,
                  left: icon.left,
                  right: icon.right,
                  bottom: icon.bottom,
                  animationDelay: icon.delay,
                }}
              >
                <i className={`${icon.cls} text-xl text-[#8BCB2A]`} />
                <span className="text-[11px] font-semibold text-white whitespace-nowrap">{icon.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= DIFFERENT ================= */
const DIFFERENT_ITEMS = [
  { Icon: Search, title: 'Problem-First', desc: "We don't ask \"What technology can we sell?\" We ask \"What problem are we trying to solve?\"" },
  { Icon: Wrench, title: 'Build, Not Just Advise', desc: 'Ideas are transformed into prototypes, software, smart systems, and practical solutions.' },
  { Icon: Combine, title: 'Combine Disciplines', desc: 'Software, engineering, IoT, research, creativity, entrepreneurship, and education work together.' },
  { Icon: UserCheck, title: 'Develop People & Technology', desc: 'Our programs give young people opportunities to learn, build, experiment, and gain practical experience.' },
];

function Different() {
  return (
    <section className="section bg-white">
      <div className="container-ncg">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">What Makes Us Different</span>
          <h2 className="section-title">More Than an <span className="text-[#8BCB2A]">ICT Company</span></h2>
          <p className="text-[#6D7E89] text-lg">
            We start with problems, not technology. We build, not just advise.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIFFERENT_ITEMS.map(({ Icon, title, desc }, i) => (
            <div key={i} className="group card p-7 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 rounded-xl bg-[#F5F9FB] group-hover:bg-[#8BCB2A]/10 flex items-center justify-center mb-5 transition-colors">
                <Icon className="w-7 h-7 text-[#064B7A] group-hover:text-[#8BCB2A] transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-[#031B2A] mb-3">{title}</h3>
              <p className="text-sm text-[#6D7E89] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= STAT ITEM ================= */
function StatItem({ target, suffix, label }) {
  const { value, ref } = useCountUp(target);
  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-heading font-bold text-[#8BCB2A]">
        {value}<span>{suffix}</span>
      </p>
      <p className="text-xs uppercase tracking-[0.15em] text-white/60 mt-2">{label}</p>
    </div>
  );
}

/* ================= COLLABORATE ================= */
const ECOSYSTEM_NODES = [
  { Icon: HeartHandshake, title: 'NGOs', sub: 'Community & Development' },
  { Icon: Building2, title: 'Companies', sub: 'Private Sector' },
  { Icon: School, title: 'Institutions', sub: 'Education & Research' },
  { Icon: Handshake, title: 'Investors', sub: 'Funding & Support' },
  { Icon: Users, title: 'Experts', sub: 'Mentors & Specialists' },
  { Icon: GraduationCap, title: 'Schools', sub: 'TVET & Secondary' },
];

const COLLAB_CARDS = [
  { Icon: Handshake, num: '01', title: 'Strategic Partnerships', desc: 'Work with NCG on long-term technology, education, innovation, and community initiatives.', tags: ['Long-term', 'Impact', 'Ecosystem'], color: '#064B7A', link: '/features/strategic' },
  { Icon: Building2, num: '02', title: 'Corporate Collaboration', desc: 'Partner with NCG to develop solutions, support talent, sponsor programs.', tags: ['Business', 'Talent', 'Innovation'], color: '#8BCB2A', link: '/features/corporate' },
  { Icon: Globe2, num: '03', title: 'NGO & Development', desc: 'Collaborate on ICT education, digital inclusion, and technology-for-impact.', tags: ['Social', 'Inclusion', 'Empowerment'], color: '#F39C12', link: '/features/ngo' },
  { Icon: School, num: '04', title: 'Schools & TVET', desc: 'Partner with schools to deliver ICT education and practical skills training.', tags: ['Education', 'Skills', 'Youth'], color: '#9B59B6', link: '/features/schools' },
  { Icon: HeartHandshake, num: '05', title: 'Investment & Sponsorship', desc: 'Support promising projects, programs, startups, and initiatives.', tags: ['Funding', 'Startups', 'Growth'], color: '#16A085', link: '/features/investment' },
  { Icon: Users, num: '06', title: 'Knowledge & Expertise', desc: 'Contribute as a mentor, trainer, researcher, or industry professional.', tags: ['Mentorship', 'Training', 'Research'], color: '#E67E22', link: '/features/expert' },
  { Icon: GraduationCap, num: '07', title: 'Education & Talent', desc: 'Help create opportunities through training, internships, and mentorship.', tags: ['Training', 'Internships', 'Scholarships'], color: '#E91E63', link: '/features/education' },
  { Icon: Lightbulb, num: '08', title: 'Innovation Collaboration', desc: 'Bring a problem, idea, or opportunity and work with NCG to prototype.', tags: ['Prototyping', 'R&D', 'Solutions'], color: '#E74C3C', link: '/features/innovation' },
];

function Collaborate() {
  return (
    <section className="relative overflow-hidden bg-[#031B2A] text-white py-20 md:py-28">
      <div className="relative container-ncg">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] mb-3">
            <Handshake className="w-4 h-4" /> Collaborate With NCG
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
            Together, We Can Advance{' '}
            <span className="bg-gradient-to-r from-[#8BCB2A] to-[#A8D94A] bg-clip-text text-transparent">
              Technology & Innovation
            </span>{' '}
            in Rwanda
          </h2>
          <p className="text-white/60 text-base md:text-lg leading-relaxed">
            NCG collaborates with NGOs, companies, educational institutions, technology
            organizations, investors, development partners, and individual supporters.
          </p>
        </div>

        {/* Ecosystem diagram */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {ECOSYSTEM_NODES.slice(0, 3).map(({ Icon, title, sub }, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center hover:bg-white/10 transition-all">
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
          <div className="grid grid-cols-3 gap-3">
            {ECOSYSTEM_NODES.slice(3, 6).map(({ Icon, title, sub }, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 text-center hover:bg-white/10 transition-all">
                <Icon className="w-7 h-7 text-[#8BCB2A] mx-auto mb-2" />
                <h4 className="font-heading font-semibold text-sm text-white mb-0.5">{title}</h4>
                <p className="text-[10px] text-white/50">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 8 collab cards — all link to /features/* */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {COLLAB_CARDS.map(({ Icon, num, title, desc, tags, color, link }, i) => (
            <Link key={i} to={link} className="group relative bg-white/[0.04] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.08] hover:border-[#8BCB2A]/20 hover:-translate-y-1.5 transition-all">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <span className="font-heading font-bold text-2xl text-white/10">{num}</span>
              </div>
              <h4 className="font-heading font-semibold text-white text-base mb-2.5">{title}</h4>
              <p className="text-[13px] text-white/60 leading-relaxed mb-4">{desc}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {tags.map((t, ti) => (
                  <span key={ti} className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">{t}</span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8BCB2A] hover:gap-2.5 transition-all">
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14">
          <StatItem target={50} suffix="+" label="Active Partnerships" />
          <StatItem target={1000} suffix="+" label="Students Impacted" />
          <StatItem target={25} suffix="+" label="Schools & Institutions" />
          <StatItem target={15} suffix="+" label="Corporate Partners" />
        </div>

        {/* CTA */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
            Let's Build a Stronger ICT & Innovation Ecosystem Together
          </h3>
          <p className="text-white/60 max-w-2xl mx-auto mb-8">
            Whether you want to support young talent, develop a technology project, sponsor an
            educational program, or contribute your expertise — there is an opportunity to work with NCG.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-6 py-3 rounded-lg hover:bg-[#A8D94A] transition-all">
              <Handshake className="w-4 h-4" /> Become a Partner
            </Link>
            <Link to="/donate" className="inline-flex items-center gap-2 border-2 border-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/5 hover:border-[#8BCB2A] transition-all">
              <HeartHandshake className="w-4 h-4" /> Support an Initiative
            </Link>
            <Link to="/contact?purpose=collaboration" className="inline-flex items-center gap-2 border-2 border-white/20 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/5 hover:border-[#8BCB2A] transition-all">
              <Send className="w-4 h-4" /> Start a Collaboration
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= PROGRAMS PREVIEW ================= */
function ProgramsPreview() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/programs?limit=5')
      .then((res) => setPrograms(res.data || []))
      .catch(() => setPrograms([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (programs.length === 0) return null;

  const ICONS = { bootcamp: Rocket, internship: Briefcase, online: BookOpen, coaching: Target, tutoring: HomeIcon };

  return (
    <section className="section bg-[#F5F9FB]">
      <div className="container-ncg">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">NCG Programs</span>
          <h2 className="section-title">Learn. Build. <span className="text-[#8BCB2A]">Experience.</span> Grow.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-12">
          {programs.map((p) => {
            const Icon = ICONS[p.category] || BookOpen;
            return (
              <Link key={p.id} to={`/programs/${p.slug}`} className="group card p-6 text-center hover:shadow-xl hover:-translate-y-1.5 transition-all">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#F5F9FB] to-[#EDF2F5] flex items-center justify-center group-hover:from-[#8BCB2A]/10 transition-colors">
                  <Icon className="w-7 h-7 text-[#064B7A] group-hover:text-[#8BCB2A] transition-colors" />
                </div>
                <h3 className="font-heading font-semibold text-base text-[#031B2A] mb-1.5">{p.name}</h3>
                <p className="text-xs text-[#6D7E89] leading-relaxed mb-3">{p.descriptionShort}</p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8BCB2A]">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            );
          })}
        </div>
        <div className="text-center">
          <Link to="/programs" className="inline-flex items-center gap-2 bg-[#064B7A] text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-[#062F4A] transition-all">
            View All Programs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================= IMPACT NUMBERS ================= */
function ImpactNumbers() {
  const NUMBERS = [
    { target: 4, suffix: '+', label: 'Innovation Projects' },
    { target: 5, suffix: '+', label: 'Technology Areas' },
    { target: 50, suffix: '+', label: 'Learners Reached' },
    { target: 10, suffix: '+', label: 'Startups Supported' },
  ];
  return (
    <section className="section bg-white">
      <div className="container-ncg">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">Our Impact So Far</span>
          <h2 className="section-title">Making a <span className="text-[#8BCB2A]">Difference</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {NUMBERS.map((n, i) => (
            <BigNumber key={i} {...n} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BigNumber({ target, suffix, label }) {
  const { value, ref } = useCountUp(target);
  return (
    <div ref={ref} className="text-center">
      <p className="text-5xl md:text-6xl font-heading font-bold text-[#031B2A]">
        {value}<span className="text-[#8BCB2A]">{suffix}</span>
      </p>
      <p className="text-sm uppercase tracking-[0.15em] text-[#6D7E89] mt-2 font-medium">{label}</p>
    </div>
  );
}

/* ================= TEAM PREVIEW ================= */
function TeamPreview() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/team?limit=4')
      .then((res) => setMembers(res.data || []))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (members.length === 0) return null;

  return (
    <section className="section bg-[#F5F9FB]">
      <div className="container-ncg">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">Meet the Team</span>
          <h2 className="section-title">The People Behind <span className="text-[#8BCB2A]">NCG</span></h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {members.map((m) => (
            <div key={m.id} className="text-center group">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white group-hover:border-[#8BCB2A] transition-all group-hover:scale-105">
                {m.profileImageUrl ? (
                  <img src={m.profileImageUrl} alt={m.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#064B7A] to-[#8BCB2A] flex items-center justify-center">
                    <User2 className="w-16 h-16 text-white/70" />
                  </div>
                )}
              </div>
              <h4 className="font-heading font-semibold text-base text-[#031B2A] mb-1">{m.fullName}</h4>
              <p className="text-xs text-[#6D7E89]">{m.position}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/team" className="inline-flex items-center gap-2 bg-[#064B7A] text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-[#062F4A] transition-all">
            Meet the NCG Team <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================= TESTIMONIALS ================= */
function Testimonials() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/content/testimonials?featured=true')
      .then((res) => setItems((res.data || []).slice(0, 3)))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="section bg-white">
      <div className="container-ncg">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">Testimonials</span>
          <h2 className="section-title">What People Say <span className="text-[#8BCB2A]">About NCG</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t) => (
            <div key={t.id} className="relative card p-7 hover:shadow-xl hover:-translate-y-1 transition-all">
              <Quote className="absolute top-5 right-6 w-10 h-10 text-[#8BCB2A]/20" />
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating || 5)].map((_, si) => (
                  <Star key={si} className="w-4 h-4 fill-[#8BCB2A] text-[#8BCB2A]" />
                ))}
              </div>
              <p className="text-[#163247] leading-relaxed mb-6 text-[15px]">"{t.content}"</p>
              <div className="flex items-center gap-3 pt-5 border-t border-[#EDF2F5]">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#064B7A] to-[#8BCB2A] flex items-center justify-center">
                  <User2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm text-[#031B2A]">{t.name}</p>
                  <p className="text-xs text-[#6D7E89]">{t.position}{t.company ? `, ${t.company}` : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= ETHICS ================= */
function Ethics() {
  const COMMITMENTS = [
    { Icon: ShieldCheck, title: 'Integrity', desc: 'We act honestly and responsibly in our decisions, partnerships, and work.' },
    { Icon: Lock, title: 'Privacy & Security', desc: 'We respect data privacy and prioritize the security of systems and information.' },
    { Icon: Lightbulb, title: 'Responsible Innovation', desc: 'We consider the social, economic, and environmental consequences of the technologies we develop.' },
    { Icon: Users, title: 'Inclusivity & Respect', desc: 'We value diverse perspectives and create opportunities for people to learn and contribute.' },
    { Icon: Star, title: 'Professional Excellence', desc: 'We take responsibility for the quality, reliability, and continuous improvement of our work.' },
    { Icon: Handshake, title: 'Accountability', desc: 'We stand behind our decisions and remain accountable to our clients, partners, team, and communities.' },
  ];

  return (
    <section className="section bg-[#F5F9FB]">
      <div className="container-ncg">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">Ethics & Integrity</span>
          <h2 className="section-title">Technology Built on <span className="text-[#8BCB2A]">Trust</span></h2>
          <p className="text-[#6D7E89] mb-4">
            At NEXT Creatures Group Ltd, we believe meaningful innovation must be guided by integrity,
            responsibility, respect, and accountability.
          </p>
          <p className="text-[#031B2A] font-medium">
            <strong>Our principle:</strong> Innovate with purpose. Build with integrity. Create lasting impact.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {COMMITMENTS.map(({ Icon, title, desc }, i) => (
            <div key={i} className="flex gap-4 p-6 rounded-xl border border-[#EDF2F5] bg-white hover:border-[#8BCB2A]/40 transition-all">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#8BCB2A]/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#8BCB2A]" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-base text-[#031B2A] mb-1.5">{title}</h3>
                <p className="text-sm text-[#6D7E89] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= FINAL CTA ================= */
function FinalCTA() {
  return (
    <section className="section bg-gradient-to-br from-[#031B2A] via-[#062F4A] to-[#064B7A] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-[#8BCB2A] blur-[120px]" />
      </div>
      <div className="relative container-ncg text-center">
        <span className="inline-block text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] mb-4">Let's Create</span>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
          Have a Problem <span className="text-[#8BCB2A]">Worth Solving?</span>
        </h2>
        <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
          Tell us about your challenge, idea, project, or opportunity. Let's explore
          what technology can make possible.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register" className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-7 py-3.5 rounded-lg hover:bg-[#A8D94A] transition-all">
            <Send className="w-4 h-4" /> Get Started
          </Link>
          <Link to="/contact?purpose=general" className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white hover:text-[#064B7A] transition-all">
            <Handshake className="w-4 h-4" /> Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================= PAGE ================= */
export default function Home() {
  return (
    <>
      <Hero />
      <Different />
      <Collaborate />
      <ProgramsPreview />
      <ImpactNumbers />
      <TeamPreview />
      <Testimonials />
      <Ethics />
      <FinalCTA />
    </>
  );
}