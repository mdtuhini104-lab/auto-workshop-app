"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../../utils/api';
import AiInput from '@/components/ui/AiInput';

interface Item {
  id: number;
  item_code: string;
  item_name: string;
  description: string;
  unit?: string;
  unit_id?: string;
  purchase_price: number;
  selling_price: number;
  status: string;
  created_at: string;
}

export default function ItemsListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadItems() {
      setIsLoading(true);
      try {
        const data = await fetchApi('/api/api_master_data.php?action=get_items');
        if (isMounted) {
          if (data && data.success && Array.isArray(data.data)) {
            setItems(data.data);
          } else if (Array.isArray(data)) {
            setItems(data);
          } else {
            setItems([]);
          }
        }
      } catch (err) {
        console.warn('Failed to load items', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadItems();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = (Array.isArray(items) ? items : []).filter(i => {
    const matchTab = activeTab === 'All' || i.status === activeTab;
    const matchSearch = (i.item_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (i.item_code || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabs = ['All', 'Active', 'Inactive', 'Trash'];

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Items</h1>
          <p className="text-sm text-slate-500 font-normal mt-1">Manage inventory products and components.</p>
        </div>
        <Link prefetch={false} href="/master-data/items/add"
          className="bg-[#004e89] hover:bg-[#003d6c] text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Item
        </Link>
      </div>

      {/* Toolbar: Tabs + Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === tab ? 'font-semibold text-slate-900 bg-slate-100' : 'font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              {tab === 'All' ? 'All Items' : tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-72">
            <AiInput
              placeholder="Search items with AI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="py-2 px-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
            Bulk Actions
          </button>
        </div>
      </div>

      {/* Seamless Flat Table */}
      <div className="overflow-x-auto pb-4 flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap w-10"><input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500" /></th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Code</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Item Name</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Unit</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Purchase Price</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Selling Price</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Status</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} className="py-12 px-4 text-center text-sm text-slate-400">Loading...</td></tr>
            ) : filteredItems.length === 0 ? (
              <tr><td colSpan={8} className="py-12 px-4 text-center text-sm text-slate-400">No items found matching your criteria.</td></tr>
            ) : (
              filteredItems.map((itm) => (
                <tr key={itm.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-800 border-b border-slate-100 whitespace-nowrap"><input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500" /></td>
                  <td className="py-3 px-4 text-sm text-slate-500 border-b border-slate-100 whitespace-nowrap">{itm.item_code || '-'}</td>
                  <td className="py-3 px-4 text-sm text-slate-800 font-medium border-b border-slate-100 whitespace-nowrap">{itm.item_name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 border-b border-slate-100 whitespace-nowrap font-mono">{itm.unit_id || (itm as any).unit || 'Pcs'}</td>
                  <td className="py-3 px-4 text-sm text-slate-800 border-b border-slate-100 whitespace-nowrap">৳ {itm.purchase_price != null ? Number(itm.purchase_price).toFixed(2) : '0.00'}</td>
                  <td className="py-3 px-4 text-sm text-slate-800 font-semibold border-b border-slate-100 whitespace-nowrap">৳ {itm.selling_price != null ? Number(itm.selling_price).toFixed(2) : '0.00'}</td>
                  <td className="py-3 px-4 border-b border-slate-100 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${itm.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {itm.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-slate-100 whitespace-nowrap text-right space-x-2">
                    <button className="text-slate-400 hover:text-[#004e89] transition-colors" title="View">
                      <svg className="w-4.5 h-4.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    <button className="text-slate-400 hover:text-emerald-600 transition-colors" title="Edit">
                      <svg className="w-4.5 h-4.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button className="text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                      <svg className="w-4.5 h-4.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="text-sm text-slate-500">Showing {filteredItems.length} entries</div>
        <div className="flex space-x-1">
          <button className="px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-50 rounded-md disabled:opacity-40" disabled>Previous</button>
          <button className="px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-50 rounded-md disabled:opacity-40" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
