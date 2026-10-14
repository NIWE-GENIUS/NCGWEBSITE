// src/pages/portals/DonorPortal.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Receipt, TrendingUp, ArrowRight, Settings as SettingsIcon,
  Award, Plus,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import StatCard from '../../components/dashboard/StatCard';

export default function DonorPortal() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalDonated: 0, donationCount: 0, impactLevel: 'Friend' });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/donations/admin/stats').catch(() => null);
        setStats({
          totalDonated: res?.data?.total_amount || 0,
          donationCount: res?.data?.total_count || 0,
          impactLevel: 'Friend',
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
                <Heart className="w-4 h-4" /> Donor Portal
              </span>
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                Thank you, {user?.firstName || 'Donor'}!
              </h1>
              <p className="text-white/70">
                Track your donations, download receipts, and see the impact you're creating.
              </p>
            </div>
            <Link
              to="/donate/give"
              className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#A8D94A]"
            >
              <Plus className="w-4 h-4" /> Make a Donation
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container-ncg -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Heart}
            label="Total Donated"
            value={`${(stats.totalDonated || 0).toLocaleString()} RWF`}
            color="#E74C3C"
          />
          <StatCard icon={Receipt} label="Donations" value={stats.donationCount} color="#064B7A" />
          <StatCard icon={Award} label="Recognition Level" value={stats.impactLevel} color="#F39C12" />
          <StatCard icon={TrendingUp} label="Lives Impacted" value="—" color="#8BCB2A" />
        </div>
      </div>

      {/* Cards */}
      <div className="container-ncg py-10 grid lg:grid-cols-3 gap-6">
        <Link
          to="/donate"
          className="bg-white border border-[#EDF2F5] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
        >
          <Heart className="w-10 h-10 text-[#E74C3C] mb-4" />
          <h3 className="font-heading font-bold text-lg text-[#031B2A] mb-2">My Donations</h3>
          <p className="text-sm text-[#6D7E89] mb-4">View all your contributions and impact reports.</p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#064B7A] group-hover:text-[#8BCB2A]">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          to="/dashboard/documents"
          className="bg-white border border-[#EDF2F5] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
        >
          <Receipt className="w-10 h-10 text-[#F39C12] mb-4" />
          <h3 className="font-heading font-bold text-lg text-[#031B2A] mb-2">Receipts</h3>
          <p className="text-sm text-[#6D7E89] mb-4">Download tax receipts for your donations.</p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#064B7A] group-hover:text-[#8BCB2A]">
            Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        <Link
          to="/dashboard/settings"
          className="bg-white border border-[#EDF2F5] rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group"
        >
          <SettingsIcon className="w-10 h-10 text-[#9B59B6] mb-4" />
          <h3 className="font-heading font-bold text-lg text-[#031B2A] mb-2">Preferences</h3>
          <p className="text-sm text-[#6D7E89] mb-4">Manage your communication preferences.</p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#064B7A] group-hover:text-[#8BCB2A]">
            Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>

      {/* Impact CTA */}
      <div className="container-ncg pb-14">
        <div className="bg-gradient-to-br from-[#8BCB2A] to-[#6CA51A] rounded-2xl p-8 text-center text-[#031B2A]">
          <h2 className="font-heading font-bold text-2xl mb-3">Your Impact So Far</h2>
          <p className="max-w-2xl mx-auto mb-6 text-[#031B2A]/80">
            Your generosity supports technology education, innovation projects, and youth empowerment
            across Rwanda. Thank you for making a difference.
          </p>
          <Link
            to="/donate"
            className="inline-flex items-center gap-2 bg-[#031B2A] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#062F4A]"
          >
            <Heart className="w-4 h-4" /> Give Again
          </Link>
        </div>
      </div>
    </div>
  );
}