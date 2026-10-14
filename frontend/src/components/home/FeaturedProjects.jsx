// src/components/home/FeaturedProjects.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, TrafficCone, Home as HomeIcon, ArrowRight } from 'lucide-react';
import api from '../../lib/api';

const FALLBACK = [
  {
    id: '1', slug: 'smart-irrigation',
    title: 'Smart IoT Irrigation System',
    descriptionShort: 'An intelligent system designed to improve water management through sensors, automation, and connected technology.',
    category: 'IoT • Embedded • Agriculture',
    Icon: Droplets,
    gradient: 'from-[#064B7A] to-[#0A7188]',
  },
  {
    id: '2', slug: 'smart-traffic',
    title: 'Smart Traffic Monitoring',
    descriptionShort: 'Technology-driven monitoring and visualization for smarter traffic management and urban planning.',
    category: 'Software • Data • Smart Systems',
    Icon: TrafficCone,
    gradient: 'from-[#0D537B] to-[#062E49]',
  },
  {
    id: '3', slug: 'smart-home',
    title: 'Smart Home Automation',
    descriptionShort: 'Integrated home automation system connecting lighting, security, energy, and climate control.',
    category: 'IoT • Automation • Smart Home',
    Icon: HomeIcon,
    gradient: 'from-[#8BCB2A] to-[#4D8E26]',
  },
];

function getIconForCategory(category = '') {
  const c = category.toLowerCase();
  if (c.includes('agri') || c.includes('irrigation')) return { Icon: Droplets, gradient: 'from-[#064B7A] to-[#0A7188]' };
  if (c.includes('traffic')) return { Icon: TrafficCone, gradient: 'from-[#0D537B] to-[#062E49]' };
  if (c.includes('home')) return { Icon: HomeIcon, gradient: 'from-[#8BCB2A] to-[#4D8E26]' };
  return { Icon: Droplets, gradient: 'from-[#064B7A] to-[#0A7188]' };
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState(FALLBACK);

  useEffect(() => {
    api.get('/projects?featured=true&limit=3')
      .then((res) => {
        const items = res.data || [];
        if (items.length > 0) {
          const mapped = items.slice(0, 3).map((p) => {
            const { Icon, gradient } = getIconForCategory(p.category);
            return {
              id: p.id, slug: p.slug, title: p.title,
              descriptionShort: p.descriptionShort,
              category: p.category || 'Project',
              Icon, gradient,
            };
          });
          setProjects(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section bg-white">
      <div className="container-ncg">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
            Featured Projects
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A] mb-4">
            What We're <span className="text-[#8BCB2A]">Building</span>
          </h2>
          <p className="text-[#6D7E89]">
            Real projects demonstrating our technical capabilities and problem-solving approach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(({ id, slug, title, descriptionShort, category, Icon, gradient }, i) => (
            <div key={id || i} className="group bg-white border border-[#EDF2F5] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-[#064B7A]/10 hover:-translate-y-2 transition-all duration-500">
              <div className={`relative h-52 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
                </div>
                <Icon className="relative w-16 h-16 text-white/90 group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20">
                  {category}
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-heading font-semibold text-lg text-[#031B2A] mb-3 group-hover:text-[#064B7A] transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-[#6D7E89] leading-relaxed mb-5">
                  {descriptionShort}
                </p>
                <Link
                  to={`/projects/${slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#064B7A] hover:text-[#8BCB2A] transition-colors"
                >
                  View Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}