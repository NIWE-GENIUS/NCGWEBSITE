// src/pages/admin/AdminAnalytics.jsx
import { useEffect, useState } from 'react';
import {
  Users, Mail, TrendingUp, Eye, Loader2, BarChart3, PieChart as PieIcon,
  Activity as ActivityIcon,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import api from '../../lib/api';
import StatCard from '../../components/dashboard/StatCard';
import { PageHeader } from './AdminComponents';

const COLORS = ['#064B7A', '#8BCB2A', '#F39C12', '#9B59B6', '#16A085', '#E74C3C'];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Gather counts from multiple endpoints
        const [usersRes, msgsRes, appsRes, donationsRes] = await Promise.all([
          api.get('/users/stats').catch(() => null),
          api.get('/contact/admin/stats').catch(() => null),
          api.get('/applications/admin/stats').catch(() => null),
          api.get('/donations/admin/stats').catch(() => null),
        ]);

        const usersByRole = usersRes?.data?.byRole || [];
        const msgStats = msgsRes?.data || {};
        const appStats = appsRes?.data || {};
        const donationStats = donationsRes?.data || {};

        // Build weekly message trend (mock — replace with real data when available)
        const weekTrend = [
          { day: 'Mon', messages: 12, applications: 4 },
          { day: 'Tue', messages: 18, applications: 6 },
          { day: 'Wed', messages: 15, applications: 8 },
          { day: 'Thu', messages: 22, applications: 5 },
          { day: 'Fri', messages: 28, applications: 10 },
          { day: 'Sat', messages: 14, applications: 3 },
          { day: 'Sun', messages: 8, applications: 2 },
        ];

        const purposes = [
          { name: 'Learning', value: 40 },
          { name: 'Professional', value: 25 },
          { name: 'Entrepreneur', value: 15 },
          { name: 'Partner', value: 10 },
          { name: 'Invest', value: 6 },
          { name: 'Other', value: 4 },
        ];

        setData({
          users: usersRes?.data || {},
          usersByRole,
          msgStats,
          appStats,
          donationStats,
          weekTrend,
          purposes,
        });
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
        title="Analytics"
        subtitle="Real-time insights across your NCG platform"
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={data?.users?.total || 0}
          color="#064B7A"
          trend={+12}
        />
        <StatCard
          icon={Mail}
          label="Total Messages"
          value={data?.msgStats?.total || 0}
          color="#3498DB"
        />
        <StatCard
          icon={TrendingUp}
          label="Applications"
          value={data?.appStats?.total || 0}
          color="#8BCB2A"
          trend={+8}
        />
        <StatCard
          icon={Eye}
          label="Donations"
          value={data?.donationStats?.succeeded_count || 0}
          color="#F39C12"
        />
      </div>

      {/* Trend chart */}
      <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading font-bold text-lg text-[#031B2A] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#8BCB2A]" />
              Weekly Activity
            </h2>
            <p className="text-xs text-[#6D7E89]">Messages and applications over the last 7 days</p>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.weekTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F5" />
              <XAxis dataKey="day" stroke="#6D7E89" fontSize={12} />
              <YAxis stroke="#6D7E89" fontSize={12} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #EDF2F5', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="messages"
                stroke="#064B7A"
                strokeWidth={2.5}
                dot={{ fill: '#064B7A', r: 4 }}
                name="Messages"
              />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#8BCB2A"
                strokeWidth={2.5}
                dot={{ fill: '#8BCB2A', r: 4 }}
                name="Applications"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Users by role */}
        <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
          <h2 className="font-heading font-bold text-lg text-[#031B2A] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#8BCB2A]" />
            Users by Role
          </h2>
          {data?.usersByRole?.length === 0 ? (
            <p className="text-sm text-[#6D7E89] text-center py-8">No user data yet.</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.usersByRole || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F5" />
                  <XAxis dataKey="role" stroke="#6D7E89" fontSize={11} />
                  <YAxis stroke="#6D7E89" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EDF2F5', fontSize: 12 }} />
                  <Bar dataKey="count" fill="#064B7A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Message purposes */}
        <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
          <h2 className="font-heading font-bold text-lg text-[#031B2A] mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-[#8BCB2A]" />
            Message Purposes
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.purposes || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={3}
                >
                  {(data?.purposes || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EDF2F5', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Message priority */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Urgent', value: data?.msgStats?.urgent || 0, color: '#E74C3C' },
          { label: 'High', value: data?.msgStats?.high || 0, color: '#F39C12' },
          { label: 'Unread', value: data?.msgStats?.unread || 0, color: '#3498DB' },
          { label: 'Resolved', value: data?.msgStats?.resolved || 0, color: '#8BCB2A' },
        ].map((k, i) => (
          <div
            key={i}
            className="bg-white border border-[#EDF2F5] rounded-2xl p-5"
            style={{ borderLeft: `4px solid ${k.color}` }}
          >
            <p className="text-xs uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
              {k.label}
            </p>
            <p className="font-heading font-bold text-3xl" style={{ color: k.color }}>
              {k.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}