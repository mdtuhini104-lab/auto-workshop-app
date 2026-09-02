'use client';

import React, { useState } from 'react';

interface AccountNode {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
}

const DEFAULT_COA: AccountNode[] = [
  { code: '1000', name: 'Current Assets (Cash & Bank)', type: 'Asset', balance: 450000 },
  { code: '1100', name: 'Inventory Asset (Spare Parts)', type: 'Asset', balance: 820000 },
  { code: '2000', name: 'Accounts Payable (Vendors)', type: 'Liability', balance: 188000 },
  { code: '3000', name: 'Owner Equity', type: 'Equity', balance: 1000000 },
  { code: '4000', name: 'Workshop Service Revenue', type: 'Revenue', balance: 650000 },
  { code: '5000', name: 'Parts & Fluids Expense', type: 'Expense', balance: 280000 },
  { code: '5100', name: 'Utility & Rent Expenses', type: 'Expense', balance: 65000 },
];

export default function ChartOfAccountsPage() {
  const [coa] = useState<AccountNode[]>(DEFAULT_COA);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Chart of Accounts (COA)</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">General ledger structure, account codes, and financial categories</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          + Add Account Head
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Assets</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">৳ 1,270,000</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Liabilities</p>
          <p className="text-2xl font-black text-rose-600 mt-2">৳ 188,000</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Revenue (MTD)</p>
          <p className="text-2xl font-black text-[#004e89] mt-2">৳ 650,000</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Operating Expenses</p>
          <p className="text-2xl font-black text-amber-600 mt-2">৳ 345,000</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Account Code</th>
              <th className="py-3 px-4">Account Head Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-right">Current Balance (৳)</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coa.map((acc) => (
              <tr key={acc.code} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-[#004e89]">{acc.code}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{acc.name}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                    acc.type==='Asset'?'bg-emerald-50 text-emerald-700 border-emerald-200':
                    acc.type==='Liability'?'bg-rose-50 text-rose-700 border-rose-200':
                    acc.type==='Revenue'?'bg-blue-50 text-blue-700 border-blue-200':'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    {acc.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">৳ {acc.balance.toLocaleString('en-BD')}</td>
                <td className="py-3 px-4 text-right">
                  <button className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">View Ledger</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
