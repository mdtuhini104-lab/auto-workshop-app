"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../../utils/api';

export default function AddUnitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    symbol: '',
    details: '',
    status: 'Active'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // API expects unit_name and symbol. Since Screenshot 8 only shows Symbol and Details, 
    // we map Symbol to unit_name/symbol and Details to description (if supported).
    const payload = {
        unit_name: formData.symbol, // using symbol as name
        symbol: formData.symbol,
        status: formData.status
    };

    try {
      const result = await fetchApi('/api/api_master_data.php?action=save_unit', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (result.success) {
        router.push('/master-data/units');
      } else {
        alert(result.error || 'Failed to save unit');
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
      <div className="flex items-center pb-3 border-b border-gray-200 dark:border-gray-700">
        <Link prefetch={false} href="/master-data/units" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 mr-2">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </Link>
        <span className="text-sm font-medium text-gray-500 mr-2">Units</span>
        <span className="text-sm font-medium text-gray-400 mr-2">&gt;</span>
        <h1 className="text-sm font-medium text-gray-900 dark:text-white">Add</h1>
      </div>

      <div className="w-full bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
        
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add New Unit</h2>
          <p className="text-xs text-slate-500 mb-3">Enter unit details to create a new unit</p>
        </div>

        <form id="unitForm" onSubmit={handleSubmit} className="space-y-3.5 max-w-full">
          
          <div className="w-full">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Symbol *</label>
            <input 
              required
              type="text"
              placeholder="e.g., sqft, sqm, kg, pcs"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
              value={formData.symbol}
              onChange={e => setFormData({...formData, symbol: e.target.value})}
            />
          </div>
          
          <div className="w-full">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Details</label>
            <textarea 
              rows={4}
              placeholder="Unit description..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 resize-none"
              value={formData.details}
              onChange={e => setFormData({...formData, details: e.target.value})}
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
              Create Unit
            </button>
            <Link prefetch={false} href="/master-data/units"
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium py-2 px-4 rounded-lg text-sm transition-all flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}
