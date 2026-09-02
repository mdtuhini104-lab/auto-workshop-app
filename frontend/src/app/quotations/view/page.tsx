'use client';

import React, {  useEffect, useState , Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export type QuotationStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface ServiceItem {
  id: number;
  service: string;
  description: string;
  price: number;
}

interface PartItem {
  id: number;
  itemName: string;
  qty: number;
  unit: string;
  unitPrice: number;
  total: number;
}

function QuotationViewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const id = searchParams.get('id') || 'QT-2026-031';
  const autoPrint = searchParams.get('autoPrint') === 'true';
  const [isMounted, setIsMounted] = useState(false);

  // State management
  const [status, setStatus] = useState<QuotationStatus>('DRAFT');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Mock data matching the exact reference specifications
  const [quoteData] = useState({
    quoteNo: id.startsWith('QT-') ? id : 'QT-2026-031',
    customerName: 'Europetex Limited',
    customerPhone: '01711-889900',
    vehicleNo: 'DHK-METRO-GA-13-8851',
    vehicleModel: 'Toyota Land Cruiser Prado',
    date: '23/07/2026',
    validUntil: '30/07/2026',
    preparedBy: 'Mamun Rahman',
    services: [
      { id: 1, service: 'Complete Brake Overhaul', description: 'Master cylinder inspection, pad replacement & rotor skimming', price: 8500 },
      { id: 2, service: 'Engine Servicing & Tuning', description: 'Throttle body cleaning, spark plug check & computer diagnostic scan', price: 4200 },
      { id: 3, service: 'Wheel Alignment & Balancing', description: '4-wheel laser alignment & computer wheel balancing', price: 2500 },
    ] as ServiceItem[],
    parts: [
      { id: 1, itemName: 'Synthetic Engine Oil 5W-40 (4L)', qty: 1, unit: 'Can', unitPrice: 4800, total: 4800 },
      { id: 2, itemName: 'Oil Filter Assembly (Genuine Toyota)', qty: 1, unit: 'Pcs', unitPrice: 1400, total: 1400 },
      { id: 3, itemName: 'Front Brake Pads Set (Akebono)', qty: 1, unit: 'Set', unitPrice: 8500, total: 8500 },
      { id: 4, itemName: 'Air Filter Element', qty: 1, unit: 'Pcs', unitPrice: 1800, total: 1800 },
      { id: 5, itemName: 'AC Cabin Filter', qty: 1, unit: 'Pcs', unitPrice: 3500, total: 3500 },
    ] as PartItem[],
    discount: 0,
    vatRate: 0,
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

  const servicesTotal = quoteData.services.reduce((sum, item) => sum + item.price, 0);
  const partsTotal = quoteData.parts.reduce((sum, item) => sum + item.total, 0);
  const subtotal = servicesTotal + partsTotal;
  const grandTotal = subtotal - quoteData.discount;

  const isApproved = status === 'APPROVED';

  const handleApprove = () => {
    setStatus('APPROVED');
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  const handleConvertToWorkOrder = () => {
    if (!isApproved) {
      alert('This quotation must be approved before converting to a Work Order.');
      return;
    }

    const allItems = [
      ...quoteData.services.map(s => ({
        name: s.service,
        description: s.service,
        type: 'Service' as const,
        qty: 1,
        unit: 'Job',
        unitPrice: Number(s.price) || 0,
        amount: Number(s.price) || 0
      })),
      ...quoteData.parts.map(p => ({
        name: p.itemName,
        description: p.itemName,
        type: 'Part' as const,
        qty: Number(p.qty) || 1,
        unit: p.unit || 'Pcs',
        unitPrice: Number(p.unitPrice) || 0,
        amount: Number(p.total) || (Number(p.qty) || 1) * (Number(p.unitPrice) || 0)
      }))
    ];

    const conversionPayload = {
      sourceId: quoteData.quoteNo,
      sourceType: 'quotation',
      customerId: '3',
      customerName: `${quoteData.customerName} (${quoteData.customerPhone})`,
      customerPhone: quoteData.customerPhone,
      vehicleId: '4',
      vehicleNo: quoteData.vehicleNo,
      vehicleModel: quoteData.vehicleModel,
      items: allItems,
      notes: `Converted from Approved Quotation #${quoteData.quoteNo}`
    };

    sessionStorage.setItem('convert_quotation', JSON.stringify(conversionPayload));
    sessionStorage.setItem('conversion_payload', JSON.stringify(conversionPayload));
    const encodedData = encodeURIComponent(JSON.stringify(conversionPayload));
    router.push(`/quotations/orders/create?fromQuote=${quoteData.quoteNo}&data=${encodedData}`);
  };

  const getStatusBadgeStyle = (st: QuotationStatus) => {
    switch (st) {
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 print:p-0 print:bg-white flex flex-col items-center">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-bounce print:hidden">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-semibold">Quotation #{quoteData.quoteNo} has been successfully APPROVED!</span>
        </div>
      )}

      {/* 1. TOP ACTION BAR & BREADCRUMB */}
      <div className="w-full max-w-[210mm] mb-4 flex items-center justify-between print:hidden">
        {/* Left: Back button */}
        <button 
          onClick={() => router.back()}
          className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          &larr; Back
        </button>

        {/* Right Action Group */}
        <div className="flex items-center gap-2">
          <button 
            className="px-3 py-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs rounded text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Edit
          </button>

          {!isApproved ? (
            <button 
              onClick={handleApprove}
              className="px-4 py-1.5 bg-emerald-600 text-white font-medium rounded text-sm hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve
            </button>
          ) : (
            <button 
              onClick={handleConvertToWorkOrder}
              className="px-4 py-1.5 bg-[#004e89] text-white font-medium rounded text-sm hover:bg-[#003d6c] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              📋 Convert to Job Card
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
            Print
          </button>
        </div>
      </div>

      {/* Main Container / Printable Card */}
      <div 
        id="printable-quotation-document"
        className="w-full max-w-[210mm] bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm text-slate-800 print:shadow-none print:w-[210mm] print:p-0 print:border-none print:rounded-none"
      >
        {/* Global Print Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-quotation-document, #printable-quotation-document * {
              visibility: visible;
              color: black !important;
            }
            #printable-quotation-document {
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

        {/* 2. TOP OVERVIEW CARD */}
        <div>
          {/* Header Row */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{quoteData.quoteNo}</h1>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Automobile Quotation</p>
            </div>
            <div className="text-right space-y-1">
              <span className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded-full border ${getStatusBadgeStyle(status)}`}>
                {status}
              </span>
              <p className="text-xs text-slate-500 font-medium">{quoteData.date}</p>
            </div>
          </div>

          {/* 3-Column Info Grid */}
          <div className="grid grid-cols-3 gap-6 bg-slate-50/70 rounded-lg p-4 border border-slate-100 text-xs">
            {/* Column 1: Customer Info */}
            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Customer Details</p>
              <p className="font-bold text-slate-900 text-sm">{quoteData.customerName}</p>
              <p className="text-slate-600 font-mono">{quoteData.customerPhone}</p>
            </div>

            {/* Column 2: Vehicle Details */}
            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Vehicle Details</p>
              <p className="font-bold text-slate-900 text-sm">{quoteData.vehicleNo}</p>
              <p className="text-slate-600">{quoteData.vehicleModel}</p>
            </div>

            {/* Column 3: Validity & Prepared By */}
            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Document Metadata</p>
              <p className="text-slate-700">Valid Until: <span className="font-bold text-slate-900">{quoteData.validUntil}</span></p>
              <p className="text-slate-700">Prepared By: <span className="font-semibold text-slate-900">{quoteData.preparedBy}</span></p>
            </div>
          </div>
        </div>

        {/* 3. SEPARATED HIGH-DENSITY TABLES */}

        {/* Card 1: Services & Labor */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Services & Labor</h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Price (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quoteData.services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{s.service}</td>
                    <td className="py-2.5 px-3 text-slate-600">{s.description}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                      {s.price.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 2: Parts & Materials */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Parts & Materials</h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Item Name</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-center">Unit</th>
                  <th className="py-2.5 px-3 text-right">Unit Price (৳)</th>
                  <th className="py-2.5 px-3 text-right">Total (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quoteData.parts.map((p) => (
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

        {/* 4. FINANCIAL SUMMARY CARD & FOOTER SIGNATURES */}
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
                -৳ {quoteData.discount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>VAT ({quoteData.vatRate}%):</span>
              <span className="font-mono font-semibold text-slate-900">৳ 0.00</span>
            </div>
            <div className="border-t border-slate-300 pt-2 flex justify-between items-center text-sm font-bold">
              <span className="text-[#003d6c]">Grand Total:</span>
              <span className="font-mono text-[#003d6c] text-base">
                ৳ {grandTotal.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Signatures Row */}
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




export default function QuotationViewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <QuotationViewPageContent />
    </Suspense>
  );
}
