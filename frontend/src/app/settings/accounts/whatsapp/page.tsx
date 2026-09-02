'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function WhatsAppContent() {
  const [phoneNumberId, setPhoneNumberId] = useState('109827364519283');
  const [apiToken, setApiToken] = useState('EAAG...892834');
  const [testSent, setTestSent] = useState(false);

  const handleTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl text-slate-800 dark:text-slate-100">
      <div className="text-xs text-slate-500 space-x-1">
        <Link href="/settings" prefetch={false} className="hover:underline">Settings</Link>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">WhatsApp</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">WhatsApp Business API Integration</h1>
        <p className="text-xs text-slate-500 mt-1">Send automatic WhatsApp service estimates, vehicle photos, and payment receipts to customers.</p>
      </div>

      {testSent && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
          ✓ Test WhatsApp notification dispatched to admin number!
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-200">WhatsApp Phone Number ID</label>
          <input 
            type="text" 
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
            value={phoneNumberId}
            onChange={e => setPhoneNumberId(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-200">Permanent Access Token</label>
          <input 
            type="password" 
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent font-mono"
            value={apiToken}
            onChange={e => setApiToken(e.target.value)}
          />
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <button type="button" onClick={handleTest} className="px-3 py-1.5 border border-emerald-500 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
            Send Test WhatsApp Message
          </button>
          <button type="button" className="px-4 py-2 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c]">
            Save Credentials
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading WhatsApp settings...</div>}>
      <WhatsAppContent />
    </Suspense>
  );
}
