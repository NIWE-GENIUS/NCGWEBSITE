// src/pages/dashboard/DashboardHome.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, MessageSquare, Award, Briefcase, ArrowRight,
  CheckCircle2, Clock, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/api';
import StatCard from '../../components/dashboard/StatCard';

export default function DashboardHome() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [appsRes, notifRes] = await Promise.all([
          api.get('/applications/mine?limit=5').catch(() => ({ data: [] })),
          api.get('/notifications?limit=5').catch(() => ({ data: [] })),
        ]);
        setApplications(appsRes.data || []);
        setNotifications(notifRes.data || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <div className="bg-gradient-to-br from-[#064B7A] to-[#031B2A] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[#8BCB2A] blur-3xl" />
        </div>
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-[#8BCB2A] font-bold mb-2">
            Your Journey
          </p>
          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">
            Welcome back, {user?.firstName || 'User'} 👋
          </h1>
          <p className="text-white/70 text-sm max-w-2xl">
            Here's what's happening with your NCG journey. Track your applications,
            learning progress, and connect with the NCG community.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Applications"
          value={applications.length}
          color="#064B7A"
        />
        <StatCard
          icon={Award}
          label="Certificates"
          value={0}
          color="#8BCB2A"
        />
        <StatCard
          icon={MessageSquare}
          label="Messages"
          value={0}
          color="#F39C12"
        />
        <StatCard
          icon={Briefcase}
          label="Opportunities"
          value={0}
          color="#9B59B6"
        />
      </div>

      {/* Grid: Applications + Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent applications */}
        <div className="bg-white border border-[#EDF2F5] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-lg text-[#031B2A]">
              Recent Applications
            </h2>
            <Link
              to="/dashboard/applications"
              className="text-xs font-semibold text-[#064B7A] hover:text-[#8BCB2A] inline-flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-[#6D7E89] mb-4">No applications yet.</p>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-4 py-2 rounded-md text-sm"
              >
                Explore Programs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <li
                  key={app.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#F5F9FB]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#8BCB2A]/15 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-[#8BCB2A]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[#031B2A] truncate">
                      {app.program?.name || 'Program'}
                    </p>
                    <p className="text-xs text-[#6D7E89]">
                      {app.applicationId} · {app.status}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      app.status === 'accepted'
                        ? 'bg-[#8BCB2A]/15 text-[#6CA51A]'
                        : app.status === 'rejected'
                        ? 'bg-red-50 text-[#E74C3C]'
                        : 'bg-[#F39C12]/15 text-[#E67E22]'
                    }`}
                  >
                    {app.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Activity feed */}
        <div className="bg-white border border-[#EDF2F5] rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-bold text-lg text-[#031B2A]">
              Recent Activity
            </h2>
          </div>

          <ul className="space-y-4">
            {[
              { icon: CheckCircle2, text: 'Account created', color: '#8BCB2A' },
              { icon: Clock, text: 'Profile setup pending', color: '#F39C12' },
              { icon: TrendingUp, text: 'Explore programs to begin', color: '#3498DB' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}15` }}
                >
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-sm text-[#163247]">{item.text}</p>
                  <p className="text-xs text-[#6D7E89]">Today</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { to: '/programs', label: 'Explore Programs', icon: FileText, color: '#064B7A' },
          { to: '/collaboration', label: 'Collaborate', icon: Briefcase, color: '#8BCB2A' },
          { to: '/contact', label: 'Contact Us', icon: MessageSquare, color: '#F39C12' },
        ].map((action, i) => (
          <Link
            key={i}
            to={action.to}
            className="group bg-white border border-[#EDF2F5] rounded-xl p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center"
              style={{ background: `${action.color}15` }}
            >
              <action.icon className="w-5 h-5" style={{ color: action.color }} />
            </div>
            <span className="font-semibold text-sm text-[#031B2A] flex-1">
              {action.label}
            </span>
            <ArrowRight className="w-4 h-4 text-[#6D7E89] group-hover:text-[#8BCB2A] group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}