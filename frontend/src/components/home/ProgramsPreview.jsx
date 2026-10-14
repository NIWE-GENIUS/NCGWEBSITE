// src/components/home/ProgramsPreview.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Briefcase, BookOpen, Target, Home as HomeIcon, ArrowRight } from 'lucide-react';
import api from '../../lib/api';

const FALLBACK = [
  { id: '1', slug: 'bootcamp', name: 'Bootcamp', descriptionShort: 'Intensive practical learning', Icon: Rocket },
  { id: '2', slug: 'internship', name: 'Internship', descriptionShort: 'Real-world professional experience', Icon: Briefcase },
  { id: '3', slug: 'online-learning', name: 'Online Learning', descriptionShort: 'Learn technology from anywhere', Icon: BookOpen },
  { id: '4', slug: 'coaching', name: 'Coaching', descriptionShort: 'Personal guidance for your goals', Icon: Target },
  { id: '5', slug: 'private-tutoring', name: 'Private Tutoring', descriptionShort: 'Focused one-to-one learning', Icon: HomeIcon },
];

function iconForCategory(cat = '', name = '') {
  const c = (cat + ' ' + name).toLowerCase();
  if (c.includes('bootcamp')) return Rocket;
  if (c.includes('intern')) return Briefcase;
  if (c.includes('online') || c.includes('course')) return BookOpen;
  if (c.includes('coach')) return Target;
  if (c.includes('tutor')) return HomeIcon;
  return BookOpen;
}

export default function ProgramsPreview() {
  const [programs, setPrograms] = useState(FALLBACK);

  useEffect(() => {
    api.get('/programs?limit=5')
      .then((res) => {
        const items = res.data || [];
        if (items.length > 0) {
          setPrograms(items.slice(0, 5).map((p) => ({
            id: p.id, slug: p.slug, name: p.name,
            descriptionShort: p.descriptionShort,
            Icon: iconForCategory(p.category, p.name),
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section bg-[#F5F9FB]">
      <div className="container-ncg">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
            NCG Programs
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A] mb-4">
            Learn. Build. <span className="text-[#8BCB2A]">Experience.</span> Grow.
          </h2>
          <p className="text-[#6D7E89]">
            NCG creates pathways for people at different stages of their technology journey.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-12">
          {programs.map(({ id, slug, name, descriptionShort, Icon }, i) => (
            <Link
              key={id || i}
              to={`/programs/${slug}`}
              className="group bg-white border border-[#EDF2F5] rounded-xl p-6 text-center hover:shadow-xl hover:shadow-[#064B7A]/5 hover:-translate-y-1.5 hover:border-[#8BCB2A]/40 transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#F5F9FB] to-[#EDF2F5] flex items-center justify-center group-hover:from-[#8BCB2A]/10 group-hover:to-[#8BCB2A]/5 transition-colors">
                <Icon className="w-7 h-7 text-[#064B7A] group-hover:text-[#8BCB2A] transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-base text-[#031B2A] mb-1.5">{name}</h3>
              <p className="text-xs text-[#6D7E89] leading-relaxed mb-3">{descriptionShort}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8BCB2A]">
                Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 bg-[#064B7A] text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-[#062F4A] hover:translate-y-[-2px] transition-all"
          >
            View All Programs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}