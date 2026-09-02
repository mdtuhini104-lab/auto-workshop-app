'use client';

import React, { useState } from 'react';

interface InvoiceFile {
  id: string;
  invoiceNo: string;
  category: 'Customer Invoice' | 'Vendor Bill' | 'Expense Receipt';
  partyName: string;
  issueDate: string;
  fileSize: string;
}

const DEFAULT_INVOICE_FILES: InvoiceFile[] = [
  { id: 'FILE-301', invoiceNo: 'INV-2026-031', category: 'Customer Invoice', partyName: 'Europetex Limited', issueDate: '2026-07-23', fileSize: '1.2 MB' },
  { id: 'FILE-302', invoiceNo: 'PINV-2026-101', category: 'Vendor Bill', partyName: 'Akij Motors Ltd', issueDate: '2026-07-20', fileSize: '850 KB' },
];

export default function InvoiceFilesPage() {
  const [files] = useState<InvoiceFile[]>(DEFAULT_INVOICE_FILES);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoices & Financial Receipts Archive</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Digital copies of billed customer invoices, vendor bills, and receipt scans</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          + Upload Financial Document
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Archived Documents</p>
          <p className="text-2xl font-black text-slate-900 mt-2">{files.length} Files</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Customer Invoices</p>
          <p className="text-2xl font-black text-[#004e89] mt-2">{files.filter(f=>f.category==='Customer Invoice').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Vendor Bills</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">{files.filter(f=>f.category==='Vendor Bill').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Archive Storage</p>
          <p className="text-2xl font-black text-amber-600 mt-2">4.5 MB</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">File ID</th>
              <th className="py-3 px-4">Document / Invoice #</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Party Name</th>
              <th className="py-3 px-4">Issue Date</th>
              <th className="py-3 px-4 text-center">File Size</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {files.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-bold text-[#004e89]">{f.id}</td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">{f.invoiceNo}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{f.category}</td>
                <td className="py-3 px-4 text-slate-700">{f.partyName}</td>
                <td className="py-3 px-4 text-slate-600">{f.issueDate}</td>
                <td className="py-3 px-4 text-center font-mono text-slate-600">{f.fileSize}</td>
                <td className="py-3 px-4 text-right">
                  <button className="px-2.5 py-1 bg-[#004e89] text-white rounded text-xs font-semibold">Download PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
