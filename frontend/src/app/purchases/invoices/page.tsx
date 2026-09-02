'use client';

import React, { useState, useEffect } from 'react';

interface PurchaseInvoice {
  id: string;
  vendorInvoiceNo: string;
  vendorName: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: 'Paid' | 'Partially Paid' | 'Unpaid';
}

const DEFAULT_INVOICES: PurchaseInvoice[] = [
  { id: 'PINV-2026-101', vendorInvoiceNo: 'INV-AK-8841', vendorName: 'Akij Motors Ltd', invoiceDate: '2026-07-20', dueDate: '2026-08-04', amount: 48500, paidAmount: 48500, status: 'Paid' },
  { id: 'PINV-2026-102', vendorInvoiceNo: 'NV-9921', vendorName: 'Navana Toyota Motors', invoiceDate: '2026-07-26', dueDate: '2026-08-10', amount: 125000, paidAmount: 50000, status: 'Partially Paid' },
  { id: 'PINV-2026-103', vendorInvoiceNo: 'MJL-00129', vendorName: 'Mobil Bangladesh (MJL)', invoiceDate: '2026-07-29', dueDate: '2026-08-13', amount: 32000, paidAmount: 0, status: 'Unpaid' },
];

export default function PurchaseInvoicesPage() {
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('erp_purchase_invoices');
    if (saved) {
      try { setInvoices(JSON.parse(saved)); } catch { setInvoices(DEFAULT_INVOICES); }
    } else {
      setInvoices(DEFAULT_INVOICES);
      localStorage.setItem('erp_purchase_invoices', JSON.stringify(DEFAULT_INVOICES));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Purchase Invoices</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Vendor bills and supplier invoice payment tracking</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          + Enter Vendor Bill
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Bills Value</p>
          <p className="text-2xl font-black text-slate-900 mt-2">৳ {invoices.reduce((a,b)=>a+b.amount,0).toLocaleString('en-BD')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Paid</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">৳ {invoices.reduce((a,b)=>a+b.paidAmount,0).toLocaleString('en-BD')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Outstanding Due</p>
          <p className="text-2xl font-black text-rose-600 mt-2">৳ {invoices.reduce((a,b)=>a+(b.amount-b.paidAmount),0).toLocaleString('en-BD')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Unpaid Bills</p>
          <p className="text-2xl font-black text-amber-600 mt-2">{invoices.filter(i=>i.status!=='Paid').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Internal Bill #</th>
              <th className="py-3 px-4">Vendor Invoice #</th>
              <th className="py-3 px-4">Vendor Name</th>
              <th className="py-3 px-4">Bill Date</th>
              <th className="py-3 px-4 text-right">Total Amount (৳)</th>
              <th className="py-3 px-4 text-right">Paid Amount (৳)</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-bold text-[#004e89]">{inv.id}</td>
                <td className="py-3 px-4 font-mono text-slate-600">{inv.vendorInvoiceNo}</td>
                <td className="py-3 px-4 font-semibold text-slate-900">{inv.vendorName}</td>
                <td className="py-3 px-4 text-slate-600">{inv.invoiceDate}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">৳ {inv.amount.toLocaleString('en-BD')}</td>
                <td className="py-3 px-4 text-right font-mono text-emerald-700">৳ {inv.paidAmount.toLocaleString('en-BD')}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                    inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    inv.status === 'Partially Paid' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="px-2.5 py-1 bg-[#004e89] text-white rounded text-xs font-semibold">Pay Bill</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
