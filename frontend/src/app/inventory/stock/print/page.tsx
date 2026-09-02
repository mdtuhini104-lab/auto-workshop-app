'use client';

import React, {  useEffect, useState , Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { StockItem } from '@/types/erp';
import { INITIAL_STOCK } from '@/data/initialMockData';

function StockItemPrintPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || 'STK-001';

  const [item, setItem] = useState<StockItem | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('erp_inventory_stock');
    const items: StockItem[] = saved ? JSON.parse(saved) : INITIAL_STOCK;
    const found = items.find((s) => s.id === id) || items[0];
    setItem(found);

    setTimeout(() => {
      window.print();
    }, 500);
  }, [id]);

  if (!item) return null;

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
          Print Item Tag
        </button>
      </div>

      <div id="printable-stock-doc" className="w-full max-w-[210mm] bg-white border border-slate-300 p-8 rounded-lg space-y-6">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * { visibility: hidden; }
            #printable-stock-doc, #printable-stock-doc * { visibility: visible; }
            #printable-stock-doc { position: absolute; left: 0; top: 0; width: 100%; border: none; }
          }
        `}} />

        <div className="border-b border-slate-300 pb-4 text-center">
          <h1 className="text-2xl font-black text-[#004e89]">MAMUN AUTOMOBILES ERP</h1>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Inventory Stock Tag & Barcode Sheet</p>
        </div>

        <div className="flex justify-between items-center text-xs">
          <div>
            <p className="font-bold text-lg text-slate-900">{item.name}</p>
            <p className="text-slate-600 font-mono">Part #: {item.partNo} • SKU: {item.id}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-emerald-700 text-sm">{item.quantity} {item.unit} Available</p>
            <p className="text-slate-500 font-mono">Location: {item.location}</p>
          </div>
        </div>

        <div className="border border-slate-200 rounded p-4 text-center space-y-1 bg-slate-50">
          <p className="text-xs text-slate-500 font-bold uppercase">Asset Valuation</p>
          <p className="text-3xl font-black font-mono text-[#004e89]">৳ {(item.quantity * item.unitCost).toLocaleString('en-BD')}</p>
        </div>

        <div className="flex justify-between pt-16 text-center text-xs font-semibold text-slate-700">
          <div className="w-48 border-t border-dashed border-slate-400 pt-2">Store Keeper</div>
          <div className="w-48 border-t border-dashed border-slate-400 pt-2">Auditor Signature</div>
        </div>
      </div>
    </div>
  );
}


export default function StockItemPrintPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <StockItemPrintPageContent />
    </Suspense>
  );
}
