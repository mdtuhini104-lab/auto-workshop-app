'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StockItem } from '@/types/erp';
import { INITIAL_STOCK } from '@/data/initialMockData';

export default function CreateStockItemPage() {
  const router = useRouter();

  const [partNo, setPartNo] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Lubricants & Fluids');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('Pcs');
  const [unitCost, setUnitCost] = useState(0);
  const [location, setLocation] = useState('Rack A-01');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter Item Name.');
      return;
    }

    const newStockItem: StockItem = {
      id: `STK-${Math.floor(100 + Math.random() * 900)}`,
      partNo: partNo || `SKU-${Date.now().toString().slice(-4)}`,
      name,
      category,
      quantity,
      unit,
      unitCost,
      location,
    };

    const saved = localStorage.getItem('erp_inventory_stock');
    const existing: StockItem[] = saved ? JSON.parse(saved) : INITIAL_STOCK;
    const updated = [newStockItem, ...existing];
    localStorage.setItem('erp_inventory_stock', JSON.stringify(updated));

    router.push('/inventory/stock');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          &larr; Back to Stock Control
        </button>
        <h1 className="text-xl font-bold text-slate-900">Add New Inventory Item</h1>
        <div className="w-16" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#004e89] border-b border-slate-100 pb-2">
          Item & Warehouse Specifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">OEM Part Number / SKU</label>
            <input
              type="text"
              value={partNo}
              onChange={(e) => setPartNo(e.target.value)}
              placeholder="e.g. OIL-SYN-5W40"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Item Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Synthetic Engine Oil 5W-40 (4L)"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            >
              <option value="Lubricants & Fluids">Lubricants & Fluids</option>
              <option value="Filters">Filters</option>
              <option value="Brake System">Brake System</option>
              <option value="Suspension Parts">Suspension Parts</option>
              <option value="Electrical Components">Electrical Components</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Initial Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Unit Type</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            >
              <option value="Pcs">Pcs</option>
              <option value="Can">Can</option>
              <option value="Set">Set</option>
              <option value="Ltr">Ltr</option>
              <option value="Box">Box</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Unit Cost Price (৳)</label>
            <input
              type="number"
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Warehouse Rack / Bin Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Rack A-12"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-mono"
            />
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
            Add Stock Item
          </button>
        </div>
      </form>
    </div>
  );
}
