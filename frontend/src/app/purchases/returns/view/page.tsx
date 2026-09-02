'use client';

import React, {  useEffect, useState , Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PurchaseReturnRecord } from '../page';

function PurchaseReturnViewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get('id') || 'PR-2026-001';
  const autoPrint = searchParams.get('autoPrint') === 'true';

  const [isMounted, setIsMounted] = useState(false);
  const [returnRecord, setReturnRecord] = useState<PurchaseReturnRecord | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('purchase_returns');
    if (saved) {
      try {
        const records: PurchaseReturnRecord[] = JSON.parse(saved);
        const found = records.find((r) => r.id === id);
        if (found) {
          setReturnRecord(found);
          return;
        }
      } catch {}
    }

    // Default fallback mock if not found
    setReturnRecord({
      id,
      vendorName: 'Akij Motors Ltd',
      refOrder: 'PO-2026-001',
      returnDate: '2026-07-28',
      reason: 'Defective Parts',
      itemsReturned: 'Engine Oil Filter x 2',
      itemsList: [
        { id: '1', name: 'Engine Oil Filter (Genuine Toyota)', qty: 2, unitPrice: 1200, tax: 0, total: 2400 }
      ],
      subtotal: 2400,
      deductions: 0,
      totalCredit: 2400,
      status: 'Approved',
      remarks: 'Credit note issued CN-9821 for Mamun Automobiles Uttara Branch.'
    });
  }, [id]);

  useEffect(() => {
    if (isMounted && autoPrint) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [isMounted, autoPrint]);

  if (!isMounted || !returnRecord) return null;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Refunded':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const handleStatusToggle = () => {
    const nextStatus = returnRecord.status === 'Pending' ? 'Approved' : 'Refunded';
    const updated = { ...returnRecord, status: nextStatus as any };
    setReturnRecord(updated);

    // Update in local storage
    const saved = localStorage.getItem('purchase_returns');
    if (saved) {
      try {
        const records: PurchaseReturnRecord[] = JSON.parse(saved);
        const list = records.map((r) => (r.id === id ? updated : r));
        localStorage.setItem('purchase_returns', JSON.stringify(list));
      } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 print:p-0 print:bg-white flex flex-col items-center">
      {/* 1. TOP ACTION BAR */}
      <div className="w-full max-w-[210mm] mb-4 flex items-center justify-between print:hidden">
        {/* Left: Back button */}
        <button
          onClick={() => router.back()}
          className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          &larr; Back to Returns
        </button>

        {/* Right Action Group */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleStatusToggle}
            className="px-4 py-1.5 bg-emerald-600 text-white font-medium rounded text-sm hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Mark as {returnRecord.status === 'Pending' ? 'Approved' : 'Refunded'}
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-1.5 bg-[#003d6c] text-white font-medium rounded text-sm hover:bg-[#002d50] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs rounded text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Debit Note
          </button>
        </div>
      </div>

      {/* 2. PRINTABLE DEBIT NOTE CARD */}
      <div
        id="printable-debit-note-document"
        className="w-full max-w-[210mm] bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm text-slate-800 print:shadow-none print:w-[210mm] print:p-0 print:border-none print:rounded-none"
      >
        {/* Global Print Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-debit-note-document, #printable-debit-note-document * {
              visibility: visible;
              color: black !important;
            }
            #printable-debit-note-document {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 0;
              margin: 0;
              background: white;
            }
            @page {
              size: A4 portrait;
              margin: 12mm;
            }
          }
        `}} />

        {/* Header Row */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{returnRecord.id}</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Purchase Return Voucher / Debit Note
            </p>
          </div>
          <div className="text-right space-y-1">
            <span className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded-full border ${getStatusBadgeStyle(returnRecord.status)}`}>
              {returnRecord.status}
            </span>
            <p className="text-xs text-slate-500 font-medium">Return Date: {returnRecord.returnDate}</p>
          </div>
        </div>

        {/* 3-Column Overview Grid */}
        <div className="grid grid-cols-3 gap-6 bg-slate-50/70 rounded-lg p-4 border border-slate-100 text-xs">
          {/* Column 1: Supplier Details */}
          <div className="space-y-1">
            <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Supplier / Vendor</p>
            <p className="font-bold text-slate-900 text-sm">{returnRecord.vendorName}</p>
            <p className="text-slate-600">Plot # 197, Sector # 10, Uttara</p>
          </div>

          {/* Column 2: Reference Info */}
          <div className="space-y-1">
            <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Reference Info</p>
            <p className="font-bold text-slate-900 font-mono text-sm">{returnRecord.refOrder}</p>
            <p className="text-slate-600">Reason: <span className="font-semibold text-slate-800">{returnRecord.reason}</span></p>
          </div>

          {/* Column 3: Workshop Metadata */}
          <div className="space-y-1">
            <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Issued By</p>
            <p className="font-semibold text-slate-900">Mamun Automobiles</p>
            <p className="text-slate-600">Main Workshop Branch</p>
          </div>
        </div>

        {/* Returned Items Table */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Returned Parts & Materials</h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Qty Returned</th>
                  <th className="py-2.5 px-3 text-right">Unit Price (৳)</th>
                  <th className="py-2.5 px-3 text-right">Tax (৳)</th>
                  <th className="py-2.5 px-3 text-right">Total (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {returnRecord.itemsList?.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{item.name}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-800">{item.qty}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {item.unitPrice.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {item.tax.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {item.total.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Remarks & Financial Summary */}
        <div className="grid grid-cols-2 gap-6 pt-2">
          {/* Remarks */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
            <p className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Remarks / Instructions</p>
            <p className="text-slate-600 italic">{returnRecord.remarks || 'No additional remarks provided.'}</p>
          </div>

          {/* Totals */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal Credit:</span>
              <span className="font-mono font-semibold text-slate-900">
                ৳ {returnRecord.subtotal.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Deductions / Restocking Fee:</span>
              <span className="font-mono font-semibold">
                -৳ {returnRecord.deductions.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="border-t border-slate-300 pt-2 flex justify-between items-center text-sm font-bold">
              <span className="text-[#003d6c]">Total Credit Amount:</span>
              <span className="font-mono text-[#003d6c] text-base">
                ৳ {returnRecord.totalCredit.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end pt-16">
          <div className="w-52 text-center">
            <div className="border-t border-dashed border-slate-400 pt-2 text-xs font-semibold text-slate-700">
              Vendor Acknowledgment
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Supplier Representative</p>
          </div>
          <div className="w-52 text-center">
            <div className="border-t border-dashed border-slate-400 pt-2 text-xs font-semibold text-slate-700">
              Authorized Signature
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Mamun Automobiles Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function PurchaseReturnViewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <PurchaseReturnViewPageContent />
    </Suspense>
  );
}
