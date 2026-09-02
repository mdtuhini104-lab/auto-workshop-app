'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function TelegramSettingsContent() {
  const [botToken, setBotToken] = useState('71829384:AAH98234-TelegramBotToken');
  const [chatId, setChatId] = useState('-100192837465');
  const [feedback, setFeedback] = useState('');

  const handleTest = () => {
    setFeedback('Sending test alert to Telegram Manager Group...');
    setTimeout(() => {
      setFeedback('✓ Telegram Bot alert sent successfully!');
      setTimeout(() => setFeedback(''), 4000);
    }, 1200);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback('✓ Telegram Bot token saved successfully!');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl text-slate-800 dark:text-slate-100 font-sans">
      <div className="text-xs text-slate-500 space-x-1">
        <Link href="/settings" prefetch={false} className="hover:underline">Settings</Link>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">Telegram Bot</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Telegram Manager Alert Bot</h1>
        <p className="text-xs text-slate-500 mt-1">Receive automated Telegram group alerts for major workshop sales, emergency job cards, and daily summary reports.</p>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
          {feedback}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-200">Bot Father API Token</label>
          <input 
            type="password" 
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent font-mono"
            value={botToken}
            onChange={e => setBotToken(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-200">Target Group Chat ID</label>
          <input 
            type="text" 
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent font-mono"
            value={chatId}
            onChange={e => setChatId(e.target.value)}
            required
          />
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <button type="button" onClick={handleTest} className="px-3 py-1.5 border border-sky-500 text-sky-700 dark:text-sky-400 rounded-lg text-xs font-semibold hover:bg-sky-50 dark:hover:bg-sky-950/30">
            Send Test Telegram Alert
          </button>
          <button type="submit" className="px-4 py-2 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c]">
            Save Telegram Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default function TelegramSettingsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading Telegram bot settings...</div>}>
      <TelegramSettingsContent />
    </Suspense>
  );
}
