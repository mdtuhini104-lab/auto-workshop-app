'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Wrench, CheckCircle2, FileText } from 'lucide-react';

interface JobCard {
  id: string;
  jobNo: string;
  customerName: string;
  plateNumber: string;
  mechanic: string;
  serviceSummary: string;
  partsUsed: number;
  totalAmount: number;
  status: 'In-Progress' | 'Waiting for Parts' | 'Ready for Delivery' | 'Completed';
  date: string;
}

const initialJobCards: JobCard[] = [
  { id: '1', jobNo: 'JOB-2026-089', customerName: 'John Doe', plateNumber: 'DHK-12-3456', mechanic: 'Samim (Senior AC Technician)', serviceSummary: 'Periodic Maintenance, Oil Filter & AC Servicing', partsUsed: 3, totalAmount: 45000, status: 'In-Progress', date: '2026-08-07' },
  { id: '2', jobNo: 'JOB-2026-088', customerName: 'Sarah Smith', plateNumber: 'CTG-45-7890', mechanic: 'Sagor (Senior Engine Technician)', serviceSummary: 'Brake Pad Replacement & Rotor Turning', partsUsed: 2, totalAmount: 12500, status: 'Ready for Delivery', date: '2026-08-06' },
  { id: '3', jobNo: 'JOB-2026-087', customerName: 'Ahmed Transport', plateNumber: 'SYL-77-1122', mechanic: 'Kamal Hossain', serviceSummary: 'Full Suspension Overhaul & Bushing Replacement', partsUsed: 8, totalAmount: 150000, status: 'Waiting for Parts', date: '2026-08-05' },
];

function JobCardsContent() {
  const router = useRouter();
  const [jobCards, setJobCards] = useState<JobCard[]>(initialJobCards);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleConvertToInvoice = (card: JobCard) => {
    // Generate Invoice in local storage
    const invNo = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const existingInvoices = JSON.parse(localStorage.getItem('invoices_list') || '[]');
    const newInvoice = {
      id: Date.now(),
      invoiceNo: invNo,
      quoteNo: card.jobNo,
      customerName: card.customerName,
      plateNumber: card.plateNumber,
      totalAmount: card.totalAmount,
      status: 'Unpaid',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    localStorage.setItem('invoices_list', JSON.stringify([newInvoice, ...existingInvoices]));

    setToastMessage(`✓ Job Card #${card.jobNo} converted to Invoice #${invNo}! Redirecting to Billing...`);
    setTimeout(() => {
      router.push('/billing');
    }, 1800);
  };

  const filtered = jobCards.filter(j => {
    if (activeTab !== 'All' && j.status !== activeTab) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return j.jobNo.toLowerCase().includes(term) || j.customerName.toLowerCase().includes(term) || j.plateNumber.toLowerCase().includes(term) || j.mechanic.toLowerCase().includes(term);
    }
    return true;
  });

  const getStatusBadge = (status: JobCard['status']) => {
    switch (status) {
      case 'In-Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
      case 'Waiting for Parts': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
      case 'Ready for Delivery': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';
      case 'Completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-800 dark:text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 space-x-1 mb-1">
            <Link href="/dashboard" prefetch={false} className="hover:underline">Dashboard</Link>
            <span>&gt;</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Job Cards</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Work Orders & Job Cards</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track vehicle service progress, technician assignments, spare parts usage, and 1-click billing.</p>
        </div>

        <Link 
          href="/job-cards/create"
          prefetch={false}
          className="px-4 py-2.5 bg-[#004e89] hover:bg-[#003d6c] text-white font-bold rounded-lg text-xs transition shadow-xs flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Job Card</span>
        </Link>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar pb-1">
          {(['All', 'In-Progress', 'Waiting for Parts', 'Ready for Delivery', 'Completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search by job no, customer, plate..." 
            aria-label="Filter job cards"
            className="w-64 py-2 px-3 pl-9 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-1 focus:ring-[#004e89]" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {/* Job Cards Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Job No</th>
                <th className="py-3 px-4">Customer & Vehicle</th>
                <th className="py-3 px-4">Assigned Technician</th>
                <th className="py-3 px-4">Service Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filtered.map(card => (
                <tr key={card.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">{card.jobNo}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{card.customerName}</span>
                    <span className="font-mono text-[11px] text-slate-500">{card.plateNumber}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{card.mechanic}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 truncate max-w-xs">{card.serviceSummary}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(card.status)}`}>
                      {card.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                    <button 
                      onClick={() => handleConvertToInvoice(card)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs inline-flex items-center gap-1.5"
                      title="Convert Job Card to Invoice"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>🧾 Convert to Invoice & Billing</span>
                    </button>
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

export default function JobCardsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading job cards...</div>}>
      <JobCardsContent />
    </Suspense>
  );
}
