'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function NotificationRulesContent() {
  const [isSaved, setIsSaved] = useState(false);
  const [rules, setRules] = useState({
    lowStockThreshold: 5,
    enableSmsAlerts: true,
    enableEmailAlerts: true,
    notifyOnJobCardCompletion: true,
    notifyOnPaymentReceived: true,
    notifyOnLowStock: true,
    adminMobile: '+880 1711-000000',
    adminEmail: 'admin@mamunautomobiles.com'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto text-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notification Rules & Thresholds</h1>
          <p className="text-xs text-slate-500 mt-1">Configure automated stock alerts, SMS notifications, and system dispatch triggers.</p>
        </div>
        <Link href="/settings" prefetch={false} className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors shadow-xs">
          &larr; Back to Settings Hub
        </Link>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
          ✓ Notification rules saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Inventory Stock Alert Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Low-Stock Alert Quantity Threshold</label>
            <input 
              type="number" 
              className="w-full h-9 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
              value={rules.lowStockThreshold}
              onChange={e => setRules(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 0 }))}
              placeholder="e.g. 5"
            />
            <span className="text-[11px] text-slate-400">Trigger alert when item inventory count drops below this number.</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Send In-App Alert on Low Stock</span>
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                checked={rules.notifyOnLowStock}
                onChange={e => setRules(prev => ({ ...prev, notifyOnLowStock: e.target.checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Send Customer SMS on Job Card Completion</span>
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                checked={rules.notifyOnJobCardCompletion}
                onChange={e => setRules(prev => ({ ...prev, notifyOnJobCardCompletion: e.target.checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Send Email Alert on Payment Receipt</span>
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                checked={rules.notifyOnPaymentReceived}
                onChange={e => setRules(prev => ({ ...prev, notifyOnPaymentReceived: e.target.checked }))}
              />
            </div>
          </div>
        </div>

        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 pt-2">Alert Recipients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Manager SMS Dispatch Phone Number</label>
            <input 
              type="text" 
              className="w-full h-9 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
              value={rules.adminMobile}
              onChange={e => setRules(prev => ({ ...prev, adminMobile: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Admin Email Dispatch Address</label>
            <input 
              type="email" 
              className="w-full h-9 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
              value={rules.adminEmail}
              onChange={e => setRules(prev => ({ ...prev, adminEmail: e.target.value }))}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c] transition-colors shadow-sm">
            Save Notification Rules
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NotificationRulesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading notification rules...</div>}>
      <NotificationRulesContent />
    </Suspense>
  );
}
