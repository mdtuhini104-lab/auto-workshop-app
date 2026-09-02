'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function TaxReportContent() {
  const [taxRate] = useState(15);

  const taxableSales = 450000;
  const vatCollected = taxableSales * (taxRate / 100);
  const taxablePurchases = 210000;
  const vatPaidOnInput = taxablePurchases * (taxRate / 100);
  const netVatPayable = vatCollected - vatPaidOnInput;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">VAT & Tax Summary Report</h1>
          <p className="text-xs text-slate-500 mt-1">Official NBR Bangladeshi Tax audit and monthly VAT return breakdown.</p>
        </div>
        <Link href="/dashboard" prefetch={false} className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors shadow-xs w-fit">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase">Output VAT Collected</div>
          <div className="text-2xl font-extrabold text-blue-700">৳ {vatCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-[11px] text-slate-400">15% on billable invoices</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase">Input VAT Credit</div>
          <div className="text-2xl font-extrabold text-slate-700">৳ {vatPaidOnInput.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-[11px] text-slate-400">15% on parts purchases</div>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-amber-800 uppercase">Net VAT Payable</div>
          <div className="text-2xl font-extrabold text-amber-900">৳ {netVatPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-[11px] font-bold text-amber-700">Due for NBR Filing</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">VAT Audit Detail</h2>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700">Total Billable Service & Parts Revenue</span>
            <span className="font-mono font-bold text-slate-900">৳ {taxableSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700">Standard Rate VAT (15%)</span>
            <span className="font-mono font-bold text-blue-700">৳ {vatCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700">Eligible Purchase Input VAT Rebate</span>
            <span className="font-mono font-bold text-rose-600">- ৳ {vatPaidOnInput.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between items-center pt-3 font-bold text-sm text-slate-900">
            <span>Final NBR Tax Obligation</span>
            <span className="text-amber-800 text-base">৳ {netVatPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TaxReportPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading tax report...</div>}>
      <TaxReportContent />
    </Suspense>
  );
}
