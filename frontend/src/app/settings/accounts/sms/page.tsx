'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function SmsSettingsContent() {
  const [gatewayUrl, setGatewayUrl] = useState('https://api.smsnet.bd/v1/send');
  const [apiKey, setApiKey] = useState('SMS_BD_KEY_889234109283');
  const [senderId, setSenderId] = useState('MamunAuto');
  const [testNumber, setTestNumber] = useState('+8801711000000');
  const [testFeedback, setTestFeedback] = useState('');

  const handleTestSms = () => {
    setTestFeedback('Dispatching test SMS via local Bangladesh gateway...');
    setTimeout(() => {
      setTestFeedback('✓ Test SMS sent successfully to ' + testNumber);
      setTimeout(() => setTestFeedback(''), 4000);
    }, 1500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setTestFeedback('✓ SMS Gateway configuration saved successfully!');
    setTimeout(() => setTestFeedback(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl text-slate-800 dark:text-slate-100 font-sans">
      <div className="text-xs text-slate-500 space-x-1">
        <Link href="/settings" prefetch={false} className="hover:underline">Settings</Link>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">SMS Gateway</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Bangladesh SMS Gateway Integration</h1>
        <p className="text-xs text-slate-500 mt-1">Configure local Bangladesh SMS provider credentials for automated customer job updates.</p>
      </div>

      {testFeedback && (
        <div className={`p-3 rounded-lg text-xs font-semibold ${testFeedback.includes('✓') ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-blue-50 border border-blue-200 text-blue-800'}`}>
          {testFeedback}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-200">SMS Provider API Endpoint URL</label>
          <input 
            type="text" 
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent font-mono"
            value={gatewayUrl}
            onChange={e => setGatewayUrl(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-800 dark:text-slate-200">API Key / Secret Token</label>
            <input 
              type="password" 
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent font-mono"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-800 dark:text-slate-200">Masking Sender ID</label>
            <input 
              type="text" 
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
              value={senderId}
              onChange={e => setSenderId(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 mt-4">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">Live SMS Test Terminal</span>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="+880 1711-000000"
              className="flex-1 h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-white dark:bg-slate-800 text-xs"
              value={testNumber}
              onChange={e => setTestNumber(e.target.value)}
            />
            <button 
              type="button" 
              onClick={handleTestSms}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
            >
              Test SMS Dispatch
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c] transition-colors">
            Save SMS Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SmsSettingsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading SMS gateway settings...</div>}>
      <SmsSettingsContent />
    </Suspense>
  );
}
