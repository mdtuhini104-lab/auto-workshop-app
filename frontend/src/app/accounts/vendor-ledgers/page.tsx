'use client';

import React, { useState } from 'react';

interface VendorLedger {
  id: string;
  vendorName: string;
  contactPerson: string;
  totalPurchased: number;
  totalPaid: number;
  payableBalance: number;
}

const DEFAULT_VENDOR_LEDGERS: VendorLedger[] = [
  { id: 'VL-01', vendorName: 'Akij Motors Ltd', contactPerson: 'Mamunur Rashid', totalPurchased: 245000, totalPaid: 200000, payableBalance: 45000 },
  { id: 'VL-02', vendorName: 'Navana Toyota Motors', contactPerson: 'Tariqul Islam', totalPurchased: 350000, totalPaid: 225000, payableBalance: 125000 },
];

export default function VendorLedgersPage() {
  const [ledgers] = useState<VendorLedger[]>(DEFAULT_VENDOR_LEDGERS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vendor Accounts & Payables Ledger</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Supplier purchase statements, disbursements, and credit balances</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          + Record Vendor Payment
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Purchases (YTD)</p>
          <p className="text-2xl font-black text-slate-900 mt-2">৳ {ledgers.reduce((a,b)=>a+b.totalPurchased,0).toLocaleString('en-BD')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Paid to Vendors</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">৳ {ledgers.reduce((a,b)=>a+b.totalPaid,0).toLocaleString('en-BD')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Payables Outstanding</p>
          <p className="text-2xl font-black text-rose-600 mt-2">৳ {ledgers.reduce((a,b)=>a+b.payableBalance,0).toLocaleString('en-BD')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Suppliers Due</p>
          <p className="text-2xl font-black text-amber-600 mt-2">{ledgers.filter(l=>l.payableBalance>0).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Ledger ID</th>
              <th className="py-3 px-4">Vendor Name</th>
              <th className="py-3 px-4">Contact Person</th>
              <th className="py-3 px-4 text-right">Total Purchased (৳)</th>
              <th className="py-3 px-4 text-right">Total Paid (৳)</th>
              <th className="py-3 px-4 text-right">Payable Balance (৳)</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ledgers.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-bold text-[#004e89]">{l.id}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{l.vendorName}</td>
                <td className="py-3 px-4 text-slate-700">{l.contactPerson}</td>
                <td className="py-3 px-4 text-right font-mono text-slate-900">৳ {l.totalPurchased.toLocaleString('en-BD')}</td>
                <td className="py-3 px-4 text-right font-mono text-emerald-700">৳ {l.totalPaid.toLocaleString('en-BD')}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">৳ {l.payableBalance.toLocaleString('en-BD')}</td>
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
