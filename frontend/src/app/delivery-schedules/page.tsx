"use client";

import React, { useState, useEffect } from 'react';

interface Delivery {
  id: number;
  order_no: string;
  client: string;
  scheduled_date: string;
  items: string;
  status: 'Pending' | 'Completed';
}

const mockDeliveries: Delivery[] = [
  { id: 1, order_no: 'WO-2607-101', client: 'John Doe', scheduled_date: '2026-07-25', items: 'Engine Servicing, Oil Change', status: 'Pending' },
  { id: 2, order_no: 'WO-2607-102', client: 'Sarah Smith', scheduled_date: '2026-07-20', items: 'Brake Pad Replacement', status: 'Completed' },
  { id: 3, order_no: 'WO-2607-103', client: 'Ahmed Transport', scheduled_date: '2026-07-22', items: 'Transmission Repair', status: 'Pending' }
];

export default function DeliverySchedulesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setDeliveries(mockDeliveries);
      setIsLoading(false);
    }, 400);
  }, []);

  const filtered = deliveries.filter(d => {
    if (activeTab !== 'All' && d.status !== activeTab) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!d.order_no.toLowerCase().includes(term) && !d.client.toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });

  const tabs = ['All', 'Pending', 'Completed'];

  const getStatusBadge = (status: Delivery['status']) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Completed': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Delivery Schedules</h1>
          <p className="text-sm text-slate-500 font-normal mt-1">Track and manage upcoming vehicle deliveries.</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Delivery Schedules
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap ${activeTab === tab ? 'font-semibold text-slate-900 bg-slate-100 dark:bg-slate-800 dark:text-white' : 'font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:hover:text-slate-300'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search orders..." className="w-64 py-2 px-3 pl-9 text-sm rounded-lg border border-slate-200 dark:border-slate-700 focus:border-[#004e89] outline-none bg-transparent" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap">Order #</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap">Client</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap">Scheduled Date</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap">Status</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap">Items</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={6} className="py-12 text-center text-slate-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-slate-400">No records found.</td></tr> :
              filtered.map(d => (
                <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap">{d.order_no}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap">{d.client}</td>
                  <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap">{d.scheduled_date}</td>
                  <td className="py-3 px-4 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusBadge(d.status)}`}>{d.status}</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap">{d.items}</td>
                  <td className="py-3 px-4 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap text-right">
                    <button className="text-sm font-semibold text-[#004e89] hover:underline">Details</button>
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
