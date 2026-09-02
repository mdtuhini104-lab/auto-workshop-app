'use client';

import React, { useState } from 'react';

interface LedgerEntry {
  id: string;
  customerName: string;
  phone: string;
  vehicleNo: string;
  totalBilled: number;
  totalPaid: number;
  dueBalance: number;
}

const DEFAULT_CUSTOMER_LEDGERS: LedgerEntry[] = [
  { id: 'CL-01', customerName: 'Europetex Limited', phone: '01711-889900', vehicleNo: 'DHK-METRO-GA-13-8851', totalBilled: 125000, totalPaid: 100000, dueBalance: 25000 },
  { id: 'CL-02', customerName: 'Mr. Rafiqul Islam', phone: '01819-221100', vehicleNo: 'DHK-METRO-KHA-11-2041', totalBilled: 42000, totalPaid: 42000, dueBalance: 0 },
];

export default function CustomerLedgersPage() {
  const [ledgers] = useState<LedgerEntry[]>(DEFAULT_CUSTOMER_LEDGERS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Accounts & Receivables Ledger</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Individual client billing summaries, payment receipts, and due balance statements</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          + Record Customer Payment
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Billed Revenue</p>
          <p className="text-2xl font-black text-slate-900 mt-2">৳ {ledgers.reduce((a,b)=>a+b.totalBilled,0).toLocaleString('en-BD')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Cash Collected</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">৳ {ledgers.reduce((a,b)=>a+b.totalPaid,0).toLocaleString('en-BD')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Due Receivables</p>
          <p className="text-2xl font-black text-rose-600 mt-2">৳ {ledgers.reduce((a,b)=>a+b.dueBalance,0).toLocaleString('en-BD')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Clients with Dues</p>
          <p className="text-2xl font-black text-amber-600 mt-2">{ledgers.filter(l=>l.dueBalance>0).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Ledger ID</th>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Primary Vehicle</th>
              <th className="py-3 px-4 text-right">Total Billed (৳)</th>
              <th className="py-3 px-4 text-right">Paid (৳)</th>
              <th className="py-3 px-4 text-right">Due Balance (৳)</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ledgers.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-bold text-[#004e89]">{l.id}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{l.customerName}</td>
                <td className="py-3 px-4 font-mono text-slate-600">{l.phone}</td>
                <td className="py-3 px-4 font-mono text-slate-700">{l.vehicleNo}</td>
                <td className="py-3 px-4 text-right font-mono text-slate-900">৳ {l.totalBilled.toLocaleString('en-BD')}</td>
                <td className="py-3 px-4 text-right font-mono text-emerald-700">৳ {l.totalPaid.toLocaleString('en-BD')}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">৳ {l.dueBalance.toLocaleString('en-BD')}</td>
                <td className="py-3 px-4 text-right">
                  <button className="px-2.5 py-1 bg-[#004e89] text-white rounded text-xs font-semibold">View Statement</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
