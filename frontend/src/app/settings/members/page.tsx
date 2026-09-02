'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function MembersContent() {
  const [notifyMechanics, setNotifyMechanics] = useState(true);
  const [notifyAccountant, setNotifyAccountant] = useState(true);
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
        <span className="font-semibold text-slate-800 dark:text-slate-200">Members Notifications</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Staff & Member Notifications</h1>
        <p className="text-xs text-slate-500 mt-1">Configure automated internal dispatch alerts for mechanics, workshop managers, and accountants.</p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
          ✓ Member notification settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Alert Mechanics when Work Order is Assigned</span>
            <span className="text-slate-500">Send push notification to assigned mechanic upon job allocation.</span>
          </div>
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            checked={notifyMechanics}
            onChange={e => setNotifyMechanics(e.target.checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Alert Accountant on Unpaid Invoice Expiry</span>
            <span className="text-slate-500">Notify accounts department when invoice credit period exceeds 30 days.</span>
          </div>
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            checked={notifyAccountant}
            onChange={e => setNotifyAccountant(e.target.checked)}
          />
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c]">
            Save Member Notification Rules
          </button>
        </div>
      </form>
    </div>
  );
}

export default function MembersPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading members settings...</div>}>
      <MembersContent />
    </Suspense>
  );
}
