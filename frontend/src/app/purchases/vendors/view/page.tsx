'use client';

import React, {  useEffect, useState , Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Vendor } from '@/types/erp';
import { INITIAL_VENDORS } from '@/data/initialMockData';

function VendorViewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || 'VND-001';

  const [vendor, setVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('erp_vendors');
    const vendors: Vendor[] = saved ? JSON.parse(saved) : INITIAL_VENDORS;
    const found = vendors.find((v) => v.id === id) || vendors[0];
    setVendor(found);
  }, [id]);

  if (!vendor) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          &larr; Back to Vendors
        </button>
        <div className="flex items-center gap-2">
          <Link prefetch={false} href={`/purchases/vendors/print?id=${vendor.id}`}
            className="px-4 py-1.5 bg-[#003d6c] text-white font-medium rounded text-sm hover:bg-[#002d50] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            Print Vendor Statement
          </Link>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">{vendor.name}</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Vendor ID: {vendor.id}
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            {vendor.status}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs">
          <div>
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Contact Person</p>
            <p className="font-bold text-slate-900 text-sm">{vendor.contactPerson}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Phone Number</p>
            <p className="font-mono text-slate-800 font-bold text-sm">{vendor.phone}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Supply Category</p>
            <p className="font-semibold text-slate-800 text-sm">{vendor.category}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase">Financial Account Balance</p>
          <div className="flex justify-between items-center">
            <span className="text-slate-700 text-sm font-medium">Total Outstanding Payable:</span>
            <span className="text-2xl font-black font-mono text-rose-600">
              ৳ {vendor.balance.toLocaleString('en-BD')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function VendorViewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <VendorViewPageContent />
    </Suspense>
  );
}
