'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PurchaseReturnItem, PurchaseReturnRecord } from '../page';
import AiInput from '@/components/ui/AiInput';

export default function CreatePurchaseReturnPage() {
  const router = useRouter();

  // Form State
  const [vendorName, setVendorName] = useState('Akij Motors Ltd');
  const [refOrder, setRefOrder] = useState('PO-2026-102');
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('Defective Parts');
  const [remarks, setRemarks] = useState('Parts damaged upon arrival. Requesting replacement credit.');

  // Items State
  const [items, setItems] = useState<PurchaseReturnItem[]>([
    { id: '1', name: 'Engine Oil Filter (Genuine)', qty: 2, unitPrice: 1200, tax: 0, total: 2400 },
  ]);

  const [deductions, setDeductions] = useState(0);

  const handleAddItem = () => {
    const newItem: PurchaseReturnItem = {
      id: Date.now().toString(),
      name: '',
      qty: 1,
      unitPrice: 0,
      tax: 0,
      total: 0,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) return;
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof PurchaseReturnItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'qty' || field === 'unitPrice' || field === 'tax') {
            const qty = field === 'qty' ? Number(value) : item.qty;
            const price = field === 'unitPrice' ? Number(value) : item.unitPrice;
            const tax = field === 'tax' ? Number(value) : item.tax;
            updated.total = qty * price + tax;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((acc, curr) => acc + curr.total, 0);
  const totalCredit = Math.max(0, subtotal - deductions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vendorName.trim()) {
      alert('Please select or enter a Vendor Name.');
      return;
    }

    const itemsSummary = items
      .map((i) => `${i.name || 'Item'} x ${i.qty}`)
      .join(', ');

    const newReturn: PurchaseReturnRecord = {
      id: `PR-${Date.now().toString().slice(-4)}`,
      vendorName,
      refOrder,
      returnDate,
      reason,
      itemsReturned: itemsSummary,
      itemsList: items,
      subtotal,
      deductions,
      totalCredit,
      status: 'Pending',
      remarks,
    };

    // Save to localStorage
    const saved = localStorage.getItem('purchase_returns');
    let existing: PurchaseReturnRecord[] = [];
    if (saved) {
      try {
        existing = JSON.parse(saved);
      } catch {}
    }

    const updatedList = [newReturn, ...existing];
    localStorage.setItem('purchase_returns', JSON.stringify(updatedList));

    // Redirect to list
    router.push('/purchases/returns');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          &larr; Back
        </button>
        <h1 className="text-xl font-bold text-slate-900">Create Purchase Return (Return to Vendor)</h1>
        <div className="w-16" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: VENDOR & REFERENCE SELECTOR */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#004e89] border-b border-slate-100 pb-2">
            1. Vendor & Return Reference
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Vendor Name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Vendor / Supplier *</label>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                required
                placeholder="e.g. Akij Motors Ltd"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
              />
            </div>

            {/* Ref Purchase Order */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Ref PO / Invoice #</label>
              <input
                type="text"
                value={refOrder}
                onChange={(e) => setRefOrder(e.target.value)}
                placeholder="e.g. PO-2026-102"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium font-mono"
              />
            </div>

            {/* Return Date */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Return Date</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
              />
            </div>

            {/* Reason */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Reason for Return</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
              >
                <option value="Defective Parts">Defective / Damaged Parts</option>
                <option value="Wrong Item Delivered">Wrong Item Delivered</option>
                <option value="Damaged in Shipping">Damaged in Shipping</option>
                <option value="Overstocked Item">Overstocked Item</option>
                <option value="Other">Other Reason</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: ITEMS RETURNED TABLE */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#004e89]">
              2. Returned Line Items
            </h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#004e89] rounded-lg text-xs font-bold transition-colors"
            >
              + Add Item Line
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center w-24">Qty Returned</th>
                  <th className="py-2.5 px-3 text-right w-32">Unit Price (৳)</th>
                  <th className="py-2.5 px-3 text-right w-28">Tax (৳)</th>
                  <th className="py-2.5 px-3 text-right w-36">Total (৳)</th>
                  <th className="py-2.5 px-3 text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        placeholder="Item name / part #"
                        required
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#004e89]"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                        className="w-full text-center px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#004e89]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                        className="w-full text-right px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#004e89]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        min="0"
                        value={item.tax}
                        onChange={(e) => handleItemChange(item.id, 'tax', e.target.value)}
                        className="w-full text-right px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#004e89]"
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      ৳ {item.total.toLocaleString('en-BD')}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-rose-600 hover:text-rose-800 font-bold px-2 py-1"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: SUMMARY & NOTES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notes & Remarks */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#004e89] border-b border-slate-100 pb-2">
              3. Remarks & Vendor Credit Info
            </h2>
            <AiInput
              label="Vendor Remarks (Auto-suggests spelling)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any credit note references or special instructions..."
            />
          </div>

          {/* Credit Financial Summary */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#004e89] border-b border-slate-100 pb-2">
              Credit Calculation Summary
            </h2>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Items Subtotal:</span>
              <span className="font-mono font-bold text-slate-900">৳ {subtotal.toLocaleString('en-BD')}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>Handling / Restocking Deductions:</span>
              <input
                type="number"
                min="0"
                value={deductions}
                onChange={(e) => setDeductions(Number(e.target.value))}
                className="w-28 text-right px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#004e89]"
              />
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <span className="text-sm font-bold text-[#004e89]">Total Refund / Credit Amount:</span>
              <span className="text-lg font-black font-mono text-[#004e89]">
                ৳ {totalCredit.toLocaleString('en-BD')}
              </span>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON GROUP */}
        <div className="flex justify-end gap-3 pt-2">
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
            Save Purchase Return
          </button>
        </div>
      </form>
    </div>
  );
}
