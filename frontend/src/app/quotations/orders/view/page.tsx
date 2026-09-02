'use client';

import React, {  useEffect, useState , Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export type WorkOrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface ServiceTask {
  id: number;
  task: string;
  assignedTo: string;
  price: number;
}

interface PartReplaced {
  id: number;
  partName: string;
  qty: number;
  unit: string;
  unitPrice: number;
  total: number;
}

function WorkOrderViewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const id = searchParams.get('id') || 'WO-2026-101';
  const autoPrint = searchParams.get('autoPrint') === 'true';
  const [isMounted, setIsMounted] = useState(false);

  const [status, setStatus] = useState<WorkOrderStatus>('IN_PROGRESS');

  const [orderData] = useState({
    workOrderNo: id.startsWith('WO-') ? id : 'WO-2026-101',
    refQuoteNo: 'QT-2026-031',
    customerName: 'Europetex Limited',
    customerPhone: '01711-889900',
    vehicleNo: 'DHK-METRO-GA-13-8851',
    vehicleModel: 'Toyota Land Cruiser Prado',
    targetDate: '28/07/2026',
    assignedMechanic: 'Karim Rahman (Lead Tech)',
    date: '23/07/2026',
    services: [
      { id: 1, task: 'Complete Suspension Overhaul', assignedTo: 'Karim Rahman', price: 12500 },
      { id: 2, task: 'Front Wheel Alignment & Camber Scan', assignedTo: 'Rafiqul Islam', price: 2500 },
    ] as ServiceTask[],
    parts: [
      { id: 1, partName: 'Shock Absorber Assembly Front (OEM)', qty: 2, unit: 'Pcs', unitPrice: 14500, total: 29000 },
      { id: 2, partName: 'Bushing Kit Complete', qty: 1, unit: 'Set', unitPrice: 3200, total: 3200 },
    ] as PartReplaced[],
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

  const servicesTotal = orderData.services.reduce((sum, item) => sum + item.price, 0);
  const partsTotal = orderData.parts.reduce((sum, item) => sum + item.total, 0);
  const estimatedTotal = servicesTotal + partsTotal;

  const getStatusBadge = (st: WorkOrderStatus) => {
    switch (st) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  const handleToggleStatus = () => {
    if (status === 'IN_PROGRESS') {
      setStatus('COMPLETED');
    } else {
      setStatus('IN_PROGRESS');
    }
  };

  const handleGenerateInvoice = () => {
    const allItems = [
      ...orderData.services.map(s => ({
        name: s.task,
        description: s.task,
        type: 'Service' as const,
        qty: 1,
        unit: 'Job',
        unitPrice: Number(s.price) || 0,
        amount: Number(s.price) || 0
      })),
      ...orderData.parts.map(p => ({
        name: p.partName,
        description: p.partName,
        type: 'Part' as const,
        qty: Number(p.qty) || 1,
        unit: p.unit || 'Pcs',
        unitPrice: Number(p.unitPrice) || 0,
        amount: Number(p.total) || (Number(p.qty) || 1) * (Number(p.unitPrice) || 0)
      }))
    ];

    const conversionPayload = {
      sourceId: orderData.workOrderNo,
      sourceType: 'work_order',
      customerId: '3',
      customerName: `${orderData.customerName} (${orderData.customerPhone})`,
      customerPhone: orderData.customerPhone,
      vehicleId: '4',
      vehicleNo: orderData.vehicleNo,
      vehicleModel: orderData.vehicleModel,
      items: allItems,
      notes: `Generated from Work Order #${orderData.workOrderNo}`
    };

    sessionStorage.setItem('convert_work_order', JSON.stringify(conversionPayload));
    sessionStorage.setItem('conversion_payload', JSON.stringify(conversionPayload));
    const encodedData = encodeURIComponent(JSON.stringify(conversionPayload));
    router.push(`/billing/create?fromWorkOrder=${orderData.workOrderNo}&data=${encodedData}`);
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

          <button 
            onClick={handleToggleStatus}
            className={`px-4 py-1.5 font-medium rounded text-sm transition-colors flex items-center gap-1.5 shadow-xs text-white ${
              status === 'IN_PROGRESS' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {status === 'IN_PROGRESS' ? 'Mark Completed' : 'Set In-Progress'}
          </button>

          <button 
            onClick={handleGenerateInvoice}
            className="px-4 py-1.5 bg-[#004e89] text-white font-medium rounded text-sm hover:bg-[#003d6c] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Generate Invoice
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
            Print Work Order
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{orderData.workOrderNo}</h1>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Work Order | Ref Quote: <span className="font-mono text-slate-700">{orderData.refQuoteNo}</span>
              </p>
            </div>
            <div className="text-right space-y-1">
              <span className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded-full border ${getStatusBadge(status)}`}>
                {status}
              </span>
              <p className="text-xs text-slate-500 font-medium">{orderData.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 bg-slate-50/70 rounded-lg p-4 border border-slate-100 text-xs">
            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Customer Details</p>
              <p className="font-bold text-slate-900 text-sm">{orderData.customerName}</p>
              <p className="text-slate-600 font-mono">{orderData.customerPhone}</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Vehicle Details</p>
              <p className="font-bold text-slate-900 text-sm">{orderData.vehicleNo}</p>
              <p className="text-slate-600">{orderData.vehicleModel}</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Execution Meta</p>
              <p className="text-slate-700">Target Date: <span className="font-bold text-rose-700">{orderData.targetDate}</span></p>
              <p className="text-slate-700">Mechanic: <span className="font-semibold text-slate-900">{orderData.assignedMechanic}</span></p>
            </div>
          </div>
        </div>

        {/* SECTION 1: Approved Services */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Approved Services & Labor Tasks</h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Service Task</th>
                  <th className="py-2.5 px-3">Assigned Mechanic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orderData.services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{s.task}</td>
                    <td className="py-2.5 px-3 text-slate-600">{s.assignedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: Approved Parts */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Approved Parts & Replaced Items</h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Part Description</th>
                  <th className="py-2.5 px-3 text-center w-20">Qty</th>
                  <th className="py-2.5 px-3 text-center w-20">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orderData.parts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{p.partName}</td>
                    <td className="py-2.5 px-3 text-center text-slate-700 font-mono font-medium">{p.qty}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600 uppercase text-[11px]">{p.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              Workshop Manager
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Mamun Automobiles</p>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function WorkOrderViewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <WorkOrderViewPageContent />
    </Suspense>
  );
}
