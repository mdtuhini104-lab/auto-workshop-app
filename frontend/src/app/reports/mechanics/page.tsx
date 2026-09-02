'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

interface MechanicPerformance {
  id: string;
  name: string;
  specialization: string;
  completedJobs: number;
  totalHours: number;
  laborGenerated: number;
  commissionEarned: number;
  rating: number;
}

const mockMechanics: MechanicPerformance[] = [
  { id: 'M-01', name: 'Rahim Uddin', specialization: 'Engine & Transmission', completedJobs: 24, totalHours: 112, laborGenerated: 85000, commissionEarned: 8500, rating: 4.9 },
  { id: 'M-02', name: 'Kamal Hossain', specialization: 'Auto Electrical & AC', completedJobs: 31, totalHours: 98, laborGenerated: 62000, commissionEarned: 6200, rating: 4.8 },
  { id: 'M-03', name: 'Tariqul Islam', specialization: 'Suspension & Brakes', completedJobs: 19, totalHours: 84, laborGenerated: 48000, commissionEarned: 4800, rating: 4.7 },
  { id: 'M-04', name: 'Billal Ahmed', specialization: 'Bodywork & Painting', completedJobs: 15, totalHours: 76, laborGenerated: 54000, commissionEarned: 5400, rating: 4.6 },
];

function MechanicsReportContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockMechanics.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mechanic Performance & Productivity</h1>
          <p className="text-xs text-slate-500 mt-1">Track completed job cards, labor hours billed, and incentive commissions.</p>
        </div>
        <Link href="/dashboard" prefetch={false} className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors shadow-xs w-fit">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
        <input 
          type="text" 
          placeholder="Filter mechanics by name or specialty..."
          aria-label="Filter mechanics report"
          className="w-72 h-8 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="h-8 px-3 bg-[#004e89] text-white rounded-lg text-xs font-semibold hover:bg-[#003d6c] transition-colors">
          Print Performance Sheet
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">ID</th>
              <th className="py-2.5 px-3">Mechanic Name</th>
              <th className="py-2.5 px-3">Specialization</th>
              <th className="py-2.5 px-3 text-center">Jobs Completed</th>
              <th className="py-2.5 px-3 text-center">Hours Billed</th>
              <th className="py-2.5 px-3 text-right">Labor Generated (৳)</th>
              <th className="py-2.5 px-3 text-right">Commission (৳)</th>
              <th className="py-2.5 px-3 text-center">Customer Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(m => (
              <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{m.id}</td>
                <td className="py-2.5 px-3 font-bold text-slate-900">{m.name}</td>
                <td className="py-2.5 px-3 text-slate-600 font-medium">{m.specialization}</td>
                <td className="py-2.5 px-3 text-center font-semibold text-slate-800">{m.completedJobs}</td>
                <td className="py-2.5 px-3 text-center font-mono text-slate-600">{m.totalHours} hrs</td>
                <td className="py-2.5 px-3 text-right font-bold text-slate-900">৳ {m.laborGenerated.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-right font-bold text-emerald-700">৳ {m.commissionEarned.toLocaleString()}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    ★ {m.rating}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function MechanicsReportPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading mechanics performance...</div>}>
      <MechanicsReportContent />
    </Suspense>
  );
}
