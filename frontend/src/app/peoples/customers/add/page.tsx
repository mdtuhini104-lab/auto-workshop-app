"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchApi } from "../../../../utils/api";

export default function AddCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    status: 'Active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setError('Name and Phone are required fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const data = await fetchApi('/api/api_customers.php?action=save_customer', {
        method: 'POST',
        data: formData
      });
      
      if (data.success) {
        router.push('/peoples/customers');
      } else {
        setError(data.error || 'Failed to save customer');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-y-auto font-sans">
      
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link prefetch={false} href="/peoples/customers" className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors mb-2 font-medium">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Customers &gt; Add
        </Link>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        
        {error && <div className="p-3 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm">{error}</div>}

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-8">
          
          <div className="mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Add New Customer</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enter customer details to create a new customer</p>
          </div>

          <form id="add-customer-form" onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
            
            {/* Left Column: Form Fields */}
            <div className="flex-1 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5 uppercase tracking-wider">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="John Doe"
                    className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5 uppercase tracking-wider">
                    Email (optional)
                  </label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5 uppercase tracking-wider">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="+1 234 567 8900"
                    className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5 uppercase tracking-wider">
                    Company (optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Customer Name"
                    className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    value={formData.company} 
                    onChange={e => setFormData({...formData, company: e.target.value})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5 uppercase tracking-wider">
                  Address (optional)
                </label>
                <textarea 
                  rows={3} 
                  placeholder="Street address"
                  className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none" 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5 uppercase tracking-wider">
                    City (optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="City"
                    className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5 uppercase tracking-wider">
                    State (optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="State"
                    className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    value={formData.state} 
                    onChange={e => setFormData({...formData, state: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5 uppercase tracking-wider">
                    ZIP Code (optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="ZIP"
                    className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    value={formData.zip} 
                    onChange={e => setFormData({...formData, zip: e.target.value})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5 uppercase tracking-wider">
                    Country (optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="Country"
                    className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    value={formData.country} 
                    onChange={e => setFormData({...formData, country: e.target.value})} 
                  />
                </div>
                <div className="hidden md:block"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5 uppercase tracking-wider">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select 
                    className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-6 flex justify-end gap-4 border-t border-gray-100 dark:border-gray-700">
                <Link prefetch={false} href="/peoples/customers">
                  <button type="button" className="px-6 py-2.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors bg-white border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                    Cancel
                  </button>
                </Link>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-md bg-[#004e89] hover:bg-blue-800 text-white text-base font-medium transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? 'Saving...' : 'Save Customer'}
                </button>
              </div>

            </div>
            
            {/* Right Column: Photo */}
            <div className="w-full lg:w-72 flex flex-col flex-shrink-0">
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5 uppercase tracking-wider">
                Customer Photo (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center p-8 h-64 mb-4 bg-gray-50 dark:bg-gray-800 transition-colors">
                <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">No media</span>
              </div>
              <button 
                type="button" 
                className="w-full bg-[#004e89] hover:bg-blue-800 text-white py-2.5 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Select from Media
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
