'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function PreferencesContent() {
  const [autoPrint, setAutoPrint] = useState(true);
  const [language, setLanguage] = useState('en');
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
        <span className="font-semibold text-slate-800 dark:text-slate-200">Preferences</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System Preferences</h1>
        <p className="text-xs text-slate-500 mt-1">Configure default auto-printing options, default language, and auto-save timers.</p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
          ✓ System preferences updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Auto-Open Print Dialog after Invoice Creation</span>
            <span className="text-slate-500">Automatically trigger browser print preview when a bill or quote is saved.</span>
          </div>
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            checked={autoPrint}
            onChange={e => setAutoPrint(e.target.checked)}
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-200">Default System Interface Language</label>
          <select 
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value="en">English (US)</option>
            <option value="bn">Bangla (বাংলা)</option>
          </select>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c]">
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PreferencesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading preferences...</div>}>
      <PreferencesContent />
    </Suspense>
  );
}
