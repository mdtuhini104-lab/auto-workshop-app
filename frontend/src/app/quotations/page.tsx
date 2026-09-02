"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Quotation {
  id: number;
  quote_no: string;
  customer_name: string;
  plate_number: string;
  total_amount: number;
  date: string;
  status: 'Draft' | 'Review' | 'Approved' | 'Rejected' | 'Converted' | 'Trash';
}

const mockQuotations: Quotation[] = [
  { id: 1, quote_no: 'QT-2607-001', customer_name: 'John Doe', plate_number: 'DHK-12-3456', total_amount: 45000, date: '2026-07-21', status: 'Approved' },
  { id: 2, quote_no: 'QT-2607-002', customer_name: 'Sarah Smith', plate_number: 'CTG-45-7890', total_amount: 12500, date: '2026-07-20', status: 'Approved' },
  { id: 3, quote_no: 'QT-2607-003', customer_name: 'Ahmed Transport', plate_number: 'SYL-77-1122', total_amount: 150000, date: '2026-07-19', status: 'Draft' },
  { id: 4, quote_no: 'QT-2607-004', customer_name: 'Emma Johnson', plate_number: 'RAJ-99-4455', total_amount: 8500, date: '2026-07-18', status: 'Rejected' }
];

function QuotationsContent() {
  const router = useRouter();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setQuotations(mockQuotations);
      setIsLoading(false);
    }, 400);
  }, []);

  const handleConvertToInvoice = (q: Quotation) => {
    const invNo = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

    // Create Invoice Record in Local Storage
    const existingInvoices = JSON.parse(localStorage.getItem('invoices_list') || '[]');
    const newInvoice = {
      id: Date.now(),
      invoiceNo: invNo,
      quoteNo: q.quote_no,
      customerName: q.customer_name,
      plateNumber: q.plate_number,
      totalAmount: q.total_amount,
      status: 'Unpaid',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    localStorage.setItem('invoices_list', JSON.stringify([newInvoice, ...existingInvoices]));

    // Update parent Quotation status
    setQuotations(prev => prev.map(item => item.id === q.id ? { ...item, status: 'Converted' } : item));

    // Show Success Toast Notification & Redirect
    setToastMessage(`Quotation #${q.quote_no} successfully converted to Invoice #${invNo}! Redirecting to Billing...`);

    setTimeout(() => {
      router.push('/billing');
    }, 1800);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this quotation?")) {
      setQuotations(prev => prev.filter(q => q.id !== id));
    }
  };

  const filtered = quotations.filter(q => {
    if (activeTab !== 'All' && q.status !== activeTab) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!q.quote_no.toLowerCase().includes(term) && !q.customer_name.toLowerCase().includes(term) && !q.plate_number.toLowerCase().includes(term)) {
        return false;
      }
    }
    if (dateFrom && new Date(q.date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(q.date) > new Date(dateTo)) return false;
    return true;
  });

  const tabs = ['All', 'Draft', 'Review', 'Approved', 'Converted', 'Rejected', 'Trash'];

  const getStatusBadge = (status: Quotation['status']) => {
    switch (status) {
      case 'Draft': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
      case 'Review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Approved': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Converted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Trash': return 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-500';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-6 h-full flex flex-col font-sans text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Quotations</h1>
          <p className="text-sm text-slate-500 font-normal mt-1">Manage customer quotes, estimates, and 1-click invoice conversions.</p>
        </div>
        <Link href="/quotations/create" prefetch={false} className="bg-[#004e89] hover:bg-[#003d6c] text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Quotation
        </Link>
      </div>

      {toastMessage && (
        <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 text-xs rounded-md transition-colors whitespace-nowrap ${activeTab === tab ? 'font-bold text-slate-900 bg-slate-100 dark:bg-slate-800 dark:text-white' : 'font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:hover:text-slate-300'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <input type="date" className="py-2 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:border-[#004e89]" value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="From Date" />
            <span className="text-slate-400">-</span>
            <input type="date" className="py-2 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:border-[#004e89]" value={dateTo} onChange={e => setDateTo(e.target.value)} title="To Date" />
          </div>
          <div className="relative">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search by quote no, customer..." 
              aria-label="Filter quotations"
              className="w-56 py-2 px-3 pl-9 text-xs rounded-lg border border-slate-200 dark:border-slate-700 focus:border-[#004e89] outline-none bg-transparent" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <button className="py-2 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
            Bulk Actions
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 w-10"><input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" /></th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">Quotation No</th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">Customer</th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">Vehicle No</th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">Date</th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">Status</th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap text-right">Amount</th>
              <th className="text-slate-500 font-semibold py-3 px-4 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr><td colSpan={8} className="py-12 text-center text-slate-400">Loading quotations...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="py-12 text-center text-slate-400">No records found.</td></tr>
            ) : (
              filtered.map(q => (
                <tr key={q.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4"><input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300" /></td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white font-mono">{q.quote_no}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">{q.customer_name}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{q.plate_number}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{q.date}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusBadge(q.status)}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white text-right font-mono">
                    ৳ {q.total_amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </td>
                  <td className="py-2.5 px-4 text-right space-x-2 flex justify-end items-center">
                    {/* Convert to Invoice Prominent Action Button */}
                    {q.status !== 'Converted' && q.status !== 'Rejected' && (
                      <button 
                        type="button" 
                        onClick={() => handleConvertToInvoice(q)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                        title="Convert to Invoice"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Convert to Invoice</span>
                      </button>
                    )}

                    <Link href={`/quotations/view?id=${q.id}`} prefetch={false} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded inline-flex" title="View">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </Link>
                    <Link href={`/quotations/create?id=${q.id}`} prefetch={false} className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded inline-flex" title="Edit">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </Link>
                    <button type="button" onClick={() => handleDelete(q.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded inline-flex" title="Delete">
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

export default function QuotationsListPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs text-slate-400">Loading quotations...</div>}>
      <QuotationsContent />
    </Suspense>
  );
}
