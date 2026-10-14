// frontend/src/pages/admin/AdminDonors.jsx
import { useEffect, useState } from 'react';
import {
  Users, Search, RefreshCw, Eye, Mail, Heart, TrendingUp, Loader2,
} from 'lucide-react';
import api from '../../lib/api';
import DataTable from '../../components/dashboard/DataTable';
import StatCard from '../../components/dashboard/StatCard';
import { PageHeader, Modal } from './AdminComponents';

export default function AdminDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      // Derive donors from donations list
      const res = await api.get('/donations/admin/list?limit=500');
      const donations = res.data || [];

      // Aggregate by email
      const donorMap = {};
      donations.forEach((d) => {
        if (!d.donorEmail) return;
        if (!donorMap[d.donorEmail]) {
          donorMap[d.donorEmail] = {
            email: d.donorEmail,
            name: d.donorName,
            totalDonated: 0,
            donationCount: 0,
            lastDonation: d.createdAt,
            donations: [],
          };
        }
        donorMap[d.donorEmail].totalDonated += Number(d.amount) || 0;
        donorMap[d.donorEmail].donationCount += 1;
        donorMap[d.donorEmail].donations.push(d);
        if (new Date(d.createdAt) > new Date(donorMap[d.donorEmail].lastDonation)) {
          donorMap[d.donorEmail].lastDonation = d.createdAt;
        }
      });

      setDonors(Object.values(donorMap).sort((a, b) => b.totalDonated - a.totalDonated));
    } catch (_) {
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = search
    ? donors.filter(
        (d) =>
          d.name?.toLowerCase().includes(search.toLowerCase()) ||
          d.email?.toLowerCase().includes(search.toLowerCase())
      )
    : donors;

  const totalRaised = donors.reduce((sum, d) => sum + d.totalDonated, 0);
  const avgDonation = donors.length > 0 ? totalRaised / donors.length : 0;

  const columns = [
    {
      label: 'Donor',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E74C3C] to-[#F39C12] flex items-center justify-center text-white font-bold flex-shrink-0">
            {r.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-semibold text-sm text-[#031B2A]">{r.name}</p>
            <p className="text-xs text-[#6D7E89]">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      label: 'Total Donated',
      render: (r) => (
        <span className="font-bold text-[#064B7A]">
          {r.totalDonated.toLocaleString()} RWF
        </span>
      ),
    },
    {
      label: 'Donations',
      render: (r) => <span className="text-sm">{r.donationCount}</span>,
    },
    {
      label: 'Last Donation',
      render: (r) => (
        <span className="text-xs text-[#6D7E89]">
          {new Date(r.lastDonation).toLocaleDateString()}
        </span>
      ),
    },
    {
      label: 'Actions',
      width: '60px',
      render: (r) => (
        <button
          onClick={(e) => { e.stopPropagation(); setSelected(r); }}
          className="w-8 h-8 rounded-md border border-[#EDF2F5] hover:bg-[#064B7A] hover:text-white flex items-center justify-center transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Donors"
        subtitle="All donors and their giving history"
        action={
          <button
            onClick={load}
            className="inline-flex items-center gap-2 bg-white border border-[#EDF2F5] text-[#064B7A] font-semibold px-4 py-2 rounded-md text-sm hover:bg-[#F5F9FB]"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Donors" value={donors.length} color="#064B7A" />
        <StatCard icon={Heart} label="Total Raised" value={`${totalRaised.toLocaleString()} RWF`} color="#E74C3C" />
        <StatCard icon={TrendingUp} label="Avg per Donor" value={`${Math.round(avgDonation).toLocaleString()} RWF`} color="#8BCB2A" />
        <StatCard icon={Users} label="Recurring" value="—" color="#F39C12" />
      </div>

      <div className="bg-white border border-[#EDF2F5] rounded-xl p-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6D7E89]" />
          <input
            placeholder="Search donors by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-[#EDF2F5] text-sm focus:outline-none focus:border-[#8BCB2A]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={loading}
        emptyMessage="No donors yet."
        onRowClick={(row) => setSelected(row)}
      />

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name || 'Donor Details'}
        size="md"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[#E74C3C]/10 to-[#F39C12]/10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E74C3C] to-[#F39C12] flex items-center justify-center text-white font-bold text-2xl">
                {selected.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="font-heading font-bold text-xl text-[#031B2A]">{selected.name}</p>
                <p className="text-sm text-[#6D7E89]">{selected.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-[#F5F9FB]">
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Total
                </p>
                <p className="font-bold text-[#064B7A]">
                  {selected.totalDonated.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-[#F5F9FB]">
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Count
                </p>
                <p className="font-bold text-[#031B2A]">{selected.donationCount}</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-[#F5F9FB]">
                <p className="text-[10px] uppercase tracking-wider text-[#6D7E89] font-bold mb-1">
                  Avg
                </p>
                <p className="font-bold text-[#031B2A]">
                  {Math.round(selected.totalDonated / selected.donationCount).toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-heading font-bold text-sm text-[#031B2A] mb-3">
                Donation History
              </h4>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {selected.donations.map((d) => (
                  <li key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F5F9FB] text-sm">
                    <div>
                      <p className="font-mono text-xs text-[#064B7A]">{d.donationId}</p>
                      <p className="text-xs text-[#6D7E89]">{d.designation}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#031B2A]">
                        {Number(d.amount).toLocaleString()} {d.currency}
                      </p>
                      <p className="text-xs text-[#6D7E89]">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={`mailto:${selected.email}`}
              className="inline-flex items-center gap-2 bg-[#064B7A] text-white font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#062F4A] w-full justify-center"
            >
              <Mail className="w-4 h-4" /> Email Donor
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}