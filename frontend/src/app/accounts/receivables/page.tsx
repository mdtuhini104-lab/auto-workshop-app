"use client";
import React, { useState } from "react";

export default function ReceivablesPage() {
  const [receivables] = useState([
    { id: 1, customer: "Acme Corp", phone: "01700000001", total_due: 15000, last_invoice: "INV-1024", aging: "30 Days" },
    { id: 2, customer: "Logistics Ltd", phone: "01900000005", total_due: 50000, last_invoice: "INV-1010", aging: "60 Days" }
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen rounded-xl mt-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Accounts Receivable</h1>
          <p className="text-gray-500 mt-2">Track customer outstanding balances and partial payment ledgers.</p>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-right">
          <p className="text-xs uppercase tracking-wider font-bold">Total Receivables</p>
          <p className="text-2xl font-bold">BDT 65,000.00</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b border-gray-200 text-gray-700 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Customer Name</th>
              <th className="px-6 py-4 font-semibold">Contact</th>
              <th className="px-6 py-4 font-semibold">Aging</th>
              <th className="px-6 py-4 font-semibold">Last Invoice</th>
              <th className="px-6 py-4 font-semibold text-right">Total Due</th>
              <th className="px-6 py-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {receivables.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-800">{r.customer}</td>
                <td className="px-6 py-4 text-gray-500">{r.phone}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${r.aging === '60 Days' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {r.aging}
                  </span>
                </td>
                <td className="px-6 py-4 text-blue-600 font-mono">{r.last_invoice}</td>
                <td className="px-6 py-4 text-right font-bold text-red-600">BDT {r.total_due.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <button className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded text-xs font-bold transition-colors">
                    Receive Payment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
