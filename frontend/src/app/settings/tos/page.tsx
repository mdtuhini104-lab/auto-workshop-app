'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function TosSettingsContent() {
  const [tosText, setTosText] = useState(`1. All estimations provided are valid for 15 days from issue date.
2. Spare parts replaced come with a 30-day manufacturing warranty.
3. Payment is due upon delivery of vehicle unless prior corporate credit terms apply.`);
  const [coverLetter, setCoverLetter] = useState(`Dear Valued Customer,

Thank you for choosing Mamun Automobiles ERP for your vehicle inspection and servicing. Below is the detailed quotation itemizing requested repairs and parts cost. Please review and approve.`);
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
        <span className="font-semibold text-slate-800 dark:text-slate-200">Terms of Service & Cover Letter</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Terms of Service & Cover Letter Editor</h1>
        <p className="text-xs text-slate-500 mt-1">Customize default quotation cover letter greeting and printed invoice terms of service.</p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
          ✓ TOS & Cover Letter templates saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-5 text-xs">
        <div className="space-y-1.5">
          <label className="font-bold text-slate-800 dark:text-slate-200">Default Quotation Cover Letter Text</label>
          <textarea 
            rows={4} 
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
            value={coverLetter}
            onChange={e => setCoverLetter(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-slate-800 dark:text-slate-200">Standard Printed Terms of Service (TOS)</label>
          <textarea 
            rows={5} 
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
            value={tosText}
            onChange={e => setTosText(e.target.value)}
          />
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c] transition-colors">
            Save TOS & Cover Letter
          </button>
        </div>
      </form>
    </div>
  );
}

export default function TosSettingsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading TOS settings...</div>}>
      <TosSettingsContent />
    </Suspense>
  );
}
