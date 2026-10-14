// src/pages/Programs.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/programs')
      .then((res) => setPrograms(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section bg-[#F5F9FB]">
      <div className="container-ncg">
        <div className="text-center mb-12">
          <h1 className="section-title">Programs</h1>
          <p className="section-subtitle">Hands-on learning paths to launch and grow your tech career.</p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-4 border-[#8BCB2A] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#6D7E89] mt-3 text-sm">Loading programs...</p>
          </div>
        ) : error ? (
          <div className="card p-8 text-center text-[#E74C3C]">
            <p>{error}</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-[#6D7E89]">Programs coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p) => (
              <Link key={p.id} to={`/programs/${p.slug}`} className="card p-6 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="badge-blue capitalize">{p.category}</span>
                  <span className="badge-green capitalize">{p.format}</span>
                </div>
                <h3 className="font-heading font-semibold text-xl text-[#031B2A] mb-2 group-hover:text-[#064B7A]">{p.name}</h3>
                <p className="text-sm text-[#6D7E89] mb-4 flex-1">{p.descriptionShort}</p>
                <div className="flex items-center justify-between text-sm border-t border-[#EDF2F5] pt-4">
                  <span className="text-[#6D7E89]">{p.duration || 'Flexible'}</span>
                  <span className="font-semibold text-[#064B7A]">
                    {p.price > 0 ? `${Number(p.price).toLocaleString()} ${p.currency}` : 'Free'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}