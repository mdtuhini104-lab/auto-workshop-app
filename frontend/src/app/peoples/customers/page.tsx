'use client';

import React, { useState, useEffect } from 'react';
import CustomerProfileModal from '@/components/CustomerProfileModal';
import { fetchApi } from '@/utils/api';

interface Customer {
  id: string | number;
  name: string;
  phone: string;
  email: string;
  type: 'Corporate' | 'Individual';
  totalVehicles: number;
}

const DEFAULT_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Hasib Rahman', phone: '01711-223344', email: 'hasib@example.com', type: 'Individual', totalVehicles: 1 },
  { id: '2', name: 'Sarah Smith', phone: '01819-556677', email: 'sarah@example.com', type: 'Individual', totalVehicles: 1 },
  { id: '3', name: 'Europetex Limited', phone: '01711-889900', email: 'info@europetex.com', type: 'Corporate', totalVehicles: 1 },
  { id: '4', name: 'Tuhin Ahmed', phone: '01911-998877', email: 'tuhin@example.com', type: 'Individual', totalVehicles: 0 },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(DEFAULT_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await fetchApi('/api/api_customers.php?action=get_customers');
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setCustomers(res.data.map((c: any) => ({
            id: c.id,
            name: c.name || c.customer_name,
            phone: c.phone,
            email: c.email || 'N/A',
            type: c.company ? 'Corporate' : 'Individual',
            totalVehicles: Number(c.vehicle_count ?? 1)
          })));
        }
      } catch (e) {}
    };
    loadCustomers();
  }, []);

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
                  <button 
                    onClick={() => { setSelectedCustomer(c); setIsProfileModalOpen(true); }}
                    className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded text-xs font-semibold transition-colors inline-flex items-center gap-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    Fleet & History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Profile & Vehicle Ownership Modal */}
      <CustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => { setIsProfileModalOpen(false); setSelectedCustomer(null); }}
        customer={selectedCustomer}
      />
    </div>
  );
}
