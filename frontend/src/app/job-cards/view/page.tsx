'use client';

import React, {  useEffect, useState , Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export type JobCardStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';

interface FloorTask {
  id: number;
  taskName: string;
  category: string;
  isDone: boolean;
}

interface PartConsumed {
  id: number;
  partName: string;
  qtyConsumed: number;
  unit: string;
  status: 'Issued' | 'Installed';
}

function JobCardViewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const id = searchParams.get('id') || 'JC-2026-001';
  const autoPrint = searchParams.get('autoPrint') === 'true';
  const [isMounted, setIsMounted] = useState(false);

  const [status, setStatus] = useState<JobCardStatus>('IN_PROGRESS');

  const [jobData, setJobData] = useState({
    jobCode: id.startsWith('JC-') ? id : 'JC-2026-001',
    bayDesignation: 'BAY-03 (Hydraulic Lift)',
    priority: 'HIGH',
    leadTech: 'Karim Rahman',
    vehicleNo: 'DHK-METRO-GA-13-8851',
    vehicleModel: 'Toyota Land Cruiser Prado',
    odometer: '45,120 km',
    fuelLevel: '1/4 Tank',
    date: '23/07/2026',
    tasks: [
      { id: 1, taskName: 'Dismantle Front Left Strut Assembly', category: 'Labor', isDone: true },
      { id: 2, taskName: 'Replace OEM Shock Absorber & Bushings', category: 'Labor', isDone: true },
      { id: 3, taskName: 'Bleed Brake Lines & Inspect Hydraulic Fluid', category: 'Labor', isDone: false },
      { id: 4, taskName: 'Computer Wheel Alignment Test', category: 'Testing', isDone: false },
    ] as FloorTask[],
    parts: [
      { id: 1, partName: 'Shock Absorber Assembly Front', qtyConsumed: 2, unit: 'Pcs', status: 'Installed' },
      { id: 2, partName: 'Suspension Bushing Kit', qtyConsumed: 1, unit: 'Set', status: 'Issued' },
      { id: 3, partName: 'Brake Fluid DOT 4 (1L)', qtyConsumed: 1, unit: 'Can', status: 'Issued' },
    ] as PartConsumed[],
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

  const handleToggleTask = (taskId: number) => {
    setJobData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, isDone: !t.isDone } : t)
    }));
  };

  const handleCompleteAndGenerateBill = () => {
    setStatus('COMPLETED');
    const allItems = [
      ...jobData.tasks.map(t => ({
        name: t.taskName,
        description: t.taskName,
        type: 'Service' as const,
        qty: 1,
        unit: 'Job',
        unitPrice: 1500,
        amount: 1500
      })),
      ...jobData.parts.map(p => ({
        name: p.partName,
        description: p.partName,
        type: 'Part' as const,
        qty: Number(p.qtyConsumed) || 1,
        unit: p.unit || 'Pcs',
        unitPrice: 3500,
        amount: (Number(p.qtyConsumed) || 1) * 3500
      }))
    ];

    const conversionPayload = {
      sourceId: jobData.jobCode,
      sourceType: 'job_card',
      customerId: '3',
      customerName: 'Europetex Limited (01711-889900)',
      customerPhone: '01711-889900',
      vehicleId: '4',
      vehicleNo: jobData.vehicleNo,
      vehicleModel: jobData.vehicleModel,
      items: allItems,
      notes: `Generated from Completed Job Card #${jobData.jobCode}`
    };

    sessionStorage.setItem('convert_job_card', JSON.stringify(conversionPayload));
    sessionStorage.setItem('conversion_payload', JSON.stringify(conversionPayload));
    const encodedData = encodeURIComponent(JSON.stringify(conversionPayload));
    router.push(`/billing/create?fromJobCard=${jobData.jobCode}&data=${encodedData}`);
  };

  const getPriorityBadge = (p: string) => {
    switch (p.toUpperCase()) {
      case 'HIGH':
      case 'URGENT':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-[#004e89]/10 text-[#004e89] border-[#004e89]/30';
    }
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
            onClick={handleCompleteAndGenerateBill}
            className="px-4 py-1.5 bg-emerald-600 text-white font-medium rounded text-sm hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            🧾 Convert to Invoice & Billing
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
            Print Job Card
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{jobData.jobCode}</h1>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Workshop Floor Job Card</p>
            </div>
            <div className="text-right space-y-1">
              <span className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded-full border ${getPriorityBadge(jobData.priority)}`}>
                Priority: {jobData.priority}
              </span>
              <p className="text-xs text-slate-500 font-medium">{jobData.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 bg-slate-50/70 rounded-lg p-4 border border-slate-100 text-xs">
            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Bay & Technician</p>
              <p className="font-bold text-[#004e89] text-sm">{jobData.bayDesignation}</p>
              <p className="text-slate-700">Lead Tech: <span className="font-semibold text-slate-900">{jobData.leadTech}</span></p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Vehicle Specs</p>
              <p className="font-bold text-slate-900 text-sm">{jobData.vehicleNo}</p>
              <p className="text-slate-600">{jobData.vehicleModel}</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Floor Status & Metrics</p>
              <p className="text-slate-700">Odo: <span className="font-mono text-slate-900">{jobData.odometer}</span> | Fuel: {jobData.fuelLevel}</p>
              <p className="text-slate-700">Job Status: <span className="font-bold text-emerald-700">{status}</span></p>
            </div>
          </div>
        </div>

        {/* SECTION 1: Execution Checklist */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Floor Mechanic Tasks & Execution Checklist</h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Task Description</th>
                  <th className="py-2.5 px-3 text-center w-24">Category</th>
                  <th className="py-2.5 px-3 text-center w-24">Execution Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobData.tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => handleToggleTask(t.id)}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={t.isDone} 
                        onChange={() => handleToggleTask(t.id)}
                        className="w-4 h-4 text-[#004e89] rounded border-slate-300 focus:ring-[#004e89]"
                      />
                      <span>{t.taskName}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600 uppercase text-[10px]">{t.category}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                        t.isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.isDone ? '✓ Completed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: Actual Parts Consumed */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Actual Parts Consumed on Floor</h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Part Name</th>
                  <th className="py-2.5 px-3 text-center w-20">Qty Consumed</th>
                  <th className="py-2.5 px-3 text-center w-20">Unit</th>
                  <th className="py-2.5 px-3 text-center w-28">Store Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobData.parts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{p.partName}</td>
                    <td className="py-2.5 px-3 text-center text-slate-700 font-mono">{p.qtyConsumed}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600 uppercase text-[11px]">{p.unit}</td>
                    <td className="py-2.5 px-3 text-center text-slate-700 font-medium">{p.status}</td>
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
              Technician Signature
            </div>
          </div>
          <div className="w-52 text-center">
            <div className="border-t border-dashed border-slate-400 pt-2 text-xs font-semibold text-slate-700">
              Floor Supervisor Signature
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Mamun Automobiles</p>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function JobCardViewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <JobCardViewPageContent />
    </Suspense>
  );
}
