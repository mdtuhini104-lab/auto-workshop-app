'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function TaxSettingsContent() {
  const [vatRate, setVatRate] = useState('15');
  const [binNumber, setBinNumber] = useState('001234567-0101');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl text-slate-800 dark:text-slate-100 font-sans">
      <div className="text-xs text-slate-500 space-x-1">
        <Link href="/settings" prefetch={false} className="hover:underline">Settings</Link>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">Tax</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Tax & NBR VAT Configuration</h1>
        <p className="text-xs text-slate-500 mt-1">Configure national tax percentage rate, BIN registration numbers, and invoice tax line rules.</p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
          ✓ Tax settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-200">NBR BIN (Business Identification Number)</label>
          <input 
            type="text" 
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent font-mono"
            value={binNumber}
            onChange={e => setBinNumber(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-200">Default Standard VAT Rate (%)</label>
          <input 
            type="number" 
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
            value={vatRate}
            onChange={e => setVatRate(e.target.value)}
          />
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c]">
            Save Tax Configuration
          </button>
        </div>
      </form>
    </div>
  );
}

export default function TaxSettingsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading tax settings...</div>}>
      <TaxSettingsContent />
    </Suspense>
  );
}
