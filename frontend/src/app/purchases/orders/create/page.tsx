'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PurchaseOrder } from '@/types/erp';
import { INITIAL_PURCHASE_ORDERS } from '@/data/initialMockData';

export default function CreatePurchaseOrderPage() {
  const router = useRouter();

  const [vendorName, setVendorName] = useState('Akij Motors Ltd');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDate, setExpectedDate] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [status, setStatus] = useState<'Approved' | 'Pending' | 'Received'>('Pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPO: PurchaseOrder = {
      id: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      vendorName,
      orderDate,
      expectedDate: expectedDate || orderDate,
      totalAmount,
      status,
    };

    const saved = localStorage.getItem('erp_purchase_orders');
    const existing: PurchaseOrder[] = saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS;
    const updated = [newPO, ...existing];
    localStorage.setItem('erp_purchase_orders', JSON.stringify(updated));

    router.push('/purchases/orders');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          &larr; Back to Purchase Orders
        </button>
        <h1 className="text-xl font-bold text-slate-900">Create Purchase Order (PO)</h1>
        <div className="w-16" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#004e89] border-b border-slate-100 pb-2">
          Purchase Order Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Vendor / Supplier *</label>
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Order Date</label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Expected Delivery Date</label>
            <input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Total Estimated Amount (৳)</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Received">Received</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-white text-slate-700 border border-slate-300 font-semibold rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#004e89] hover:bg-[#003d6c] text-white font-bold rounded-lg text-sm transition-colors shadow-sm"
          >
            Issue Purchase Order
          </button>
        </div>
      </form>
    </div>
  );
}
