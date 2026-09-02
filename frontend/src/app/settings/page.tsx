'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function SettingsMainContent() {
  const [isSaved, setIsSaved] = useState(false);
  const [orgData, setOrgData] = useState({
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
    setOrgData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6 text-slate-800 dark:text-slate-100 font-sans">
      {/* Breadcrumb Header */}
      <div className="text-xs text-slate-500 space-x-1">
        <span>Settings</span>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">Organization & Profile</span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Organization Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage core workshop business identity, tax registration, and primary contact details.</p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
          ✓ Organization settings saved successfully!
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/settings/profile" prefetch={false} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#004e89] transition space-y-1 block">
          <div className="text-xs font-bold text-slate-900 dark:text-white">Workshop Profile</div>
          <p className="text-[11px] text-slate-500">Edit address, phone, and business email.</p>
        </Link>
        <Link href="/settings/roles" prefetch={false} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#004e89] transition space-y-1 block">
          <div className="text-xs font-bold text-slate-900 dark:text-white">Roles & Permissions</div>
          <p className="text-[11px] text-slate-500">Manage Admin, Manager, and Mechanic access.</p>
        </Link>
        <Link href="/settings/accounts/calendars" prefetch={false} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#004e89] transition space-y-1 block">
          <div className="text-xs font-bold text-slate-900 dark:text-white">Connected Accounts</div>
          <p className="text-[11px] text-slate-500">Google Calendar, WhatsApp API & SMS.</p>
        </Link>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/60 pb-2">Business Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Organization Name</label>
            <input 
              type="text" 
              name="workshopName"
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
              value={orgData.workshopName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Tagline / Slogan</label>
            <input 
              type="text" 
              name="tagline"
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
              value={orgData.tagline}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="font-bold text-slate-700 dark:text-slate-300">Official Street Address</label>
            <textarea 
              name="address"
              rows={2}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
              value={orgData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Official Phone Number</label>
            <input 
              type="text" 
              name="phone"
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
              value={orgData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Contact Email</label>
            <input 
              type="email" 
              name="email"
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
              value={orgData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">NBR VAT / BIN Number</label>
            <input 
              type="text" 
              name="binNumber"
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
              value={orgData.binNumber}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Currency Symbol</label>
            <input 
              type="text" 
              name="currencySymbol"
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
              value={orgData.currencySymbol}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c] transition-colors">
            Save Organization Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading organization settings...</div>}>
      <SettingsMainContent />
    </Suspense>
  );
}
