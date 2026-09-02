"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Inspection {
  id: number;
  date: string;
  customer_name: string;
  customer_phone: string;
  vehicle_no: string;
  mechanic: string;
  problems: { level: 'Low' | 'Medium' | 'High'; desc: string }[];
  status: 'Open' | 'Under Review' | 'Converted' | 'Closed';
}

const mockInspections: Inspection[] = [
  { id: 1, date: '2026-07-21', customer_name: 'John Doe', customer_phone: '01711223344', vehicle_no: 'DHK-12-3456', mechanic: 'Karim', problems: [{ level: 'High', desc: 'Engine Knocking' }, { level: 'Low', desc: 'Wiper Fluid' }], status: 'Open' },
  { id: 2, date: '2026-07-20', customer_name: 'Sarah Smith', customer_phone: '01855667788', vehicle_no: 'CTG-45-7890', mechanic: 'Rahim', problems: [{ level: 'Medium', desc: 'Brake Pads Worn' }], status: 'Under Review' },
  { id: 3, date: '2026-07-19', customer_name: 'Ahmed Transport', customer_phone: '01999887766', vehicle_no: 'SYL-77-1122', mechanic: 'Jabbar', problems: [{ level: 'High', desc: 'Transmission Leak' }], status: 'Converted' },
  { id: 4, date: '2026-07-18', customer_name: 'Emma Johnson', customer_phone: '01544332211', vehicle_no: 'RAJ-99-4455', mechanic: 'Tariq', problems: [{ level: 'Low', desc: 'AC Not Cooling' }], status: 'Closed' }
];

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setInspections(mockInspections);
      setIsLoading(false);
    }, 400);
  }, []);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setInspections(prev => prev.filter(item => item.id !== id));
    }
  };

  const filtered = inspections.filter(item => {
    if (activeTab !== 'All' && item.status !== activeTab) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!item.customer_name.toLowerCase().includes(term) && !item.vehicle_no.toLowerCase().includes(term) && !item.customer_phone.includes(term)) {
        return false;
      }
    }
    if (dateFrom && new Date(item.date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(item.date) > new Date(dateTo)) return false;
    return true;
  });

  const tabs = ['All', 'Open', 'Under Review', 'Converted', 'Closed'];

  const getStatusBadge = (status: Inspection['status']) => {
    switch(status) {
      case 'Converted': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Under Review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Closed': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getProblemBadge = (level: 'Low' | 'Medium' | 'High') => {
    switch(level) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Low': return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Inspections</h1>
          <p className="text-sm text-slate-500 font-normal mt-1">Manage pre-quotations vehicle inspections</p>
        </div>
        <Link href="/quotations/inspections/create" prefetch={false} className="bg-[#004e89] hover:bg-[#003d6c] text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create Inspection
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap ${activeTab === tab ? 'font-semibold text-slate-900 bg-slate-100 dark:bg-slate-800 dark:text-white' : 'font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:hover:text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <input type="date" className="py-2 px-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:border-[#004e89]" value={dateFrom} onChange={e => setDateFrom(e.target.value)} title="From Date" />
            <span className="text-slate-400">-</span>
            <input type="date" className="py-2 px-3 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:border-[#004e89]" value={dateTo} onChange={e => setDateTo(e.target.value)} title="To Date" />
          </div>
          <div className="relative">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search..." className="w-48 py-2 px-3 pl-9 text-sm rounded-lg border border-slate-200 dark:border-slate-700 focus:border-[#004e89] outline-none bg-transparent" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="py-2 px-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
            Bulk Actions
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto pb-4 flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 w-10"><input type="checkbox" className="w-4 h-4 rounded text-blue-600 bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600" /></th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap">Date</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap">Customer</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap">Vehicle</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap">Mechanic</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap">Problems</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap">Status</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 dark:border-slate-800 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={8} className="py-12 text-center text-slate-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={8} className="py-12 text-center text-slate-400">No records found.</td></tr> :
              filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 border-b border-slate-100 dark:border-slate-800/50"><input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300 dark:bg-slate-800 dark:border-slate-600" /></td>
                  <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap">{item.date}</td>
                  <td className="py-3 px-4 text-sm border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{item.customer_name}</div>
                    <div className="text-xs text-slate-500">{item.customer_phone}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap">{item.vehicle_no}</td>
                  <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap">{item.mechanic}</td>
                  <td className="py-3 px-4 border-b border-slate-100 dark:border-slate-800/50">
                    <div className="flex flex-col gap-1">
                      {item.problems.map((p, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${getProblemBadge(p.level)}`}>{p.level}</span>
                          <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{p.desc}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>{item.status}</span>
                  </td>
                  <td className="py-2.5 px-3 border-b border-slate-100 dark:border-slate-800/50 whitespace-nowrap text-right space-x-1.5 flex justify-end items-center">
                    <Link href={`/quotations/inspections/view?id=${item.id}`} prefetch={false} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded inline-flex" title="View">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </Link>
                    <Link href={`/quotations/inspections/create?edit=${item.id}`} prefetch={false} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded inline-flex" title="Edit">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </Link>
                    <Link href={`/quotations/create?fromInspection=${item.id}`} prefetch={false} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded inline-flex" title="Convert to Quote">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                    <button type="button" onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded inline-flex" title="Delete">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
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
