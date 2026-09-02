'use client';

import React, {  useEffect, useState , Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Vendor } from '@/types/erp';
import { INITIAL_VENDORS } from '@/data/initialMockData';

function VendorPrintPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || 'VND-001';

  const [vendor, setVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('erp_vendors');
    const vendors: Vendor[] = saved ? JSON.parse(saved) : INITIAL_VENDORS;
    const found = vendors.find((v) => v.id === id) || vendors[0];
    setVendor(found);

    setTimeout(() => {
      window.print();
    }, 500);
  }, [id]);

  if (!vendor) return null;

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
          Print Statement
        </button>
      </div>

      <div id="printable-vendor-doc" className="w-full max-w-[210mm] bg-white border border-slate-300 p-8 rounded-lg space-y-6">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * { visibility: hidden; }
            #printable-vendor-doc, #printable-vendor-doc * { visibility: visible; }
            #printable-vendor-doc { position: absolute; left: 0; top: 0; width: 100%; border: none; }
          }
        `}} />

        <div className="border-b border-slate-300 pb-4 text-center">
          <h1 className="text-2xl font-black text-[#004e89]">MAMUN AUTOMOBILES ERP</h1>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Vendor Account Statement</p>
        </div>

        <div className="flex justify-between items-center text-xs">
          <div>
            <p className="font-bold text-base text-slate-900">{vendor.name}</p>
            <p className="text-slate-600">Contact: {vendor.contactPerson} ({vendor.phone})</p>
          </div>
          <div className="text-right">
            <p className="font-mono font-bold text-slate-800">Vendor ID: {vendor.id}</p>
            <p className="text-slate-500">Category: {vendor.category}</p>
          </div>
        </div>

        <div className="border border-slate-200 rounded p-4 text-center space-y-1 bg-slate-50">
          <p className="text-xs text-slate-500 font-bold uppercase">Total Account Payable Balance</p>
          <p className="text-3xl font-black font-mono text-rose-600">৳ {vendor.balance.toLocaleString('en-BD')}</p>
        </div>

        <div className="flex justify-between pt-16 text-center text-xs font-semibold text-slate-700">
          <div className="w-48 border-t border-dashed border-slate-400 pt-2">Vendor Representative</div>
          <div className="w-48 border-t border-dashed border-slate-400 pt-2">Authorized Manager</div>
        </div>
      </div>
    </div>
  );
}


export default function VendorPrintPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <VendorPrintPageContent />
    </Suspense>
  );
}
