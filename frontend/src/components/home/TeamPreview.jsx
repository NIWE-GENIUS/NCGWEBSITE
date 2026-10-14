// src/components/home/TeamPreview.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle2, ArrowRight } from 'lucide-react';
import api from '../../lib/api';

const FALLBACK = [
  { id: '1', fullName: 'Service Manager', position: 'Service Development & Project Coordination' },
  { id: '2', fullName: 'Technology Lead', position: 'Technical Architecture & Engineering' },
  { id: '3', fullName: 'Communication Officer', position: 'Communication & Digital Presence' },
  { id: '4', fullName: 'Creative Lead', position: 'Animation & Visual Storytelling' },
];

export default function TeamPreview() {
  const [members, setMembers] = useState(FALLBACK);

  useEffect(() => {
    api.get('/team?limit=4')
      .then((res) => {
        const items = res.data || [];
        if (items.length > 0) {
          setMembers(items.slice(0, 4).map((m) => ({
            id: m.id,
            fullName: m.fullName,
            position: m.position,
            imageUrl: m.profileImageUrl,
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="section bg-white">
      <div className="container-ncg">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8BCB2A] block mb-3">
            Meet the Team
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#031B2A] mb-4">
            The People Behind <span className="text-[#8BCB2A]">NCG</span>
          </h2>
          <p className="text-[#6D7E89]">
            NCG is powered by young innovators, developers, engineers, creatives, researchers, and
            entrepreneurs working toward one mission.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {members.map((m, i) => (
            <div key={m.id || i} className="text-center group">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#F5F9FB] group-hover:border-[#8BCB2A] transition-all duration-300 group-hover:scale-105">
                {m.imageUrl ? (
                  <img src={`http://localhost:5000${m.imageUrl}`} alt={m.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#064B7A] to-[#8BCB2A] flex items-center justify-center">
                    <UserCircle2 className="w-16 h-16 text-white/70" />
                  </div>
                )}
              </div>
              <h4 className="font-heading font-semibold text-base text-[#031B2A] mb-1">
                {m.fullName}
              </h4>
              <p className="text-xs text-[#6D7E89] leading-relaxed">{m.position}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/team"
            className="inline-flex items-center gap-2 bg-[#064B7A] text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-[#062F4A] hover:translate-y-[-2px] transition-all"
          >
            Meet the NCG Team
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}