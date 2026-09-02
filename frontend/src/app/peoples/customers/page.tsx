'use client';

import React, { useState } from 'react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: 'Corporate' | 'Individual';
  totalVehicles: number;
}

const DEFAULT_CUSTOMERS: Customer[] = [
  { id: 'CUST-001', name: 'Europetex Limited', phone: '01711-889900', email: 'info@europetex.com', type: 'Corporate', totalVehicles: 4 },
  { id: 'CUST-002', name: 'Mr. Rafiqul Islam', phone: '01819-221100', email: 'rafiqul@gmail.com', type: 'Individual', totalVehicles: 1 },
];

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(DEFAULT_CUSTOMERS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Directory</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Corporate fleet clients and individual vehicle owners</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          + Add New Customer
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Clients</p>
          <p className="text-2xl font-black text-slate-900 mt-2">{customers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Corporate Fleets</p>
          <p className="text-2xl font-black text-[#004e89] mt-2">{customers.filter(c=>c.type==='Corporate').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Individual Owners</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">{customers.filter(c=>c.type==='Individual').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Registered Vehicles</p>
          <p className="text-2xl font-black text-amber-600 mt-2">{customers.reduce((a,b)=>a+b.totalVehicles,0)} Cars</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Customer ID</th>
              <th className="py-3 px-4">Full Name / Company</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Client Type</th>
              <th className="py-3 px-4 text-center">Vehicles Count</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-bold text-[#004e89]">{c.id}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                <td className="py-3 px-4 font-mono text-slate-600">{c.phone}</td>
                <td className="py-3 px-4 text-slate-600">{c.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${c.type==='Corporate'?'bg-blue-50 text-blue-700 border-blue-200':'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    {c.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-bold text-slate-800">{c.totalVehicles} Cars</td>
                <td className="py-3 px-4 text-right">
                  <button className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">View Profile</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
