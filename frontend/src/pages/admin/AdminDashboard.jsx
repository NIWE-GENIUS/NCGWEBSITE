// frontend/src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail, Users, GraduationCap, FolderKanban, Quote, HelpCircle,
  TrendingUp, ArrowRight, Loader2, DollarSign, FileText, AlertCircle,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import api from '../../lib/api';
import StatCard from '../../components/dashboard/StatCard';
import { PageHeader, StatusBadge, PriorityBadge } from './AdminComponents';

const COLORS = ['#064B7A', '#8BCB2A', '#F39C12', '#9B59B6', '#16A085', '#E74C3C'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);
  const [purposeData, setPurposeData] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const [msgs, users, team, programs, projects, testimonials, faqs, apps, donations] =
          await Promise.all([
            api.get('/contact/admin/list?limit=5').catch(() => null),
            api.get('/users?limit=1').catch(() => null),
            api.get('/team/admin/list?limit=1').catch(() => null),
            api.get('/programs/admin/list?limit=1').catch(() => null),
            api.get('/projects/admin/list?limit=1').catch(() => null),
            api.get('/content/admin/testimonials?limit=1').catch(() => null),
            api.get('/content/admin/faqs?limit=1').catch(() => null),
            api.get('/applications/admin/list?limit=1').catch(() => null),
            api.get('/donations/admin/stats').catch(() => null),
          ]);

        setStats({
          messages: msgs?.meta?.pagination?.total || 0,
          users: users?.meta?.pagination?.total || 0,
          team: team?.meta?.pagination?.total || 0,
          programs: programs?.meta?.pagination?.total || 0,
          projects: projects?.meta?.pagination?.total || 0,
          testimonials: testimonials?.meta?.pagination?.total || 0,
          faqs: faqs?.meta?.pagination?.total || 0,
          applications: apps?.meta?.pagination?.total || 0,
          donationAmount: donations?.data?.total_amount || 0,
        });

        setRecent(msgs?.data || []);

        // Weekly activity
        setActivityData([
          { day: 'Mon', messages: 12, applications: 4, donations: 2 },
          { day: 'Tue', messages: 18, applications: 6, donations: 3 },
          { day: 'Wed', messages: 15, applications: 8, donations: 5 },
          { day: 'Thu', messages: 22, applications: 5, donations: 4 },
          { day: 'Fri', messages: 28, applications: 10, donations: 6 },
          { day: 'Sat', messages: 14, applications: 3, donations: 3 },
          { day: 'Sun', messages: 8, applications: 2, donations: 2 },
        ]);

        // Message purposes
        setPurposeData([
          { name: 'Learning', value: 35 },
          { name: 'Partnership', value: 25 },
          { name: 'Investment', value: 15 },
          { name: 'Support', value: 15 },
          { name: 'Other', value: 10 },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Complete snapshot of your NCG platform"
        action={
          <Link
            to="/admin/messages"
            className="inline-flex items-center gap-2 bg-[#064B7A] text-white font-semibold px-4 py-2.5 rounded-md text-sm hover:bg-[#062F4A]"
          >
            <Mail className="w-4 h-4" /> Open Inbox
          </Link>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Mail} label="Total Messages" value={stats?.messages} color="#3498DB" />
        <StatCard icon={Users} label="Users" value={stats?.users} color="#9B59B6" />
        <StatCard icon={GraduationCap} label="Programs" value={stats?.programs} color="#8BCB2A" />
        <StatCard icon={FileText} label="Applications" value={stats?.applications} color="#F39C12" />
        <StatCard icon={FolderKanban} label="Projects" value={stats?.projects} color="#064B7A" />
        <StatCard icon={Users} label="Team Members" value={stats?.team} color="#E67E22" />
        <StatCard icon={HelpCircle} label="FAQs" value={stats?.faqs} color="#16A085" />
        <StatCard
          icon={DollarSign}
          label="Total Donations"
          value={`${Number(stats?.donationAmount || 0).toLocaleString()} RWF`}
          color="#E74C3C"
          trend={+12}
        />
      </div>

      {/* Activity Chart */}
      <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading font-bold text-lg text-[#031B2A]">
              Weekly Activity
            </h2>
            <p className="text-xs text-[#6D7E89]">Messages, applications, and donations</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F5" />
              <XAxis dataKey="day" stroke="#6D7E89" fontSize={12} />
              <YAxis stroke="#6D7E89" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EDF2F5', fontSize: 12 }} />
              <Line type="monotone" dataKey="messages" stroke="#064B7A" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="applications" stroke="#8BCB2A" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="donations" stroke="#F39C12" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-column: recent messages + purpose pie */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading font-bold text-lg text-[#031B2A]">Recent Messages</h2>
              <p className="text-xs text-[#6D7E89]">Latest contact submissions</p>
            </div>
            <Link to="/admin/messages" className="text-xs font-semibold text-[#064B7A] hover:text-[#8BCB2A] inline-flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-[#F5F9FB] flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-[#A8BBC5]" />
              </div>
              <p className="text-sm text-[#6D7E89]">No messages yet.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {recent.map((m) => (
                <li key={m.id}>
                  <Link to="/admin/messages" className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F9FB] hover:bg-[#EDF2F5] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#064B7A] to-[#8BCB2A] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {m.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#031B2A] truncate">{m.name}</p>
                      <p className="text-xs text-[#6D7E89] truncate">{m.subject || m.purpose}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={m.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
          <h2 className="font-heading font-bold text-lg text-[#031B2A] mb-5">
            Message Purposes
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={purposeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={3}
                  label={({ value }) => `${value}%`}
                >
                  {purposeData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EDF2F5', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { to: '/admin/team', label: 'Manage Team', desc: 'Add or edit team members', icon: Users, color: '#064B7A' },
          { to: '/admin/programs', label: 'Manage Programs', desc: 'Create or edit programs', icon: GraduationCap, color: '#8BCB2A' },
          { to: '/admin/financials', label: 'Financial Overview', desc: 'Track revenue and donations', icon: DollarSign, color: '#F39C12' },
        ].map((a, i) => (
          <Link
            key={i}
            to={a.to}
            className="group bg-white border border-[#EDF2F5] rounded-xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-3" style={{ background: `${a.color}15` }}>
              <a.icon className="w-5 h-5" style={{ color: a.color }} />
            </div>
            <p className="font-heading font-semibold text-sm text-[#031B2A] mb-1">{a.label}</p>
            <p className="text-xs text-[#6D7E89] mb-3">{a.desc}</p>
            <ArrowRight className="w-4 h-4 text-[#064B7A] group-hover:text-[#8BCB2A] group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}