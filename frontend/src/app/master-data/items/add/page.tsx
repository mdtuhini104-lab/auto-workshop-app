"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../../utils/api';
import AiInput from '@/components/ui/AiInput';

export default function AddItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    unit_id: '',
    purchase_price: '0',
    selling_price: '0',
    categories: '',
    status: 'Active'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const result = await fetchApi('/api/api_master_data.php?action=save_item', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      if (result.success) {
        router.push('/master-data/items');
      } else {
        alert(result.error || 'Failed to save item');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Create Item</h1>
        <Link prefetch={false} href="/master-data/items" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium text-sm">
          Cancel
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Left Form Component (Span 2) */}
        <div className="col-span-1 lg:col-span-2 space-y-3.5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add New Item</h2>
            <p className="text-xs text-slate-500 mb-3">Enter item details to create a new item</p>
          </div>

          <form id="itemForm" onSubmit={handleSubmit} className="space-y-3.5">
            <div className="w-full">
              <AiInput
                label="Item Name *"
                required
                placeholder="e.g., Engine Oil (Auto-suggests spelling)"
                value={formData.item_name}
                onChange={e => setFormData({...formData, item_name: e.target.value})}
              />
            </div>
            
            <div className="w-full">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea 
                rows={3}
                placeholder="Brief description of the item..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 resize-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="w-full">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit *</label>
                <input 
                  type="text"
                  name="unit"
                  list="common-units"
                  placeholder="e.g. Ltr, Pcs, Set, Can"
                  required
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                  value={formData.unit_id}
                  onChange={e => setFormData({...formData, unit_id: e.target.value})}
                />
                <datalist id="common-units">
                  <option value="Pcs" />
                  <option value="Ltr" />
                  <option value="Set" />
                  <option value="Can" />
                  <option value="Box" />
                  <option value="Kg" />
                  <option value="Meter" />
                  <option value="Job" />
                  <option value="Hr" />
                  <option value="পিস" />
                  <option value="লিটার" />
                  <option value="সেট" />
                </datalist>
              </div>
              <div className="w-full">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Purchase Price</label>
                <input 
                  type="text"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                  value={formData.purchase_price}
                  onChange={e => setFormData({...formData, purchase_price: e.target.value})}
                />
              </div>
              <div className="w-full">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Selling Price</label>
                <input 
                  type="text"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                  value={formData.selling_price}
                  onChange={e => setFormData({...formData, selling_price: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="w-full">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Categories (Optional)</label>
                <select 
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={formData.categories}
                  onChange={e => setFormData({...formData, categories: e.target.value})}
                >
                  <option value="">Select Category...</option>
                  <option value="Engine Parts">Engine Parts</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div className="w-full">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select 
                  required
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-start space-x-3 pt-4">
              <button 
                type="submit" 
                form="itemForm"
                disabled={isSaving}
                className="bg-[#004e89] hover:bg-[#003d6c] text-white font-medium py-2 px-4 rounded-lg text-sm transition-all shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Create Item'}
              </button>
              <Link prefetch={false} href="/master-data/items"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Right Image Component (Span 1) */}
        <div className="col-span-1 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 pt-5 lg:pt-0 lg:pl-5 space-y-3.5">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Gallery</h3>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">0 / 10</span>
          </div>

          <div className="border-dashed border-2 border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors h-48">
            <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Click or drag images</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center space-y-3 border border-blue-100 dark:border-blue-900/30">
            <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">No images uploaded yet</p>
            <button className="bg-white dark:bg-gray-800 text-[#004e89] dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors shadow-sm w-full text-sm">
              Upload Images
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
