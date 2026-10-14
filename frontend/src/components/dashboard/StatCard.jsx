// src/components/dashboard/StatCard.jsx
export default function StatCard({ icon: Icon, label, value, color = '#064B7A', trend }) {
  return (
    <div className="bg-white border border-[#EDF2F5] rounded-xl p-5 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        {Icon && (
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center"
            style={{ background: `${color}15` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        )}
        {trend && (
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-full ${
              trend > 0
                ? 'bg-[#8BCB2A]/15 text-[#6CA51A]'
                : 'bg-red-50 text-[#E74C3C]'
            }`}
          >
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="font-heading font-bold text-2xl text-[#031B2A] mb-1">{value ?? '—'}</p>
      <p className="text-xs text-[#6D7E89] font-medium">{label}</p>
    </div>
  );
}