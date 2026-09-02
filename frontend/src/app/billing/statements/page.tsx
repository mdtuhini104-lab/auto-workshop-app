"use client";

import React, { useState, useEffect } from 'react';

export default function CustomerStatementsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Dummy mock data for a statement
  const mockInvoices = [
    { id: 1, date: '2026-07-01', bill_no: 'INV-2607-001', vehicle: 'DHK-12-3456', total: 12500, paid: 12500, due: 0, status: 'Paid' },
    { id: 2, date: '2026-07-15', bill_no: 'INV-2607-055', vehicle: 'DHK-12-3456', total: 4500, paid: 0, due: 4500, status: 'Unpaid' },
    { id: 3, date: '2026-07-20', bill_no: 'INV-2607-089', vehicle: 'DHK-12-3456', total: 15000, paid: 5000, due: 10000, status: 'Partial' }
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  }, []);

  const totalInvoices = mockInvoices.length;
  const totalBilled = mockInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = mockInvoices.reduce((sum, inv) => sum + inv.paid, 0);
  const totalDue = mockInvoices.reduce((sum, inv) => sum + inv.due, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Unpaid': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Partial': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Customer Statement</h1>
          <p className="text-sm text-slate-500 font-normal mt-1">Generate and print account statements for customers.</p>
        </div>
      </div>

      {/* Top Options Panel */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer</label>
            <select className="w-full rounded-lg border border-slate-200 dark:border-slate-600 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:border-[#004e89] outline-none">
              <option>Select Customer</option>
              <option value="1">John Doe</option>
              <option value="2">Sarah Smith</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date Range</label>
            <div className="flex items-center gap-2">
              <input type="date" className="w-full rounded-lg border border-slate-200 dark:border-slate-600 py-2 px-2 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:border-[#004e89] outline-none" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              <span className="text-slate-400">-</span>
              <input type="date" className="w-full rounded-lg border border-slate-200 dark:border-slate-600 py-2 px-2 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:border-[#004e89] outline-none" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select className="w-full rounded-lg border border-slate-200 dark:border-slate-600 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:border-[#004e89] outline-none">
              <option value="All">All Invoices</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid / Due</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Vehicle No (Optional)</label>
            <input type="text" placeholder="Search vehicle..." className="w-full rounded-lg border border-slate-200 dark:border-slate-600 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:border-[#004e89] outline-none" />
          </div>
        </div>
        
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Print Option:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="print_opt" defaultChecked className="text-[#004e89] focus:ring-[#004e89]" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Combined Statement</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="print_opt" className="text-[#004e89] focus:ring-[#004e89]" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Separate Invoices</span>
            </label>
          </div>
          <button className="bg-[#004e89] hover:bg-[#003d6c] text-white font-medium py-2 px-6 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print
          </button>
        </div>
      </div>

      {/* 4-Col Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">TOTAL INVOICES</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalInvoices}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">TOTAL BILLED</div>
          <div className="text-2xl font-bold text-[#004e89] dark:text-blue-400">৳ {totalBilled.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">TOTAL PAID</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">৳ {totalPaid.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">TOTAL DUE</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">৳ {totalDue.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        </div>
      </div>

      {/* Table List */}
      <div className="overflow-x-auto pb-4 flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap">Date</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap">Bill No</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap">Vehicle</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap text-right">Total</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap text-right">Paid</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap text-right">Due</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={7} className="py-12 text-center text-slate-400">Loading...</td></tr> : mockInvoices.length === 0 ? <tr><td colSpan={7} className="py-12 text-center text-slate-400">No records found.</td></tr> :
              mockInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap">{inv.date}</td>
                  <td className="py-3 px-4 text-sm font-medium text-[#004e89] dark:text-blue-400 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap hover:underline cursor-pointer">{inv.bill_no}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap">{inv.vehicle}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap text-right">
                    ৳ {inv.total.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap text-right">
                    ৳ {inv.paid.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-red-600 dark:text-red-400 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap text-right">
                    ৳ {inv.due.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </td>
                  <td className="py-3 px-4 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(inv.status)}`}>{inv.status}</span>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
