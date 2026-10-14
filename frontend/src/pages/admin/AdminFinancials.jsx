// frontend/src/pages/admin/AdminFinancials.jsx
import { useEffect, useState } from 'react';
import {
  DollarSign, TrendingUp, Receipt, Loader2, Download,
  ArrowUpRight, ArrowDownRight, Wallet,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import api from '../../lib/api';
import StatCard from '../../components/dashboard/StatCard';
import { PageHeader, Modal } from './AdminComponents';

const COLORS = ['#064B7A', '#8BCB2A', '#F39C12', '#9B59B6', '#16A085', '#E74C3C'];

export default function AdminFinancials() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [donationsRes, paymentsRes, subsRes] = await Promise.all([
          api.get('/donations/admin/stats').catch(() => null),
          api.get('/payments/admin/stats').catch(() => null),
          api.get('/subscriptions/admin/stats').catch(() => null),
        ]);

        // Build monthly trend (mock for now, wired to real data when available)
        const monthlyTrend = [
          { month: 'Jan', donations: 125000, payments: 85000, subscriptions: 45000 },
          { month: 'Feb', donations: 178000, payments: 92000, subscriptions: 52000 },
          { month: 'Mar', donations: 195000, payments: 105000, subscriptions: 58000 },
          { month: 'Apr', donations: 220000, payments: 115000, subscriptions: 62000 },
          { month: 'May', donations: 245000, payments: 128000, subscriptions: 68000 },
          { month: 'Jun', donations: 285000, payments: 142000, subscriptions: 75000 },
        ];

        const bySource = [
          { name: 'Individual Donations', value: 45 },
          { name: 'Corporate Giving', value: 25 },
          { name: 'Program Fees', value: 15 },
          { name: 'Subscriptions', value: 10 },
          { name: 'Other', value: 5 },
        ];

        setData({
          donations: donationsRes?.data || {},
          payments: paymentsRes?.data || {},
          subscriptions: subsRes?.data || {},
          monthlyTrend,
          bySource,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin" />
      </div>
    );
  }

  const totalRevenue =
    (Number(data?.donations?.total_amount) || 0) +
    (Number(data?.payments?.total_amount) || 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Overview"
        subtitle="Track revenue, donations, payments, and subscriptions"
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
            <button className="inline-flex items-center gap-2 bg-[#064B7A] text-white font-semibold px-4 py-2.5 rounded-md text-sm hover:bg-[#062F4A]">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`${totalRevenue.toLocaleString()} RWF`}
          color="#8BCB2A"
          trend={+12}
        />
        <StatCard
          icon={Wallet}
          label="Total Donations"
          value={`${(Number(data?.donations?.total_amount) || 0).toLocaleString()} RWF`}
          color="#064B7A"
          trend={+8}
        />
        <StatCard
          icon={Receipt}
          label="Payments"
          value={`${(Number(data?.payments?.total_amount) || 0).toLocaleString()} RWF`}
          color="#F39C12"
        />
        <StatCard
          icon={TrendingUp}
          label="Active Subscriptions"
          value={data?.subscriptions?.succeeded_count || 0}
          color="#9B59B6"
          trend={+15}
        />
      </div>

      {/* Trend Chart */}
      <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-heading font-bold text-lg text-[#031B2A]">
              Revenue Trends
            </h2>
            <p className="text-xs text-[#6D7E89]">Monthly breakdown by source</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#064B7A]" />
              <span className="text-[#6D7E89]">Donations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#8BCB2A]" />
              <span className="text-[#6D7E89]">Payments</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#F39C12]" />
              <span className="text-[#6D7E89]">Subscriptions</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.monthlyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F5" />
              <XAxis dataKey="month" stroke="#6D7E89" fontSize={12} />
              <YAxis stroke="#6D7E89" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #EDF2F5', fontSize: 12 }}
                formatter={(v) => `${Number(v).toLocaleString()} RWF`}
              />
              <Line type="monotone" dataKey="donations" stroke="#064B7A" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="payments" stroke="#8BCB2A" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="subscriptions" stroke="#F39C12" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-column: Bar chart + Pie chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
          <h2 className="font-heading font-bold text-lg text-[#031B2A] mb-5">
            Revenue by Month
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthlyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F5" />
                <XAxis dataKey="month" stroke="#6D7E89" fontSize={12} />
                <YAxis stroke="#6D7E89" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EDF2F5', fontSize: 12 }} />
                <Bar dataKey="donations" fill="#064B7A" radius={[6, 6, 0, 0]} />
                <Bar dataKey="payments" fill="#8BCB2A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
          <h2 className="font-heading font-bold text-lg text-[#031B2A] mb-5">
            Revenue Sources
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.bySource || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={3}
                  label={({ name, value }) => `${value}%`}
                >
                  {(data?.bySource || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #EDF2F5', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white border border-[#EDF2F5] rounded-2xl p-6">
        <h2 className="font-heading font-bold text-lg text-[#031B2A] mb-5">
          Recent Transactions
        </h2>
        <div className="text-center py-8 text-sm text-[#6D7E89]">
          Transaction list coming soon — connect to /api/payments/admin/list
        </div>
      </div>
    </div>
  );
}