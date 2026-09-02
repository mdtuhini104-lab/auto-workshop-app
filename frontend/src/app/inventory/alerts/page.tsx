'use client';

import React, { useState, useEffect } from 'react';

interface StockAlert {
  id: string;
  itemName: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  reorderQty: number;
  status: 'Critical Low' | 'Low Stock';
}

const DEFAULT_ALERTS: StockAlert[] = [
  { id: 'ALT-01', itemName: 'Front Brake Pads Set (Akebono)', category: 'Brake System', currentStock: 3, minThreshold: 10, reorderQty: 25, status: 'Critical Low' },
  { id: 'ALT-02', itemName: 'AC Cabin Filter', category: 'Filters', currentStock: 5, minThreshold: 15, reorderQty: 30, status: 'Low Stock' },
];

export default function LowStockAlertsPage() {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('erp_low_stock_alerts');
    if (saved) {
      try { setAlerts(JSON.parse(saved)); } catch { setAlerts(DEFAULT_ALERTS); }
    } else {
      setAlerts(DEFAULT_ALERTS);
      localStorage.setItem('erp_low_stock_alerts', JSON.stringify(DEFAULT_ALERTS));
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Low Stock & Reorder Alerts</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Automatic threshold warnings for items below minimum safety levels</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          + Generate Auto Purchase Orders
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Alerting Items</p>
          <p className="text-2xl font-black text-rose-600 mt-2">{alerts.length} Items</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Critical Low (&lt;5)</p>
          <p className="text-2xl font-black text-rose-600 mt-2">{alerts.filter(a=>a.status==='Critical Low').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Reorder Suggested Value</p>
          <p className="text-2xl font-black text-[#004e89] mt-2">৳ 185,000</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Warehouse Status</p>
          <p className="text-2xl font-black text-amber-600 mt-2">Reorder Required</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Item Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">Current Stock</th>
              <th className="py-3 px-4 text-center">Min Safety Limit</th>
              <th className="py-3 px-4 text-center">Suggested Reorder Qty</th>
              <th className="py-3 px-4 text-center">Alert Severity</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {alerts.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">{a.itemName}</td>
                <td className="py-3 px-4 text-slate-600">{a.category}</td>
                <td className="py-3 px-4 text-center font-bold text-rose-600">{a.currentStock} Pcs</td>
                <td className="py-3 px-4 text-center font-semibold text-slate-700">{a.minThreshold} Pcs</td>
                <td className="py-3 px-4 text-center font-bold text-[#004e89]">{a.reorderQty} Pcs</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${a.status==='Critical Low'?'bg-rose-100 text-rose-800 border-rose-300':'bg-amber-100 text-amber-800 border-amber-300'}`}>
                    {a.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="px-2.5 py-1 bg-[#004e89] text-white rounded text-xs font-semibold">Create PO</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
