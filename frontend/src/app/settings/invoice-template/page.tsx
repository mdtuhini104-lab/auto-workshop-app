'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function InvoiceTemplateContent() {
  const [showLogo, setShowLogo] = useState(true);
  const [showTerms, setShowTerms] = useState(true);
  const [accentColor, setAccentColor] = useState('#004e89');
  const [notes, setNotes] = useState('Thank you for choosing Mamun Automobiles ERP! Warranty valid for 30 days on parts.');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoice & Print Template Customizer</h1>
          <p className="text-xs text-slate-500 mt-1">Live visual editor for invoices, bills, and quotation print layouts.</p>
        </div>
        <Link href="/dashboard" prefetch={false} className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors shadow-xs">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Layout Controls</h2>
          
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Display Workshop Logo Header</span>
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                checked={showLogo} 
                onChange={e => setShowLogo(e.target.checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Display Warranty & Terms Box</span>
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                checked={showTerms} 
                onChange={e => setShowTerms(e.target.checked)}
              />
            </div>
            
            <div className="space-y-1 pt-2">
              <label className="font-semibold text-slate-700">Accent Theme Color</label>
              <div className="flex gap-2">
                {['#004e89', '#16a34a', '#dc2626', '#4f46e5', '#0f172a'].map(color => (
                  <button 
                    key={color}
                    type="button"
                    onClick={() => setAccentColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${accentColor === color ? 'border-black scale-110' : 'border-transparent'}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="font-semibold text-slate-700">Default Footer Terms & Warranty Notice</label>
              <textarea 
                rows={3} 
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>

          <button className="w-full py-2.5 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c] transition-colors shadow-sm">
            Save Template Customization
          </button>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-7 bg-slate-100 p-6 rounded-xl border border-slate-200">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Live Print Preview (A4)</div>
          
          <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200 space-y-6 text-xs text-slate-800">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight" style={{ color: accentColor }}>Mamun Automobiles ERP</h1>
                <p className="text-[11px] text-slate-500">Plot # 197, Sector # 7, Uttara, Dhaka-1230</p>
                <p className="text-[11px] text-slate-500">Phone: +880 1711-000000 | BIN: 001234567-0101</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 text-xs font-extrabold text-white rounded" style={{ backgroundColor: accentColor }}>INVOICE</span>
                <p className="text-xs font-mono font-bold mt-1 text-slate-800">#INV-2026-0088</p>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div>
                <span className="font-bold text-slate-500 uppercase block text-[10px]">Customer Information</span>
                <p className="font-bold text-slate-900">Mr. Tareq Rahman</p>
                <p className="text-slate-600">Vehicle: Toyota Prado (DHK-METRO-GA-13-8851)</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-500 uppercase block text-[10px]">Invoice Details</span>
                <p className="text-slate-600">Date: August 07, 2026</p>
                <p className="text-slate-600">Payment: Paid via Bkash</p>
              </div>
            </div>

            {/* Sample Items Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead className="text-white text-[10px] uppercase font-bold" style={{ backgroundColor: accentColor }}>
                <tr>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-right">Price</th>
                  <th className="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-3 font-medium">Mobil 1 Synthetic Engine Oil 4L</td>
                  <td className="py-2 px-3 text-center">1</td>
                  <td className="py-2 px-3 text-right">৳ 4,500.00</td>
                  <td className="py-2 px-3 text-right font-bold">৳ 4,500.00</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Full Synthetic Oil & Filter Service Labor</td>
                  <td className="py-2 px-3 text-center">1</td>
                  <td className="py-2 px-3 text-right">৳ 1,200.00</td>
                  <td className="py-2 px-3 text-right font-bold">৳ 1,200.00</td>
                </tr>
              </tbody>
            </table>

            {/* Total */}
            <div className="flex justify-end pt-2 border-t border-slate-200">
              <div className="w-48 space-y-1 text-right text-xs">
                <div className="flex justify-between text-slate-600"><span>Subtotal:</span><span>৳ 5,700.00</span></div>
                <div className="flex justify-between text-slate-600"><span>VAT (15%):</span><span>৳ 855.00</span></div>
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span style={{ color: accentColor }}>৳ 6,555.00</span>
                </div>
              </div>
            </div>

            {/* Terms Footer */}
            {showTerms && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 space-y-0.5">
                <span className="font-bold block text-slate-800">Terms & Warranty Notice:</span>
                <p>{notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvoiceTemplatePage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading template editor...</div>}>
      <InvoiceTemplateContent />
    </Suspense>
  );
}
