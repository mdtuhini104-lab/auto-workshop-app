'use client';

import React, {  useEffect, useState , Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StockItem } from '@/types/erp';
import { INITIAL_STOCK } from '@/data/initialMockData';

function StockItemViewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || 'STK-001';

  const [item, setItem] = useState<StockItem | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('erp_inventory_stock');
    const items: StockItem[] = saved ? JSON.parse(saved) : INITIAL_STOCK;
    const found = items.find((s) => s.id === id) || items[0];
    setItem(found);
  }, [id]);

  if (!item) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          &larr; Back to Stock Control
        </button>
        <div className="flex items-center gap-2">
          <Link prefetch={false} href={`/inventory/stock/print?id=${item.id}`}
            className="px-4 py-1.5 bg-[#003d6c] text-white font-medium rounded text-sm hover:bg-[#002d50] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            Print Item Tag
          </Link>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">{item.name}</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              SKU ID: {item.id} • OEM Part: {item.partNo}
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-blue-100 text-blue-800 border border-blue-300">
            {item.category}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs">
          <div>
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Available Quantity</p>
            <p className="font-bold text-emerald-700 text-base">{item.quantity} {item.unit}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Unit Cost Price</p>
            <p className="font-mono text-slate-800 font-bold text-sm">৳ {item.unitCost.toLocaleString('en-BD')}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Warehouse Rack / Bin</p>
            <p className="font-mono font-semibold text-slate-800 text-sm">{item.location}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase">Valuation Summary</p>
          <div className="flex justify-between items-center">
            <span className="text-slate-700 text-sm font-medium">Total Inventory Asset Value:</span>
            <span className="text-2xl font-black font-mono text-[#004e89]">
              ৳ {(item.quantity * item.unitCost).toLocaleString('en-BD')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function StockItemViewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <StockItemViewPageContent />
    </Suspense>
  );
}
