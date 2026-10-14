// src/components/dashboard/DataTable.jsx
import { Loader2, Inbox } from 'lucide-react';

export default function DataTable({ columns, rows, loading, emptyMessage = 'No data available', onRowClick }) {
  if (loading) {
    return (
      <div className="bg-white border border-[#EDF2F5] rounded-xl p-12 text-center">
        <Loader2 className="w-8 h-8 text-[#8BCB2A] animate-spin mx-auto mb-3" />
        <p className="text-sm text-[#6D7E89]">Loading...</p>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="bg-white border border-[#EDF2F5] rounded-xl p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F5F9FB] flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-8 h-8 text-[#A8BBC5]" />
        </div>
        <p className="text-sm text-[#6D7E89]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#EDF2F5] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F5F9FB] border-b border-[#EDF2F5]">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-[#6D7E89] font-bold whitespace-nowrap"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={ri}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-[#EDF2F5] last:border-0 ${
                  onRowClick ? 'cursor-pointer hover:bg-[#F5F9FB]' : ''
                } transition-colors`}
              >
                {columns.map((col, ci) => (
                  <td key={ci} className="px-5 py-4 align-middle text-[#163247]">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}