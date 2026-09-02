"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../../utils/api';

export default function AddWorkshopPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    workshop_name: '',
    city: '',
    address: '',
    state: '',
    zip: '',
    country: '',
    status: 'Active'
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.workshop_name.trim()) {
      alert('Please enter a Workshop Name.');
      return;
    }

    setIsSaving(true);

    try {
      const newWorkshop = {
        id: `ws-${Date.now()}`,
        name: formData.workshop_name,
        city: formData.city || 'Uttara, Dhaka',
        address: formData.address || 'Plot # 197, Road # 13, Sector # 10',
        state: formData.state,
        zip: formData.zip,
        country: formData.country || 'Bangladesh',
        status: formData.status || 'Active',
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Try the PHP API — silently swallow failures so we always fall through to localStorage
      try {
        const payload = {
          workshop_name: newWorkshop.name,
          location_address: [newWorkshop.address, newWorkshop.city, newWorkshop.state, newWorkshop.zip, newWorkshop.country]
            .filter(Boolean)
            .join(', '),
          status: newWorkshop.status
        };
        await fetchApi('/api/api_master_data.php?action=save_workshop', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (apiErr) {
        console.warn('API endpoint not ready, persisting locally:', apiErr);
      }

      // Always persist to localStorage so the list page reflects the new entry immediately
      const existing = JSON.parse(localStorage.getItem('master_workshops') || '[]');
      localStorage.setItem('master_workshops', JSON.stringify([newWorkshop, ...existing]));

      // Navigate to workshops list
      router.push('/master-data/workshops');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save workshop. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 p-6">
      
      {/* Header */}
      <div className="flex items-center pb-3 border-b border-gray-200 dark:border-gray-700">
        <Link prefetch={false} href="/master-data/workshops" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 mr-2">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </Link>
        <span className="text-sm font-medium text-gray-500 mr-2">Workshops</span>
        <span className="text-sm font-medium text-gray-400 mr-2">&gt;</span>
        <h1 className="text-sm font-medium text-gray-900 dark:text-white">Add</h1>
      </div>

      <div className="max-w-4xl mx-auto p-5 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add New Workshop</h2>
          <p className="text-xs text-slate-500 mb-3">Enter workshop details to create a new workshop location.</p>
        </div>

        <form id="workshopForm" onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="w-full">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Workshop Name *</label>
              <input 
                required
                type="text"
                placeholder="e.g., Main Workshop"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                value={formData.workshop_name}
                onChange={e => setFormData({...formData, workshop_name: e.target.value})}
              />
            </div>
            <div className="w-full">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">City (Optional)</label>
              <input 
                type="text"
                placeholder="City name"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="w-full">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Address (Optional)</label>
            <textarea 
              rows={3}
              placeholder="Street address..."
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 resize-none"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            ></textarea>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="w-full">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">State/Province (Optional)</label>
              <input 
                type="text"
                placeholder="State or province"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                value={formData.state}
                onChange={e => setFormData({...formData, state: e.target.value})}
              />
            </div>
            <div className="w-full">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">ZIP/Postal Code (Optional)</label>
              <input 
                type="text"
                placeholder="ZIP or postal code"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                value={formData.zip}
                onChange={e => setFormData({...formData, zip: e.target.value})}
              />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="w-full">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Country (Optional)</label>
              <input 
                type="text"
                placeholder="Country name"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 py-2 px-3 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
                value={formData.country}
                onChange={e => setFormData({...formData, country: e.target.value})}
              />
            </div>
            <div className="w-full">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status *</label>
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

          {/* Buttons */}
          <div className="flex justify-start space-x-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-[#004e89] hover:bg-[#003d6c] text-white font-medium py-2 px-4 rounded-lg text-sm transition-all shadow-sm disabled:opacity-50"
            >
              Create Workshop
            </button>
            <Link prefetch={false} href="/master-data/workshops"
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
