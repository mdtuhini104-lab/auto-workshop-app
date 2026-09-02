'use client';

import React, { useState } from 'react';

interface VendorPeople {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  category: string;
  status: 'Active' | 'Inactive';
}

const DEFAULT_PEOPLE_VENDORS: VendorPeople[] = [
  { id: 'VND-001', name: 'Akij Motors Ltd', contactPerson: 'Mamunur Rashid', phone: '01711-223344', category: 'Spare Parts & Filters', status: 'Active' },
  { id: 'VND-002', name: 'Navana Toyota Motors', contactPerson: 'Tariqul Islam', phone: '01819-556677', category: 'OEM Body & Engine Parts', status: 'Active' },
];

export default function PeoplesVendorsPage() {
  const [vendors] = useState<VendorPeople[]>(DEFAULT_PEOPLE_VENDORS);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vendors & Suppliers Contacts</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Directory of supplier contact managers, representatives, and accounts leads</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          + Add Vendor Contact
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Vendor Contacts</p>
          <p className="text-2xl font-black text-slate-900 mt-2">{vendors.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Active Accounts</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">{vendors.filter(v=>v.status==='Active').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Primary Representative</p>
          <p className="text-2xl font-black text-[#004e89] mt-2">Mamunur Rashid</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Support Network</p>
          <p className="text-2xl font-black text-amber-600 mt-[#0.5rem]">24/7 Supply</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Vendor ID</th>
              <th className="py-3 px-4">Vendor / Company</th>
              <th className="py-3 px-4">Contact Representative</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vendors.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-bold text-[#004e89]">{v.id}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{v.name}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{v.contactPerson}</td>
                <td className="py-3 px-4 font-mono text-slate-600">{v.phone}</td>
                <td className="py-3 px-4 text-slate-600">{v.category}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{v.status}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">Contact</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
