// src/pages/dashboard/Documents.jsx
import { FileText, Download, Folder } from 'lucide-react';

export default function Documents() {
  const docs = [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#031B2A]">Documents</h1>
          <p className="text-sm text-[#6D7E89] mt-1">
            Your uploads, certificates, and official NCG documents
          </p>
        </div>
      </div>

      {docs.length === 0 ? (
        <div className="bg-white border border-[#EDF2F5] rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F9FB] flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-[#A8BBC5]" />
          </div>
          <p className="text-sm text-[#6D7E89]">
            No documents yet. Certificates and receipts will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((d, i) => (
            <div key={i} className="bg-white border border-[#EDF2F5] rounded-xl p-5">
              <FileText className="w-8 h-8 text-[#E74C3C] mb-3" />
              <p className="font-semibold text-sm text-[#031B2A] mb-1">{d.name}</p>
              <p className="text-xs text-[#6D7E89] mb-3">{d.date}</p>
              <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#064B7A] hover:text-[#8BCB2A]">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}