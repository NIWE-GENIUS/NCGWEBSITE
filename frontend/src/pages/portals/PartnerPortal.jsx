// src/pages/portals/PartnerPortal.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Users, FileText, Handshake, TrendingUp,
  ArrowRight, Settings as SettingsIcon, Plus,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import StatCard from '../../components/dashboard/StatCard';

export default function PartnerPortal() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ collaborations: 0, documents: 0, activePartnerships: 0 });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/collaborations?limit=1').catch(() => null);
        setStats({
          collaborations: res?.meta?.pagination?.total || 0,
          documents: 0,
          activePartnerships: 0,
        });
      } catch (_) {}
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F9FB]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#064B7A] via-[#062F4A] to-[#031B2A] text-white">
        <div className="container-ncg py-14">
          <div className="flex items-start gap-6 flex-wrap">
            <img src="/logo.png" alt="NCG" className="h-20 w-auto bg-white/95 rounded-lg p-2" />
            <div className="flex-1 min-w-[250px]">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#8BCB2A] font-bold mb-2">
                <Building2 className="w-4 h-4" /> Partner Portal
              </span>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                Welcome, {user?.firstName || 'Partner'}
              </h1>
              <p className="text-white/70">
                Manage your partnership, collaborations, and documents with NCG.
              </p>
            </div>
            <Link
              to="/collaboration"
              className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#A8D94A]"
            >
              <Plus className="w-4 h-4" /> New Collaboration
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container-ncg -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Handshake} label="Active Partnerships" value={stats.activePartnerships} color="#064B7A" />
          <StatCard icon={TrendingUp} label="Collaborations" value={stats.collaborations} color="#8BCB2A" />
          <StatCard icon={FileText} label="Documents" value={stats.documents} color="#F39C12" />
          <StatCard icon={Users} label="Team Access" value="0" color="#9B59B6" />
        </div>
      </div>

      {/* Cards */}
      <div className="container-ncg py-10 grid lg:grid-cols-3 gap-6">
        <Link
          to="/collaboration"
          className="bg-white border border-[#EDF2F5] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
        >
          <Handshake className="w-10 h-10 text-[#064B7A] mb-4" />
          <h3 className="font-heading font-bold text-lg text-[#031B2A] mb-2">My Collaborations</h3>
          <p className="text-sm text-[#6D7E89] mb-4">View and manage your active collaborations with NCG.</p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#064B7A] group-hover:text-[#8BCB2A]">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          to="/dashboard/documents"
          className="bg-white border border-[#EDF2F5] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
        >
          <FileText className="w-10 h-10 text-[#F39C12] mb-4" />
          <h3 className="font-heading font-bold text-lg text-[#031B2A] mb-2">Documents</h3>
          <p className="text-sm text-[#6D7E89] mb-4">Agreements, contracts, and shared files.</p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#064B7A] group-hover:text-[#8BCB2A]">
            Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          to="/dashboard/settings"
          className="bg-white border border-[#EDF2F5] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
        >
          <SettingsIcon className="w-10 h-10 text-[#9B59B6] mb-4" />
          <h3 className="font-heading font-bold text-lg text-[#031B2A] mb-2">Portal Settings</h3>
          <p className="text-sm text-[#6D7E89] mb-4">Configure your partner account preferences.</p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#064B7A] group-hover:text-[#8BCB2A]">
            Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>

      {/* CTA */}
      <div className="container-ncg pb-14">
        <div className="bg-white border border-[#EDF2F5] rounded-2xl p-8 text-center">
          <h2 className="font-heading font-bold text-2xl text-[#031B2A] mb-3">
            Ready to Grow Your Partnership?
          </h2>
          <p className="text-[#6D7E89] max-w-2xl mx-auto mb-6">
            Explore new collaboration opportunities or schedule a strategy session with the NCG team.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/collaboration"
              className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-6 py-3 rounded-md hover:bg-[#A8D94A]"
            >
              Explore Collaborations
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border-2 border-[#064B7A] text-[#064B7A] font-semibold px-6 py-3 rounded-md hover:bg-[#064B7A] hover:text-white transition-colors"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}