'use client';

import React, { useState, useEffect } from 'react';

interface VendorPayment {
  id: string;
  vendorName: string;
  paymentDate: string;
  paymentMethod: 'Bank Transfer' | 'Cheque' | 'Cash';
  referenceNo: string;
  amount: number;
}

const DEFAULT_PAYMENTS: VendorPayment[] = [
  { id: 'VP-2026-081', vendorName: 'Akij Motors Ltd', paymentDate: '2026-07-28', paymentMethod: 'Bank Transfer', referenceNo: 'TRX-9988112', amount: 48500 },
  { id: 'VP-2026-082', vendorName: 'Navana Toyota Motors', paymentDate: '2026-07-29', paymentMethod: 'Cheque', referenceNo: 'CHQ-554109', amount: 50000 },
];

export default function VendorPaymentsPage() {
  const [payments, setPayments] = useState<VendorPayment[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('erp_vendor_payments');
    if (saved) {
      try { setPayments(JSON.parse(saved)); } catch { setPayments(DEFAULT_PAYMENTS); }
    } else {
      setPayments(DEFAULT_PAYMENTS);
      localStorage.setItem('erp_vendor_payments', JSON.stringify(DEFAULT_PAYMENTS));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vendor Payments</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Disbursement history, bank transfers, and payment vouchers</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          + Make Vendor Payment
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Payments Made</p>
          <p className="text-2xl font-black text-slate-900 mt-2">৳ {payments.reduce((a,b)=>a+b.amount,0).toLocaleString('en-BD')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Bank Transfers</p>
          <p className="text-2xl font-black text-[#004e89] mt-2">{payments.filter(p=>p.paymentMethod==='Bank Transfer').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Cheque Payments</p>
          <p className="text-2xl font-black text-amber-600 mt-2">{payments.filter(p=>p.paymentMethod==='Cheque').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Cash Payments</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">{payments.filter(p=>p.paymentMethod==='Cash').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Voucher #</th>
              <th className="py-3 px-4">Vendor Name</th>
              <th className="py-3 px-4">Payment Date</th>
              <th className="py-3 px-4">Method</th>
              <th className="py-3 px-4">Ref / TRX #</th>
              <th className="py-3 px-4 text-right">Amount Paid (৳)</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-bold text-[#004e89]">{p.id}</td>
                <td className="py-3 px-4 font-semibold text-slate-900">{p.vendorName}</td>
                <td className="py-3 px-4 text-slate-600">{p.paymentDate}</td>
                <td className="py-3 px-4 text-slate-700 font-medium">{p.paymentMethod}</td>
                <td className="py-3 px-4 font-mono text-slate-600">{p.referenceNo}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">৳ {p.amount.toLocaleString('en-BD')}</td>
                <td className="py-3 px-4 text-right">
                  <button className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">Print Receipt</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
