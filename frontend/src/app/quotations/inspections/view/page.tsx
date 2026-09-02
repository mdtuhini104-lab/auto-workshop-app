'use client';

import React, {  useEffect, useState , Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export type InspectionStatus = 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED';

interface DiagnosisCheckitem {
  id: number;
  item: string;
  status: 'Pass' | 'Attention' | 'Fail';
  remarks: string;
}

interface RecommendedLineItem {
  id: number;
  description: string;
  type: 'Service' | 'Part';
  qty: number;
  unit?: string;
  estimatedRate: number;
  total: number;
}

function InspectionViewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const id = searchParams.get('id') || 'INSP-2026-001';
  const autoPrint = searchParams.get('autoPrint') === 'true';
  const [isMounted, setIsMounted] = useState(false);

  const [status, setStatus] = useState<InspectionStatus>('APPROVED');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [inspData] = useState({
    inspCode: id.startsWith('INSP-') ? id : 'INSP-2026-001',
    customerName: 'Europetex Limited',
    customerPhone: '01711-889900',
    vehicleNo: 'DHK-METRO-GA-13-8851',
    vehicleModel: 'Toyota Land Cruiser Prado',
    fuelLevel: '1/2 Tank',
    odometer: '45,120 km',
    severity: 'High',
    inspectorName: 'Engr. Rafiqul Islam',
    date: '23/07/2026',
    checklist: [
      { id: 1, item: 'Engine Oil & Filter Condition', status: 'Fail', remarks: 'Oil dark & contaminated; filter clogged' },
      { id: 2, item: 'Brake Fluid & Front Pads', status: 'Attention', remarks: 'Pads worn below 3mm; rotor needs skimming' },
      { id: 3, item: 'Suspension & Shock Absorbers', status: 'Attention', remarks: 'Front left strut leaking hydraulic oil' },
      { id: 4, item: 'Battery Voltage & Alternator output', status: 'Pass', remarks: 'Operating within normal range (13.8V)' },
    ] as DiagnosisCheckitem[],
    recommendations: [
      { id: 1, description: 'Engine Diagnostics & Scan', type: 'Service', qty: 1, unit: 'Job', estimatedRate: 2000, total: 2000 },
      { id: 2, description: 'Synthetic Engine Oil 5W-40 (4L)', type: 'Part', qty: 1, unit: 'Can', estimatedRate: 4800, total: 4800 },
      { id: 3, description: 'Front Brake Pads Set (Akebono)', type: 'Part', qty: 1, unit: 'Set', estimatedRate: 8500, total: 8500 },
      { id: 4, description: 'Brake Overhaul Labor', type: 'Service', qty: 1, unit: 'Job', estimatedRate: 3500, total: 3500 },
    ] as RecommendedLineItem[],
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

  const totalEstimatedCost = inspData.recommendations.reduce((sum, item) => sum + item.total, 0);

  const handleApprove = () => {
    setStatus('APPROVED');
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  const handleConvertToQuotation = () => {
    const conversionPayload = {
      sourceId: inspData.inspCode,
      sourceType: 'inspection',
      customerId: '3',
      customerName: `${inspData.customerName} (${inspData.customerPhone})`,
      customerPhone: inspData.customerPhone,
      vehicleId: '4',
      vehicleNo: inspData.vehicleNo,
      vehicleModel: inspData.vehicleModel,
      items: (inspData.recommendations || []).map(r => ({
        name: r.description,
        description: r.description,
        type: r.type || 'Part',
        qty: Number(r.qty) || 1,
        unit: r.unit || (r.type === 'Service' ? 'Job' : 'Pcs'),
        unitPrice: Number(r.estimatedRate) || 0,
        amount: Number(r.total) || (Number(r.qty) || 1) * (Number(r.estimatedRate) || 0)
      })),
      notes: `Converted from Approved Vehicle Inspection #${inspData.inspCode}`
    };

    sessionStorage.setItem('convert_inspection', JSON.stringify(conversionPayload));
    sessionStorage.setItem('conversion_payload', JSON.stringify(conversionPayload));
    const encodedData = encodeURIComponent(JSON.stringify(conversionPayload));
    router.push(`/quotations/create?fromInspection=${inspData.inspCode}&data=${encodedData}`);
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
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
          <span className="text-sm font-semibold">Inspection #{inspData.inspCode} has been APPROVED!</span>
        </div>
      )}

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

          {status !== 'APPROVED' ? (
            <button 
              onClick={handleApprove}
              className="px-4 py-1.5 bg-emerald-600 text-white font-medium rounded text-sm hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve Inspection
            </button>
          ) : null}

          <button 
            onClick={handleConvertToQuotation}
            className="px-4 py-1.5 bg-[#004e89] text-white font-medium rounded text-sm hover:bg-[#003d6c] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            📄 Convert to Quotation
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
            Print
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{inspData.inspCode}</h1>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Vehicle Inspection Report</p>
            </div>
            <div className="text-right space-y-1">
              <span className={`inline-block px-3 py-1 text-xs font-bold uppercase rounded-full border ${getSeverityBadge(inspData.severity)}`}>
                Severity: {inspData.severity}
              </span>
              <p className="text-xs text-slate-500 font-medium">{inspData.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 bg-slate-50/70 rounded-lg p-4 border border-slate-100 text-xs">
            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Customer Details</p>
              <p className="font-bold text-slate-900 text-sm">{inspData.customerName}</p>
              <p className="text-slate-600 font-mono">{inspData.customerPhone}</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Vehicle & Condition</p>
              <p className="font-bold text-slate-900 text-sm">{inspData.vehicleNo}</p>
              <p className="text-slate-600">Fuel: {inspData.fuelLevel} | Odo: {inspData.odometer}</p>
            </div>

            <div className="space-y-1">
              <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">Inspection Meta</p>
              <p className="text-slate-700">Inspector: <span className="font-bold text-slate-900">{inspData.inspectorName}</span></p>
              <p className="text-slate-700">Status: <span className="font-semibold text-slate-900">{status}</span></p>
            </div>
          </div>
        </div>

        {/* SECTION 1: Diagnosis Checklist */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Vehicle Condition & Diagnosis Checklist</h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Component / System</th>
                  <th className="py-2.5 px-3 text-center w-24">Status</th>
                  <th className="py-2.5 px-3">Inspector Remarks & Findings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inspData.checklist.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{c.item}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.status === 'Fail' ? 'bg-rose-100 text-rose-800' :
                        c.status === 'Attention' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{c.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: Recommended Breakdown */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recommended Parts & Services Breakdown</h2>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Recommended Item / Service</th>
                  <th className="py-2.5 px-3 text-center w-24">Type</th>
                  <th className="py-2.5 px-3 text-center w-24">Qty / Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inspData.recommendations.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{r.description}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600 uppercase text-[10px]">{r.type}</td>
                    <td className="py-2.5 px-3 text-center text-slate-700 font-mono font-medium">{r.qty} {r.unit || (r.type === 'Part' ? 'Pcs' : 'Job')}</td>
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
              Inspector Signature
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Mamun Automobiles</p>
          </div>
        </div>
      </div>
    </div>
  );
}



export default function InspectionViewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <InspectionViewPageContent />
    </Suspense>
  );
}
