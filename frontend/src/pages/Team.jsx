// src/pages/Team.jsx
import { useEffect, useState } from 'react';
import api from '../lib/api';
import { User2 } from 'lucide-react';

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/team')
      .then((res) => setTeam(res.data || []))
      .catch(() => setTeam([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section bg-[#F5F9FB]">
      <div className="container-ncg">
        <div className="text-center mb-12">
          <h1 className="section-title">Our Team</h1>
          <p className="section-subtitle">The people building Africa's tech future.</p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-4 border-[#8BCB2A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : team.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-[#6D7E89]">Team members will be added by our admin soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {team.map((m) => (
              <div key={m.id} className="card p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#064B7A] to-[#8BCB2A] flex items-center justify-center overflow-hidden">
                  {m.profileImageUrl ? (
                    <img src={m.profileImageUrl} alt={m.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <User2 className="w-12 h-12 text-white" />
                  )}
                </div>
                <h3 className="font-heading font-semibold text-lg text-[#031B2A] mb-1">{m.fullName}</h3>
                <p className="text-sm text-[#6D7E89] mb-2">{m.position}</p>
                {m.location && <p className="text-xs text-[#A8BBC5]">{m.location}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}