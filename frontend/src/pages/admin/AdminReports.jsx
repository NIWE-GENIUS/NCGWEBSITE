// frontend/src/pages/admin/AdminReports.jsx
import { useState, useEffect } from 'react';
import {
  FileBarChart, Download, Loader2, TrendingUp, Users, DollarSign,
  Calendar, Filter, FileText,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import api from '../../lib/api';
import { PageHeader } from './AdminComponents';

const COLORS = ['#064B7A', '#8BCB2A', '#F39C12', '#9B59B6', '#16A085', '#E74C3C'];

const REPORT_TYPES = [
  { id: 'users', label: 'User Report', icon: Users, desc: 'User growth, roles, activity' },
  { id: 'donations', label: 'Donation Report', icon: DollarSign, desc: 'Donations, donors, campaigns' },
  { id: 'programs', label: 'Programs Report', icon: FileText, desc: 'Applications, enrollments' },
  { id: 'messages', label: 'Messages Report', icon: FileBarChart, desc: 'Inbox, replies, response time' },
];

export default function AdminReports() {
  const [reportType, setReportType] = useState('users');
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      if (reportType === 'users') endpoint = '/users/stats';
      else if (reportType === 'donations') endpoint = '/donations/admin/stats';
      else if (reportType === 'messages') endpoint = '/contact/admin/stats';

      const res = await api.get(endpoint).catch(() => null);

      // Build sample chart data — real data comes from DB when endpoints are ready
      const trend = [
        { date: 'Week 1', value: 45, secondary: 20 },
        { date: 'Week 2', value: 62, secondary: 28 },
        { date: 'Week 3', value: 78, secondary: 35 },
        { date: 'Week 4', value: 95, secondary: 42 },
      ];

      const breakdown = [
        { name: 'Category A', value: 40 },
        { name: 'Category B', value: 30 },
        { name: 'Category C', value: 20 },
        { name: 'Category D', value: 10 },
      ];

      setData({
        stats: res?.data || {},
        trend,
        breakdown,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { generateReport(); }, [reportType, dateRange]);

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Generate and export custom reports"
        action={
          <div className="flex gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2.5 rounded-md border border-[#EDF2F5] text-sm bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">This year</option>
            </select>
            <button className="inline-flex items-center gap-2 bg-[#8BCB2A] text-[#031B2A] font-semibold px-4 py-2.5 rounded-md text-sm hover:bg-[#A8D94A]">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        }
      />

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {REPORT_TYPES.map((r) => {
          const Icon = r.icon;
          const active = reportType === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setReportType(r.id)}
              className={`text-left p-5 rounded-xl border-2 transition-all ${
                active
                  ? 'border-[#8BCB2A] bg-[#8BCB2A]/5 shadow-md'
                  : 'border-[#EDF2F5] bg-white hover:border-[#8BCB2A]/40'
              }`}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-3"
                style={{ background: active ? '#8BCB2A' : '#F5F9FB' }}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-[#064B7A]'}`} />
              </div>
              <p className="font-heading font-bold text-sm text-[#031B2A] mb-1">{r.label}</p>
              <p className="text-xs text-[#6D7E89]">{r.desc}</p>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Trend Chart */}
          <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
            <h2 className="font-heading font-bold text-lg text-[#031B2A] mb-5">
              {REPORT_TYPES.find((r) => r.id === reportType)?.label} — Trend
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F5" />
                  <XAxis dataKey="date" stroke="#6D7E89" fontSize={12} />
                  <YAxis stroke="#6D7E89" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EDF2F5', fontSize: 12 }} />
                  <Line type="monotone" dataKey="value" stroke="#064B7A" strokeWidth={2.5} dot={{ r: 4 }} name="Primary" />
                  <Line type="monotone" dataKey="secondary" stroke="#8BCB2A" strokeWidth={2.5} dot={{ r: 4 }} name="Secondary" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
              <h2 className="font-heading font-bold text-lg text-[#031B2A] mb-5">
                Bar Breakdown
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F5" />
                    <XAxis dataKey="date" stroke="#6D7E89" fontSize={12} />
                    <YAxis stroke="#6D7E89" fontSize={12} />
                    <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EDF2F5', fontSize: 12 }} />
                    <Bar dataKey="value" fill="#064B7A" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
              <h2 className="font-heading font-bold text-lg text-[#031B2A] mb-5">
                Distribution
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.breakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      paddingAngle={3}
                      label={({ value }) => `${value}%`}
                    >
                      {data.breakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EDF2F5', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
            <h2 className="font-heading font-bold text-lg text-[#031B2A] mb-5">
              Summary Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(data.stats || {}).slice(0, 8).map(([k, v]) => (
                <div key={k} className="p-4 rounded-xl bg-[#F5F9FB]">
                  <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                    {k.replace(/_/g, ' ')}
                  </p>
                  <p className="font-heading font-bold text-lg text-[#031B2A]">
                    {typeof v === 'number' ? v.toLocaleString() : String(v)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}