'use client';

import React, { useState, useEffect } from 'react';

interface GRN {
  id: string;
  poRef: string;
  vendorName: string;
  receivedDate: string;
  receivedBy: string;
  status: 'Verified' | 'Pending QC';
}

const DEFAULT_GRN: GRN[] = [
  { id: 'GRN-2026-041', poRef: 'PO-2026-089', vendorName: 'Akij Motors Ltd', receivedDate: '2026-07-28', receivedBy: 'Store Keeper Tariq', status: 'Verified' },
  { id: 'GRN-2026-042', poRef: 'PO-2026-090', vendorName: 'Navana Toyota Motors', receivedDate: '2026-07-29', receivedBy: 'Store Keeper Tariq', status: 'Pending QC' },
];

export default function GoodsReceivedPage() {
  const [grnList, setGrnList] = useState<GRN[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('erp_grn');
    if (saved) {
      try { setGrnList(JSON.parse(saved)); } catch { setGrnList(DEFAULT_GRN); }
    } else {
      setGrnList(DEFAULT_GRN);
      localStorage.setItem('erp_grn', JSON.stringify(DEFAULT_GRN));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Goods Received Notes (GRN)</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Stock-in verification log for delivered spare parts & items</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          + Create New GRN
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total GRN Logs</p>
          <p className="text-2xl font-black text-slate-900 mt-2">{grnList.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Verified Stock-Ins</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">{grnList.filter(g=>g.status==='Verified').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Pending QC Check</p>
          <p className="text-2xl font-black text-amber-600 mt-2">{grnList.filter(g=>g.status==='Pending QC').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Receiving Store</p>
          <p className="text-2xl font-black text-[#004e89] mt-2">Uttara Warehouse</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">GRN Number</th>
              <th className="py-3 px-4">PO Reference</th>
              <th className="py-3 px-4">Vendor Name</th>
              <th className="py-3 px-4">Received Date</th>
              <th className="py-3 px-4">Received By</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {grnList.map((g) => (
              <tr key={g.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-bold text-[#004e89]">{g.id}</td>
                <td className="py-3 px-4 font-mono text-slate-600">{g.poRef}</td>
                <td className="py-3 px-4 font-semibold text-slate-900">{g.vendorName}</td>
                <td className="py-3 px-4 text-slate-600">{g.receivedDate}</td>
                <td className="py-3 px-4 text-slate-700">{g.receivedBy}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${g.status==='Verified'?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {g.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">View GRN</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
