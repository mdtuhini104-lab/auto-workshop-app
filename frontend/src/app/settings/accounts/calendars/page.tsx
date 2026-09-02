'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function CalendarsContent() {
  const [googleSync, setGoogleSync] = useState(true);
  const [autoCreateEvents, setAutoCreateEvents] = useState(true);
  const [iCalUrl, setICalUrl] = useState('https://mamunautomobiles.com/api/v1/calendar/feed.ics');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl text-slate-800 dark:text-slate-100">
      {/* Breadcrumb Header */}
      <div className="text-xs text-slate-500 space-x-1">
        <Link href="/settings" prefetch={false} className="hover:underline">Settings</Link>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">Calendars</span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Calendars</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your calendar integrations</p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
          ✓ Calendar integration settings saved successfully!
        </div>
      )}

      {/* Google Calendar Card */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Google Calendar Sync</h2>
              <p className="text-xs text-slate-500">Sync service appointments automatically with Google Calendar.</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full">
            Connected
          </span>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Enable Two-Way Calendar Sync</span>
              <span className="text-slate-500">Sync booking updates between ERP and Google Calendar.</span>
            </div>
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              checked={googleSync}
              onChange={e => setGoogleSync(e.target.checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Auto-Create Event on Service Booking</span>
              <span className="text-slate-500">Automatically create calendar invites for mechanics upon booking confirmation.</span>
            </div>
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              checked={autoCreateEvents}
              onChange={e => setAutoCreateEvents(e.target.checked)}
            />
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="font-bold text-slate-800 dark:text-slate-200">Private iCal Subscription URL</label>
            <input 
              type="text" 
              className="w-full h-9 px-3 text-xs border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-slate-50 dark:bg-slate-700 font-mono text-slate-700 dark:text-slate-200"
              value={iCalUrl}
              onChange={e => setICalUrl(e.target.value)}
              readOnly
            />
            <span className="text-[11px] text-slate-400">Copy this iCal link into Outlook or Apple Calendar for live schedule updates.</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
          <button type="submit" className="px-4 py-2 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c] transition-colors">
            Save Calendar Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CalendarsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading calendar integrations...</div>}>
      <CalendarsContent />
    </Suspense>
  );
}
