'use client';

import React, {  useEffect, useState , Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export type PaymentStatus = 'PAID' | 'PARTIAL' | 'UNPAID';

interface BilledService {
  id: number;
  description: string;
  price: number;
}

interface BilledPart {
  id: number;
  itemName: string;
  qty: number;
  unit: string;
  unitPrice: number;
  total: number;
}

function BillingViewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const id = searchParams.get('id') || 'INV-2026-001';
  const autoPrint = searchParams.get('autoPrint') === 'true';
  const [isMounted, setIsMounted] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PAID');

  const [invoiceData] = useState({
    invoiceNo: id.startsWith('INV-') ? id : 'INV-2026-001',
    customerName: 'Europetex Limited',
    customerPhone: '01711-889900',
    vehicleNo: 'DHK-METRO-GA-13-8851',
    vehicleModel: 'Toyota Land Cruiser Prado',
    issueDate: '23/07/2026',
    dueDate: '25/07/2026',
    services: [
      { id: 1, description: 'Complete Brake Overhaul Labor', price: 8500 },
      { id: 2, description: 'Engine Diagnostics & Scan', price: 2000 },
    ] as BilledService[],
    parts: [
      { id: 1, itemName: 'Synthetic Engine Oil 5W-40 (4L)', qty: 1, unit: 'Can', unitPrice: 4800, total: 4800 },
      { id: 2, itemName: 'Oil Filter Assembly (Genuine)', qty: 1, unit: 'Pcs', unitPrice: 1400, total: 1400 },
      { id: 3, itemName: 'Front Brake Pads Set (Akebono)', qty: 1, unit: 'Set', unitPrice: 8500, total: 8500 },
    ] as BilledPart[],
    discount: 0,
    vatRate: 0,
    amountPaid: 25200,
  });

  useEffect(() => {
    setIsMounted(true);
    if (autoPrint) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [autoPrint]);

  if (!isMounted) return null;

  const servicesTotal = invoiceData.services.reduce((sum, s) => sum + s.price, 0);
  const partsTotal = invoiceData.parts.reduce((sum, p) => sum + p.total, 0);
  const subtotal = servicesTotal + partsTotal;
  const grandTotal = subtotal - invoiceData.discount;
  const balanceDue = grandTotal - invoiceData.amountPaid;

  const getStatusBadge = (st: PaymentStatus) => {
    switch (st) {
      case 'PAID':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'PARTIAL':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  const handleRecordPayment = () => {
    setPaymentStatus('PAID');
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 print:p-0 print:bg-white flex flex-col items-center">
      {/* TOP ACTION BAR */}
      <div className="w-full max-w-[210mm] mb-4 flex items-center justify-between print:hidden">
        <button 
          onClick={() => router.back()}
          className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          &larr; Back
        </button>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs rounded text-sm font-medium hover:bg-slate-50 transition-colors">
            Edit
          </button>

          {paymentStatus !== 'PAID' && (
            <button 
              onClick={handleRecordPayment}
              className="px-4 py-1.5 bg-emerald-600 text-white font-medium rounded text-sm hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Record Payment
            </button>
          )}

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
            Print Invoice
          </button>
        </div>
      </div>

      {/* Printable Card Container */}
      <div 
        id="printable-quotation-document"
        className="w-full max-w-[210mm] bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm text-slate-800 print:shadow-none print:w-[210mm] print:p-0 print:border-none print:rounded-none"
      >
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * { visibility: hidden; }
            #printable-quotation-document, #printable-quotation-document * { visibility: visible; color: black !important; }
            #printable-quotation-document { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; background: white; }
            @page { size: A4 portrait; margin: 12mm; }
          }
        `}} />

        {/* TOP OVERVIEW CARD */}
        <div>
          <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{invoiceData.invoiceNo}</h1>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Tax Invoice</p>
            </div>
            <div className="text-right space-y-1">
              <span className={`inline-block px-3.5 py-1 text-xs font-black uppercase tracking-wider rounded-full border ${getStatusBadge(paymentStatus)}`}>
                {paymentStatus}
              </span>
              <p className="text-xs text-slate-500 font-medium">Issue Date: {invoiceData.issueDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 bg-slate-50/70 rounded-lg p-4 border border-slate-100 text-xs">
            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Billed To</p>
              <p className="font-bold text-slate-900 text-sm">{invoiceData.customerName}</p>
              <p className="text-slate-600 font-mono">{invoiceData.customerPhone}</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Vehicle Specs</p>
              <p className="font-bold text-slate-900 text-sm">{invoiceData.vehicleNo}</p>
              <p className="text-slate-600">{invoiceData.vehicleModel}</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Payment Due & Meta</p>
              <p className="text-slate-700">Due Date: <span className="font-bold text-rose-700">{invoiceData.dueDate}</span></p>
              <p className="text-slate-700">Payment Status: <span className="font-bold text-emerald-700">{paymentStatus}</span></p>
            </div>
          </div>
        </div>

        {/* SECTION 1: Billed Services */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Billed Services & Labor Charges</h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Service Description</th>
                  <th className="py-2.5 px-3 text-right">Price (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoiceData.services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{s.description}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                      {s.price.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: Billed Parts */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Billed Parts & Goods</h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3 text-center w-16">Qty</th>
                  <th className="py-2.5 px-3 text-center w-16">Unit</th>
                  <th className="py-2.5 px-3 text-right w-28">Unit Price (৳)</th>
                  <th className="py-2.5 px-3 text-right w-32">Total (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoiceData.parts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{p.itemName}</td>
                    <td className="py-2.5 px-3 text-center text-slate-700 font-medium">{p.qty} {p.unit}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600 text-[11px] font-medium">{p.unit}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {p.unitPrice.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {p.total.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FINANCIAL SUMMARY CARD */}
        <div className="flex justify-end pt-2">
          <div className="w-72 bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold text-slate-900">
                ৳ {subtotal.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Discount:</span>
              <span className="font-mono font-semibold">
                -৳ {invoiceData.discount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>VAT ({invoiceData.vatRate}%):</span>
              <span className="font-mono font-semibold text-slate-900">৳ 0.00</span>
            </div>
            <div className="border-t border-slate-300 pt-2 flex justify-between items-center text-sm font-bold">
              <span className="text-[#003d6c]">Grand Total:</span>
              <span className="font-mono text-[#003d6c] text-base">
                ৳ {grandTotal.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-emerald-700 pt-1 font-semibold">
              <span>Amount Paid:</span>
              <span className="font-mono">
                ৳ {invoiceData.amountPaid.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-rose-700 font-bold border-t border-slate-200 pt-1">
              <span>Balance Due:</span>
              <span className="font-mono">
                ৳ {balanceDue.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* SIGNATURES */}
        <div className="flex justify-between items-end pt-12">
          <div className="w-52 text-center">
            <div className="border-t border-dashed border-slate-400 pt-2 text-xs font-semibold text-slate-700">
              Customer Signature
            </div>
          </div>
          <div className="w-52 text-center">
            <div className="border-t border-dashed border-slate-400 pt-2 text-xs font-semibold text-slate-700">
              Authorized Signature
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Mamun Automobiles</p>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function BillingViewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <BillingViewPageContent />
    </Suspense>
  );
}
