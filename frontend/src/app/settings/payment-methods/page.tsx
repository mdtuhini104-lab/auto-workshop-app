'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function PaymentMethodsContent() {
  const [bkashNumber, setBkashNumber] = useState('01711000000');
  const [nagadNumber, setNagadNumber] = useState('01819000000');
  const [bankAccount, setBankAcc] = useState('110.110.12345 (Dutch-Bangla Bank)');
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
        <span className="font-semibold text-slate-800 dark:text-slate-200">Payment Methods</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Payment Gateways & Accounts</h1>
        <p className="text-xs text-slate-500 mt-1">Configure bKash, Nagad, POS Card Terminal, and Bank Account numbers for customer billing.</p>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
          ✓ Payment methods updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-200">bKash Merchant Account Number</label>
          <input 
            type="text" 
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent font-mono"
            value={bkashNumber}
            onChange={e => setBkashNumber(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-200">Nagad Merchant Account Number</label>
          <input 
            type="text" 
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent font-mono"
            value={nagadNumber}
            onChange={e => setNagadNumber(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-200">Default Bank Account Details</label>
          <input 
            type="text" 
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
            value={bankAccount}
            onChange={e => setBankAcc(e.target.value)}
          />
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c]">
            Save Payment Gateways
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PaymentMethodsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading payment methods...</div>}>
      <PaymentMethodsContent />
    </Suspense>
  );
}
