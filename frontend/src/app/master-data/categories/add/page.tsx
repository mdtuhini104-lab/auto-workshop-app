"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../../utils/api';

export default function AddCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category_name: '',
    description: '',
    status: 'Active'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const result = await fetchApi('/api/api_master_data.php?action=save_category', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      if (result.success) {
        router.push('/master-data/categories');
      } else {
        alert(result.error || 'Failed to save category');
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
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Create Category</h1>
        <Link prefetch={false} href="/master-data/categories" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium text-sm">
          Cancel
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Left Form Pane (Span 2) */}
        <div className="col-span-1 lg:col-span-2 space-y-3.5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add New Category</h2>
            <p className="text-xs text-slate-500 mb-3">Enter category details to create a new category</p>
          </div>

          <form id="categoryForm" onSubmit={handleSubmit} className="space-y-3.5">
            <div className="w-full">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category Name *</label>
              <input 
                required
                type="text"
                placeholder="e.g., Furniture, Flooring, Paint"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                value={formData.category_name}
                onChange={e => setFormData({...formData, category_name: e.target.value})}
              />
            </div>
            
            <div className="w-full">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
              <textarea 
                rows={4}
                placeholder="Category description..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 resize-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div className="w-full">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select 
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-start space-x-3 pt-4">
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-[#004e89] hover:bg-[#003d6c] text-white font-medium py-2 px-4 rounded-lg text-sm transition-all shadow-sm disabled:opacity-50"
              >
                Create Category
              </button>
              <Link prefetch={false} href="/master-data/categories"
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Right Info Pane (Span 1) */}
        <div className="col-span-1 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 pt-5 lg:pt-0 lg:pl-5 space-y-3.5 flex flex-col items-center justify-center">
            
            <div className="w-full max-w-[240px]">
              <label className="block text-xs font-semibold text-center text-slate-700 dark:text-slate-300 mb-2">Category Photo</label>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900/50 mb-3 h-40 w-full">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span className="text-xs text-gray-500">No media</span>
              </div>
              
              <button type="button" className="w-full bg-[#004e89] hover:bg-[#003d6c] text-white py-2 px-4 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center justify-center">
                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                 Select Media
              </button>
            </div>

        </div>

      </div>
    </div>
  );
}
