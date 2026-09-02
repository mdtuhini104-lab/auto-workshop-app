'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { ShoppingBag, CheckCircle2, AlertTriangle, Plus, Search, Truck } from 'lucide-react';

interface PurchaseOrder {
  id: string;
  poNo: string;
  vendorName: string;
  itemName: string;
  sku: string;
  qty: number;
  unitPrice: number;
  totalAmount: number;
  status: 'Pending' | 'Ordered' | 'Received';
  date: string;
}

const mockOrders: PurchaseOrder[] = [
  { id: '1', poNo: 'PO-2026-089', vendorName: 'RahimAfrooz Ltd', itemName: 'Bosch Synthetic Engine Oil 4L', sku: 'PRT-8821', qty: 20, unitPrice: 4500, totalAmount: 90000, status: 'Received', date: '2026-08-01' },
  { id: '2', poNo: 'PO-2026-090', vendorName: 'AutoParts BD', itemName: 'NGK Iridium Spark Plug', sku: 'PRT-6012', qty: 50, unitPrice: 1200, totalAmount: 60000, status: 'Ordered', date: '2026-08-05' },
];

function PurchasesContent() {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockOrders);
  const [pendingReorder, setPendingReorder] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Read pending re-order PO passed from Inventory 1-click reorder
    const saved = localStorage.getItem('pending_reorder_po');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPendingReorder(parsed);
        setToastMessage(`✓ Auto-filled Vendor Re-order Purchase Order for ${parsed.itemName}!`);
        // Remove so it doesn't prompt again on refresh
        localStorage.removeItem('pending_reorder_po');
      } catch (e) {}
    }
  }, []);

  const handleConfirmReorder = () => {
    if (!pendingReorder) return;
    const newPO: PurchaseOrder = {
      id: Date.now().toString(),
      poNo: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      vendorName: pendingReorder.vendorName,
      itemName: pendingReorder.itemName,
      sku: pendingReorder.sku,
      qty: pendingReorder.qty,
      unitPrice: pendingReorder.unitPrice,
      totalAmount: pendingReorder.totalAmount,
      status: 'Ordered',
      date: new Date().toISOString().split('T')[0]
    };

    setOrders(prev => [newPO, ...prev]);
    setPendingReorder(null);
    setToastMessage(`✓ Purchase Order #${newPO.poNo} dispatched to vendor ${newPO.vendorName}!`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const filteredOrders = orders.filter(o => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return o.poNo.toLowerCase().includes(term) || o.vendorName.toLowerCase().includes(term) || o.itemName.toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-800 dark:text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 space-x-1 mb-1">
            <Link href="/dashboard" prefetch={false} className="hover:underline">Dashboard</Link>
            <span>&gt;</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Purchases</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Purchases & Vendor Replenishment</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage spare parts purchase orders, vendor invoices, and automated stock re-orders.</p>
        </div>

        <button className="px-4 py-2 bg-[#004e89] hover:bg-[#003d6c] text-white font-bold rounded-lg text-xs transition shadow-xs flex items-center gap-1.5 w-fit">
          <Plus className="w-4 h-4" />
          <span>New Purchase Order</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Pending Reorder Draft Banner */}
      {pendingReorder && (
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-sm text-blue-950 dark:text-blue-200">Auto-Generated Low-Stock Purchase Order Draft</h2>
            </div>
            <span className="px-2.5 py-0.5 bg-blue-200 text-blue-800 font-bold rounded-full text-[10px]">Draft Ready</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-white dark:bg-slate-800 p-4 rounded-lg border border-blue-100 dark:border-slate-700 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Vendor</span>
              <span className="font-bold text-slate-900 dark:text-white">{pendingReorder.vendorName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Item</span>
              <span className="font-bold text-slate-900 dark:text-white">{pendingReorder.itemName} ({pendingReorder.sku})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Re-order Qty</span>
              <span className="font-bold text-slate-900 dark:text-white">{pendingReorder.qty} Pcs</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-sans">Estimated Cost</span>
              <span className="font-bold text-slate-900 dark:text-white">৳ {pendingReorder.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setPendingReorder(null)} className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
              Discard
            </button>
            <button onClick={handleConfirmReorder} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition">
              ✓ Dispatch Purchase Order
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">Purchase Orders History</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search POs..." 
              aria-label="Filter purchase orders"
              className="w-48 py-1.5 px-3 pl-9 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-3 px-4">PO Number</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Vendor</th>
              <th className="py-3 px-4">Item Name</th>
              <th className="py-3 px-4 text-center">Qty</th>
              <th className="py-3 px-4 text-right">Total Amount</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {filteredOrders.map(o => (
              <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">{o.poNo}</td>
                <td className="py-3 px-4 font-mono text-slate-500">{o.date}</td>
                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{o.vendorName}</td>
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{o.itemName} ({o.sku})</td>
                <td className="py-3 px-4 text-center font-mono font-bold">{o.qty}</td>
                <td className="py-3 px-4 text-right font-mono font-bold">৳ {o.totalAmount.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    o.status === 'Received' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PurchasesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading purchases...</div>}>
      <PurchasesContent />
    </Suspense>
  );
}
