'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function EmailsContent() {
  const [smtpHost, setSmtpHost] = useState('smtp.sendgrid.net');
  const [smtpPort, setSmtpPort] = useState('587');
  const [senderEmail, setSenderEmail] = useState('billing@mamunautomobiles.com');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl text-slate-800 dark:text-slate-100">
      <div className="text-xs text-slate-500 space-x-1">
        <Link href="/settings" prefetch={false} className="hover:underline">Settings</Link>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">Emails</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Emails & SMTP Server</h1>
        <p className="text-xs text-slate-500 mt-1">Configure outbound SendGrid / SMTP credentials for sending invoices and receipts.</p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
          ✓ SMTP email settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-800 dark:text-slate-200">SMTP Host / Server</label>
            <input 
              type="text" 
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
              value={smtpHost}
              onChange={e => setSmtpHost(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-800 dark:text-slate-200">SMTP Port</label>
            <input 
              type="text" 
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
              value={smtpPort}
              onChange={e => setSmtpPort(e.target.value)}
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="font-bold text-slate-800 dark:text-slate-200">Default Sender Email Address</label>
            <input 
              type="email" 
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
              value={senderEmail}
              onChange={e => setSenderEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <button type="button" className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700">
            Send Test Email
          </button>
          <button type="submit" className="px-4 py-2 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c]">
            Save Email Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EmailsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading email settings...</div>}>
      <EmailsContent />
    </Suspense>
  );
}
