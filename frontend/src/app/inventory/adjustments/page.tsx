'use client';

import React, { useState, useEffect } from 'react';

interface Adjustment {
  id: string;
  date: string;
  itemName: string;
  type: 'Stock In (+)' | 'Stock Out (-)';
  qty: number;
  reason: string;
  adjustedBy: string;
}

const DEFAULT_ADJUSTMENTS: Adjustment[] = [
  { id: 'ADJ-2026-012', date: '2026-07-27', itemName: 'Synthetic Engine Oil 5W-40', type: 'Stock In (+)', qty: 10, reason: 'Physical Count Surplus', adjustedBy: 'Store Officer Tariq' },
  { id: 'ADJ-2026-013', date: '2026-07-28', itemName: 'Oil Filter Assembly (Toyota)', type: 'Stock Out (-)', qty: 2, reason: 'Damaged in Warehouse', adjustedBy: 'Store Officer Tariq' },
];

export default function StockAdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('erp_stock_adjustments');
    if (saved) {
      try { setAdjustments(JSON.parse(saved)); } catch { setAdjustments(DEFAULT_ADJUSTMENTS); }
    } else {
      setAdjustments(DEFAULT_ADJUSTMENTS);
      localStorage.setItem('erp_stock_adjustments', JSON.stringify(DEFAULT_ADJUSTMENTS));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Stock Adjustments</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Manual stock entry, audit reconciliation, and write-offs</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          + New Stock Adjustment
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Audit Adjustments</p>
          <p className="text-2xl font-black text-slate-900 mt-2">{adjustments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Stock In Entries</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">{adjustments.filter(a=>a.type.includes('In')).length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Stock Out / Write-offs</p>
          <p className="text-2xl font-black text-rose-600 mt-2">{adjustments.filter(a=>a.type.includes('Out')).length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Audit Status</p>
          <p className="text-2xl font-black text-[#004e89] mt-2">Up-to-date</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Adjustment ID</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Item Name</th>
              <th className="py-3 px-4">Adjustment Type</th>
              <th className="py-3 px-4 text-center">Adjusted Qty</th>
              <th className="py-3 px-4">Reason / Notes</th>
              <th className="py-3 px-4">Adjusted By</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {adjustments.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-bold text-[#004e89]">{a.id}</td>
                <td className="py-3 px-4 text-slate-600">{a.date}</td>
                <td className="py-3 px-4 font-semibold text-slate-900">{a.itemName}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${a.type.includes('In')?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {a.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-bold text-slate-900">{a.qty}</td>
                <td className="py-3 px-4 text-slate-600">{a.reason}</td>
                <td className="py-3 px-4 text-slate-700">{a.adjustedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
