'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ShoppingCart, Search, Plus, CheckCircle2, ArrowRight } from 'lucide-react';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  currentStock: number;
  reorderPoint: number;
  unitPrice: number;
  unit: string;
  preferredVendor: string;
  defaultReorderQty: number;
}

const mockInventoryItems: InventoryItem[] = [
  { id: '1', sku: 'PRT-8821', name: 'Bosch Synthetic Engine Oil 4L', category: 'Lubricants', brand: 'Bosch', currentStock: 18, reorderPoint: 5, unitPrice: 4500, unit: 'Can', preferredVendor: 'RahimAfrooz Ltd', defaultReorderQty: 20 },
  { id: '2', sku: 'PRT-9042', name: 'Brake Pad Set (Front)', category: 'Braking System', brand: 'Brembo', currentStock: 2, reorderPoint: 5, unitPrice: 8500, unit: 'Set', preferredVendor: 'AutoParts BD', defaultReorderQty: 10 },
  { id: '3', sku: 'PRT-7719', name: 'AC Air Filter Replacement', category: 'Filters', brand: 'Toyota Genuine', currentStock: 1, reorderPoint: 4, unitPrice: 1800, unit: 'Pcs', preferredVendor: 'Navana Motors', defaultReorderQty: 15 },
  { id: '4', sku: 'PRT-6012', name: 'NGK Iridium Spark Plug', category: 'Ignition', brand: 'NGK', currentStock: 24, reorderPoint: 10, unitPrice: 1200, unit: 'Pcs', preferredVendor: 'AutoParts BD', defaultReorderQty: 50 },
  { id: '5', sku: 'PRT-4401', name: 'Amaron Maintenance Free Battery 65AH', category: 'Electrical', brand: 'Amaron', currentStock: 3, reorderPoint: 5, unitPrice: 14500, unit: 'Unit', preferredVendor: 'RahimAfrooz Ltd', defaultReorderQty: 5 },
];

function InventoryContent() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Low Stock' | 'In Stock'>('All');
  const [toastMessage, setToastMessage] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const isLowStock = item.currentStock <= item.reorderPoint;
      if (statusFilter === 'Low Stock' && !isLowStock) return false;
      if (statusFilter === 'In Stock' && isLowStock) return false;
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!item.name.toLowerCase().includes(term) && !item.sku.toLowerCase().includes(term) && !item.brand.toLowerCase().includes(term)) {
          return false;
        }
      }
      return true;
    });
  }, [items, searchTerm, categoryFilter, statusFilter]);

  const lowStockCount = useMemo(() => {
    return items.filter(i => i.currentStock <= i.reorderPoint).length;
  }, [items]);

  const handleReorder = (item: InventoryItem) => {
    // Save pending PO details in localStorage for Purchases page
    const pendingPo = {
      vendorName: item.preferredVendor,
      itemName: item.name,
      sku: item.sku,
      qty: item.defaultReorderQty,
      unitPrice: item.unitPrice,
      totalAmount: item.unitPrice * item.defaultReorderQty,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('pending_reorder_po', JSON.stringify(pendingPo));

    setToastMessage(`🛒 Re-order Purchase Order created for ${item.name} (${item.defaultReorderQty} ${item.unit})! Redirecting to Purchases...`);

    setTimeout(() => {
      router.push('/purchases');
    }, 1800);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-800 dark:text-slate-100 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 space-x-1 mb-1">
            <Link href="/dashboard" prefetch={false} className="hover:underline">Dashboard</Link>
            <span>&gt;</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Inventory Stock</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Inventory Stock Control</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage spare parts stock levels, automated low-stock re-order thresholds, and vendor replenishment.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/inventory/adjustments"
            prefetch={false}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-xs"
          >
            Stock Adjustments
          </Link>
          <button className="px-4 py-2 bg-[#004e89] hover:bg-[#003d6c] text-white font-bold rounded-lg text-xs transition shadow-xs flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Add Stock Item</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Low Stock Alert Alert Card */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-300">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm block">⚠️ Low Stock Alert ({lowStockCount} items below threshold)</span>
              <span className="text-[11px] text-amber-800 dark:text-amber-400">Some critical spare parts have reached re-order points and require vendor replenishment.</span>
            </div>
          </div>

          <button 
            onClick={() => setStatusFilter('Low Stock')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-xs whitespace-nowrap self-start sm:self-auto"
          >
            View Low Stock Items ({lowStockCount})
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          {(['All', 'Low Stock', 'In Stock'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                statusFilter === status 
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {status} {status === 'Low Stock' && lowStockCount > 0 ? `(${lowStockCount})` : ''}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search by part name, SKU, brand..." 
              aria-label="Filter inventory stock"
              className="w-64 py-2 px-3 pl-9 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-1 focus:ring-[#004e89]" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Part / Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4 text-center">Current Stock</th>
                <th className="py-3 px-4 text-center">Re-order Point</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredItems.map(item => {
                const isLowStock = item.currentStock <= item.reorderPoint;
                return (
                  <tr key={item.id} className={`hover:bg-slate-50/70 dark:hover:bg-slate-700/40 transition-colors ${isLowStock ? 'bg-amber-50/30 dark:bg-amber-950/10' : ''}`}>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">{item.sku}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{item.name}</td>
                    <td className="py-3.5 px-4 text-slate-500">{item.category}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">{item.brand}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900 dark:text-white">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                      {item.reorderPoint} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isLowStock ? (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Low Stock ({item.currentStock} left)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-full text-[10px] font-bold">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ৳ {item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {isLowStock ? (
                        <button 
                          onClick={() => handleReorder(item)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs inline-flex items-center gap-1.5"
                          title="1-Click Vendor Purchase Order Re-order"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>🛒 Re-order Now</span>
                        </button>
                      ) : (
                        <button className="px-2.5 py-1 text-slate-500 hover:text-slate-800 font-semibold text-xs">
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading inventory stock...</div>}>
      <InventoryContent />
    </Suspense>
  );
}
