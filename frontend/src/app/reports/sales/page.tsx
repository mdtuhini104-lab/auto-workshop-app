'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';

interface SalesRecord {
  id: string;
  invoiceNo: string;
  customerName: string;
  vehicleNo: string;
  date: string;
  category: 'Parts' | 'Labor' | 'Full Service';
  amount: number;
  paymentMethod: 'Cash' | 'Card' | 'Bkash' | 'Bank Transfer';
  status: 'Completed' | 'Pending';
}

const mockSales: SalesRecord[] = [
  { id: '1', invoiceNo: 'INV-2026-001', customerName: 'John Doe', vehicleNo: 'DHK-12-3456', date: '2026-08-01', category: 'Full Service', amount: 18500, paymentMethod: 'Bkash', status: 'Completed' },
  { id: '2', invoiceNo: 'INV-2026-002', customerName: 'Europetex Ltd', vehicleNo: 'DHK-METRO-GA-13-8851', date: '2026-08-03', category: 'Parts', amount: 45000, paymentMethod: 'Bank Transfer', status: 'Completed' },
  { id: '3', invoiceNo: 'INV-2026-003', customerName: 'Sarah Smith', vehicleNo: 'CTG-45-7890', date: '2026-08-04', category: 'Labor', amount: 8200, paymentMethod: 'Cash', status: 'Completed' },
  { id: '4', invoiceNo: 'INV-2026-004', customerName: 'Karim Corp', vehicleNo: 'DHK-15-9876', date: '2026-08-05', category: 'Full Service', amount: 32000, paymentMethod: 'Card', status: 'Completed' },
  { id: '5', invoiceNo: 'INV-2026-005', customerName: 'Tanvir Hossain', vehicleNo: 'SYL-77-1122', date: '2026-08-06', category: 'Parts', amount: 14500, paymentMethod: 'Bkash', status: 'Pending' },
];

function SalesReportContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredSales = useMemo(() => {
    return mockSales.filter(item => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!item.invoiceNo.toLowerCase().includes(term) && !item.customerName.toLowerCase().includes(term) && !item.vehicleNo.toLowerCase().includes(term)) {
          return false;
        }
      }
      if (dateFrom && new Date(item.date) < new Date(dateFrom)) return false;
      if (dateTo && new Date(item.date) > new Date(dateTo)) return false;
      return true;
    });
  }, [searchTerm, categoryFilter, dateFrom, dateTo]);

  const totalRevenue = useMemo(() => filteredSales.reduce((acc, curr) => acc + curr.amount, 0), [filteredSales]);
  const partsRevenue = useMemo(() => filteredSales.filter(s => s.category === 'Parts').reduce((acc, curr) => acc + curr.amount, 0), [filteredSales]);
  const laborRevenue = useMemo(() => filteredSales.filter(s => s.category === 'Labor' || s.category === 'Full Service').reduce((acc, curr) => acc + curr.amount, 0), [filteredSales]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sales & Revenue Breakdown</h1>
          <p className="text-xs text-slate-500 mt-1">Detailed analysis of daily sales revenue, parts turnover, and service income.</p>
        </div>
        <Link href="/dashboard" prefetch={false} className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors shadow-xs w-fit">
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase">Total Period Revenue</div>
          <div className="text-2xl font-extrabold text-[#004e89]">৳ {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[11px] text-emerald-600 font-medium">+12.4% vs previous period</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase">Parts Sales Revenue</div>
          <div className="text-2xl font-extrabold text-slate-900">৳ {partsRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[11px] text-slate-400">Inventory items sold</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase">Labor & Service Income</div>
          <div className="text-2xl font-extrabold text-emerald-700">৳ {laborRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-[11px] text-slate-400">Mechanic billable hours</div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search invoice, customer, plate..." 
              aria-label="Filter sales reports"
              className="w-64 h-8 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            aria-label="Category filter"
            className="h-8 px-2.5 text-xs border border-slate-300 rounded-lg outline-none"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Parts">Parts Only</option>
            <option value="Labor">Labor Only</option>
            <option value="Full Service">Full Service</option>
          </select>
          <div className="flex items-center gap-2">
            <input type="date" className="h-8 px-2 text-xs border border-slate-300 rounded-lg" value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="From Date" />
            <span className="text-xs text-slate-400">-</span>
            <input type="date" className="h-8 px-2 text-xs border border-slate-300 rounded-lg" value={dateTo} onChange={e => setDateTo(e.target.value)} title="To Date" />
          </div>
        </div>
        <button className="h-8 px-3 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors">
          Export CSV / PDF
        </button>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Invoice No</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Payment Method</th>
                <th className="py-2.5 px-3 text-right">Amount (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{sale.invoiceNo}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{sale.customerName}</td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono">{sale.vehicleNo}</td>
                  <td className="py-2.5 px-3 text-slate-500">{sale.date}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sale.category === 'Parts' ? 'bg-blue-50 text-blue-700' : sale.category === 'Labor' ? 'bg-orange-50 text-orange-700' : 'bg-purple-50 text-purple-700'}`}>
                      {sale.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-medium">{sale.paymentMethod}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    ৳ {sale.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function SalesReportPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading sales report...</div>}>
      <SalesReportContent />
    </Suspense>
  );
}
