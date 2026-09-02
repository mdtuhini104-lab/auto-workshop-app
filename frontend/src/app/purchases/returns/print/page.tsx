'use client';

import React, {  useEffect, useState , Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PurchaseReturnRecord } from '@/types/erp';
import { INITIAL_PURCHASE_RETURNS } from '@/data/initialMockData';

function PurchaseReturnPrintPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || 'PR-2026-001';

  const [returnRecord, setReturnRecord] = useState<PurchaseReturnRecord | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('purchase_returns');
    const records: PurchaseReturnRecord[] = saved ? JSON.parse(saved) : INITIAL_PURCHASE_RETURNS;
    const found = records.find((r) => r.id === id) || records[0];
    setReturnRecord(found);

    setTimeout(() => {
      window.print();
    }, 500);
  }, [id]);

  if (!returnRecord) return null;

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center">
      <div className="w-full max-w-[210mm] mb-4 flex justify-between items-center print:hidden">
        <button
          onClick={() => router.back()}
          className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded text-sm font-medium hover:bg-slate-200"
        >
          &larr; Back
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-1.5 bg-[#004e89] text-white font-bold rounded text-sm hover:bg-[#003d6c]"
        >
          Print Debit Note
        </button>
      </div>

      <div id="printable-return-doc" className="w-full max-w-[210mm] bg-white border border-slate-300 p-8 rounded-lg space-y-6">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * { visibility: hidden; }
            #printable-return-doc, #printable-return-doc * { visibility: visible; }
            #printable-return-doc { position: absolute; left: 0; top: 0; width: 100%; border: none; }
          }
        `}} />

        <div className="border-b border-slate-300 pb-4 text-center">
          <h1 className="text-2xl font-black text-[#004e89]">MAMUN AUTOMOBILES ERP</h1>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Purchase Return Voucher / Debit Note</p>
        </div>

        <div className="flex justify-between items-center text-xs">
          <div>
            <p className="font-bold text-base text-slate-900">Return ID: {returnRecord.id}</p>
            <p className="text-slate-600">Vendor: {returnRecord.vendorName}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-600">Return Date: {returnRecord.returnDate}</p>
            <p className="text-slate-600">Ref PO: {returnRecord.refOrder}</p>
          </div>
        </div>

        <div className="border border-slate-200 rounded p-4 text-center space-y-1 bg-slate-50">
          <p className="text-xs text-slate-500 font-bold uppercase">Total Refund / Credit Amount</p>
          <p className="text-3xl font-black font-mono text-[#004e89]">৳ {returnRecord.totalCredit.toLocaleString('en-BD')}</p>
        </div>

        <div className="flex justify-between pt-16 text-center text-xs font-semibold text-slate-700">
          <div className="w-48 border-t border-dashed border-slate-400 pt-2">Vendor Acknowledgment</div>
          <div className="w-48 border-t border-dashed border-slate-400 pt-2">Authorized Manager</div>
        </div>
      </div>
    </div>
  );
}


export default function PurchaseReturnPrintPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <PurchaseReturnPrintPageContent />
    </Suspense>
  );
}
