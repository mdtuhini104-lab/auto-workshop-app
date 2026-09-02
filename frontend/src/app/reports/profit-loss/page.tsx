'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

function ProfitLossContent() {
  const [dateFrom, setDateFrom] = useState('2026-08-01');
  const [dateTo, setDateTo] = useState('2026-08-31');

  // Revenue Breakdown Data
  const partsSalesRevenue = 185000;
  const laborServiceRevenue = 120000;
  const totalRevenue = useMemo(() => partsSalesRevenue + laborServiceRevenue, [partsSalesRevenue, laborServiceRevenue]);

  // Expense Breakdown Data
  const partsCostCOGS = 85000;
  const operatingExpenses = 160500; // Rent 85k + Utilities 18.5k + Allowances 12k + Procurement 45k
  const totalExpenses = useMemo(() => partsCostCOGS + operatingExpenses, [partsCostCOGS, operatingExpenses]);

  // Net Profit / Loss Calculation
  const netProfit = useMemo(() => totalRevenue - totalExpenses, [totalRevenue, totalExpenses]);
  const isProfitable = netProfit >= 0;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto text-slate-800 dark:text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 space-x-1 mb-1">
            <Link href="/dashboard" prefetch={false} className="hover:underline">Dashboard</Link>
            <span>&gt;</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Profit & Loss</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Profit & Loss Financial Statement</h1>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive revenue, cost of goods sold, operating expenses, and calculated net income summary.</p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg shadow-xs">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input type="date" className="bg-transparent outline-none font-mono" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span className="text-slate-400">-</span>
          <input type="date" className="bg-transparent outline-none font-mono" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>
      </div>

      {/* Net Profit / Loss Banner */}
      <div className={`p-6 rounded-2xl border shadow-xs flex items-center justify-between ${
        isProfitable 
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200' 
          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-200'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${isProfitable ? 'bg-emerald-600' : 'bg-rose-600'}`}>
            {isProfitable ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block opacity-70">
              {isProfitable ? 'Net Operating Profit (August 2026)' : 'Net Loss (August 2026)'}
            </span>
            <span className="text-3xl font-extrabold font-mono">
              ৳ {Math.abs(netProfit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="text-right text-xs space-y-1">
          <div>Total Revenue: <span className="font-bold font-mono">৳ {totalRevenue.toLocaleString()}</span></div>
          <div>Total Costs & Expenses: <span className="font-bold font-mono">৳ {totalExpenses.toLocaleString()}</span></div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">1. Income & Revenue Breakdown</h2>
            <span className="text-xs font-bold text-emerald-600 font-mono">৳ {totalRevenue.toLocaleString()}</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/40">
              <span className="text-slate-600 dark:text-slate-300">Spare Parts Sales Revenue</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">৳ {partsSalesRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/40">
              <span className="text-slate-600 dark:text-slate-300">Labor & Workshop Service Charges</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">৳ {laborServiceRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">2. Cost of Goods & Operating Expenses</h2>
            <span className="text-xs font-bold text-rose-600 font-mono">৳ {totalExpenses.toLocaleString()}</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/40">
              <span className="text-slate-600 dark:text-slate-300">Cost of Goods Sold (COGS - Spare Parts)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">৳ {partsCostCOGS.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/40">
              <span className="text-slate-600 dark:text-slate-300">Daily Operating Expenses (Rent, Utilities, Allowances)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">৳ {operatingExpenses.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfitLossPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading Profit & Loss statement...</div>}>
      <ProfitLossContent />
    </Suspense>
  );
}
