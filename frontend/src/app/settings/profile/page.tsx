'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function ProfileSettingsContent() {
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    workshopName: 'Mamun Automobiles ERP',
    tagline: 'Luxury Automobile Care & Service Center',
    address: 'Plot # 197, Sector # 7, Uttara, Dhaka-1230',
    phone: '+880 1711-000000',
    email: 'info@mamunautomobiles.com',
    binNumber: '001234567-0101',
    vatRate: '15',
    currencySymbol: '৳'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto text-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workshop Profile & Branding</h1>
          <p className="text-xs text-slate-500 mt-1">Configure workshop identity, tax registration, and official receipt headers.</p>
        </div>
        <Link href="/dashboard" prefetch={false} className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors shadow-xs">
          &larr; Back to Dashboard
        </Link>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-between">
          <span>✓ Workshop profile updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Workshop Business Name</label>
            <input 
              type="text" 
              name="workshopName"
              className="w-full h-9 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
              value={formData.workshopName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Tagline / Slogan</label>
            <input 
              type="text" 
              name="tagline"
              className="w-full h-9 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
              value={formData.tagline}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-700">Official Workshop Address</label>
            <textarea 
              name="address"
              rows={2}
              className="w-full p-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Official Phone Number</label>
            <input 
              type="text" 
              name="phone"
              className="w-full h-9 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Contact Email</label>
            <input 
              type="email" 
              name="email"
              className="w-full h-9 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">NBR VAT / BIN Number</label>
            <input 
              type="text" 
              name="binNumber"
              className="w-full h-9 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
              value={formData.binNumber}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Default Currency Symbol</label>
            <input 
              type="text" 
              name="currencySymbol"
              className="w-full h-9 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
              value={formData.currencySymbol}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c] transition-colors shadow-sm">
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProfileSettingsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading workshop profile...</div>}>
      <ProfileSettingsContent />
    </Suspense>
  );
}
