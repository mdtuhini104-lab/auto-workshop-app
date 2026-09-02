'use client';

import React, { useState } from 'react';

interface VehicleDocument {
  id: string;
  vehicleNo: string;
  docType: 'Fitness Certificate' | 'Tax Token' | 'Route Permit' | 'Insurance';
  expiryDate: string;
  uploadedDate: string;
  status: 'Valid' | 'Expiring Soon';
}

const DEFAULT_VEHICLE_FILES: VehicleDocument[] = [
  { id: 'DOC-101', vehicleNo: 'DHK-METRO-GA-13-8851', docType: 'Fitness Certificate', expiryDate: '2027-01-15', uploadedDate: '2026-01-15', status: 'Valid' },
  { id: 'DOC-102', vehicleNo: 'DHK-METRO-GA-13-8851', docType: 'Tax Token', expiryDate: '2026-08-30', uploadedDate: '2025-08-30', status: 'Expiring Soon' },
];

export default function VehicleFilesPage() {
  const [files] = useState<VehicleDocument[]>(DEFAULT_VEHICLE_FILES);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vehicle Documents Repository</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Digital archive of fitness certificates, tax tokens, route permits, and registration papers</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          + Upload Vehicle Document
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Files Uploaded</p>
          <p className="text-2xl font-black text-slate-900 mt-2">{files.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Valid Papers</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">{files.filter(f=>f.status==='Valid').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Expiring Soon (&lt;30 days)</p>
          <p className="text-2xl font-black text-rose-600 mt-2">{files.filter(f=>f.status==='Expiring Soon').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Storage Used</p>
          <p className="text-2xl font-black text-[#004e89] mt-2">12.4 MB</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Doc ID</th>
              <th className="py-3 px-4">Vehicle Reg Number</th>
              <th className="py-3 px-4">Document Type</th>
              <th className="py-3 px-4">Expiry Date</th>
              <th className="py-3 px-4">Upload Date</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {files.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-bold text-[#004e89]">{f.id}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">{f.vehicleNo}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{f.docType}</td>
                <td className="py-3 px-4 text-slate-600">{f.expiryDate}</td>
                <td className="py-3 px-4 text-slate-600">{f.uploadedDate}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${f.status==='Valid'?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {f.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="px-2.5 py-1 bg-[#004e89] text-white rounded text-xs font-semibold">Download PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
