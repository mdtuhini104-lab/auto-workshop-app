"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

interface Bill {
  id: number;
  bill_no: string;
  date: string;
  customer: string;
  vehicle: string;
  total: number;
  paid: number;
  due: number;
  status: 'Paid' | 'Unpaid' | 'Partial';
}

const mockBills: Bill[] = [
  { id: 1, bill_no: 'INV-2607-001', date: '2026-07-21', customer: 'John Doe', vehicle: 'DHK-12-3456', total: 12500, paid: 12500, due: 0, status: 'Paid' },
  { id: 2, bill_no: 'INV-2607-002', date: '2026-07-20', customer: 'Sarah Smith', vehicle: 'CTG-45-7890', total: 8000, paid: 4000, due: 4000, status: 'Partial' },
  { id: 3, bill_no: 'INV-2607-003', date: '2026-07-19', customer: 'Ahmed Transport', vehicle: 'SYL-77-1122', total: 45000, paid: 0, due: 45000, status: 'Unpaid' }
];

function BillingContent() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Read dynamically converted invoices from localStorage
    const savedInvoices = localStorage.getItem('invoices_list');
    let converted: Bill[] = [];
    if (savedInvoices) {
      try {
        const parsed = JSON.parse(savedInvoices);
        if (Array.isArray(parsed)) {
          converted = parsed.map((inv: any) => ({
            id: inv.id,
            bill_no: inv.invoiceNo,
            date: inv.issueDate || '2026-08-07',
            customer: inv.customerName,
            vehicle: inv.plateNumber,
            total: inv.totalAmount,
            paid: 0,
            due: inv.totalAmount,
            status: 'Unpaid'
          }));
        }
      } catch (e) {}
    }

    setTimeout(() => {
      setBills([...converted, ...mockBills]);
      setIsLoading(false);
    }, 300);
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      setBills(prev => prev.filter(b => b.id !== id));
    }
  };

  const filtered = bills.filter(b => {
    if (activeTab === 'Paid' && b.status !== 'Paid') return false;
    if (activeTab === 'Unpaid' && b.status === 'Paid') return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!b.bill_no.toLowerCase().includes(term) && !b.customer.toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });

  const tabs = ['All', 'Paid', 'Unpaid'];

  const getStatusBadge = (status: Bill['status']) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Unpaid': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Partial': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-6 h-full flex flex-col font-sans text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Billing & Invoice</h1>
          <p className="text-sm text-slate-500 font-normal mt-1">Manage workshop billing, payments and generate invoices.</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Bill
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap ${activeTab === tab ? 'font-bold text-slate-900 bg-slate-100 dark:bg-slate-800 dark:text-white' : 'font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:hover:text-slate-300'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search invoices..." 
              aria-label="Filter invoices"
              className="w-48 py-2 px-3 pl-9 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:border-[#004e89] outline-none bg-transparent" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <button className="py-2 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            Bulk Actions
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 w-10"><input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" /></th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">Invoice No</th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">Date</th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">Customer</th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">Vehicle</th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">Status</th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap text-right">Total</th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap text-right">Paid</th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap text-right">Due</th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr><td colSpan={10} className="py-12 text-center text-slate-400">Loading invoices...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={10} className="py-12 text-center text-slate-400">No invoices found.</td></tr>
            ) : (
              filtered.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4"><input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" /></td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white font-mono">{b.bill_no}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{b.date}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">{b.customer}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{b.vehicle}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusBadge(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white text-right font-mono">৳ {b.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="py-3 px-4 text-emerald-600 font-semibold text-right font-mono">৳ {b.paid.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="py-3 px-4 text-rose-600 font-semibold text-right font-mono">৳ {b.due.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="py-2.5 px-4 text-right space-x-1.5 flex justify-end items-center">
                    <Link href={`/settings/invoice-template`} prefetch={false} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded inline-flex" title="Print Invoice">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    </Link>
                    <button type="button" onClick={() => handleDelete(b.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded inline-flex" title="Delete">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs text-slate-400">Loading billing invoices...</div>}>
      <BillingContent />
    </Suspense>
  );
}
