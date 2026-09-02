'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Vendor } from '@/types/erp';
import { INITIAL_VENDORS } from '@/data/initialMockData';

export default function CreateVendorPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Spare Parts & Filters');
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter Vendor Name.');
      return;
    }

    const newVendor: Vendor = {
      id: `VND-${Date.now().toString().slice(-3)}`,
      name,
      contactPerson,
      phone,
      category,
      balance,
      status,
    };

    const saved = localStorage.getItem('erp_vendors');
    let existing: Vendor[] = saved ? JSON.parse(saved) : INITIAL_VENDORS;
    const updated = [newVendor, ...existing];
    localStorage.setItem('erp_vendors', JSON.stringify(updated));

    router.push('/purchases/vendors');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          &larr; Back to Vendors
        </button>
        <h1 className="text-xl font-bold text-slate-900">Add New Supplier / Vendor</h1>
        <div className="w-16" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#004e89] border-b border-slate-100 pb-2">
          Vendor & Contact Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Company Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Akij Motors Ltd"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Contact Person Name</label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="e.g. Mamunur Rashid"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01711-XXXXXX"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Supply Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            >
              <option value="Spare Parts & Filters">Spare Parts & Filters</option>
              <option value="OEM Body & Engine Parts">OEM Body & Engine Parts</option>
              <option value="Lubricants & Oils">Lubricants & Oils</option>
              <option value="Electrical & Batteries">Electrical & Batteries</option>
              <option value="Tools & Equipment">Tools & Equipment</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Opening Payable Balance (৳)</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Account Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-white text-slate-700 border border-slate-300 font-semibold rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#004e89] hover:bg-[#003d6c] text-white font-bold rounded-lg text-sm transition-colors shadow-sm"
          >
            Save Vendor Profile
          </button>
        </div>
      </form>
    </div>
  );
}
