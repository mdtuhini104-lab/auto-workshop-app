"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '../../../../utils/api';

export default function JobCardEditPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    job_card_id: jobId,
    mechanic_id: '',
    status: 'In Progress',
    items: [] as { item_id: string, name: string, quantity: number, mechanic_id: string }[]
  });

  // Mock mechanics & items for the dropdowns
  const mockMechanics = [
    { id: '1', name: 'Admin User' },
    { id: '2', name: 'Sagor' },
    { id: '3', name: 'Samim' }
  ];

  useEffect(() => {
    setTimeout(() => {
      setFormData({
        job_card_id: jobId,
        mechanic_id: '1',
        status: 'In Progress',
        items: [
          { item_id: '101', name: 'Engine Oil 5W-30', quantity: 1, mechanic_id: '1' },
          { item_id: '102', name: 'Oil Filter', quantity: 1, mechanic_id: '2' }
        ]
      });
      setIsLoading(false);
    }, 500);
  }, [jobId]);

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, items: updated };
    });
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { item_id: '', name: '', quantity: 1, mechanic_id: prev.mechanic_id }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost/auto-workshop-app/backend/api/api_core_workflow.php?action=update_job_card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          mechanic_id: formData.mechanic_id ? parseInt(formData.mechanic_id) : null,
          items: formData.items.map(i => ({
            ...i,
            item_id: i.item_id ? parseInt(i.item_id) : null,
            quantity: typeof i.quantity === 'string' ? parseFloat(i.quantity) : i.quantity,
            mechanic_id: i.mechanic_id ? parseInt(i.mechanic_id) : null
          }))
        })
      });
      
      const data = await res.json();
      if (data.success) {
        router.push('/workshop/job-cards');
      } else {
        setError(data.error || 'Failed to update Job Card');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading Job Card details...</div>;
  }

  return (
    <div className="p-6 h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-y-auto relative font-sans">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <Link href="/workshop/job-cards" prefetch={false} className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors mb-2 font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Workshop &gt; Job Cards
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            Edit Job Card #{jobId}
            <span className="bg-red-100 text-red-700 border border-red-200 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide shadow-sm flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Live Mode
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Actively service vehicle, adjust parts and reassign mechanics dynamically.</p>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto space-y-6 pb-24">
        {error && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm">{error}</div>}

        <form id="job-card-form" onSubmit={handleSubmit} className="space-y-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-8">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-5 uppercase tracking-wider">Job Card Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1">Lead Mechanic</label>
                <select 
                  className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  value={formData.mechanic_id}
                  onChange={(e) => setFormData({...formData, mechanic_id: e.target.value})}
                >
                  <option value="">Select Mechanic...</option>
                  {mockMechanics.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1">Status</label>
                <select 
                  className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span className="text-green-500 font-bold">•</span> Required Spare Parts & Services (Editable)
              </h2>
              <button 
                type="button" 
                onClick={handleAddItem}
                className="text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-12 gap-4 px-1 pb-2 border-b border-gray-100 dark:border-gray-700">
                 <div className="col-span-4 text-xs font-semibold text-slate-900 dark:text-slate-100">Part / Item Name *</div>
                 <div className="col-span-3 text-xs font-semibold text-slate-900 dark:text-slate-100">Assigned Mechanic</div>
                 <div className="col-span-2 text-xs font-semibold text-slate-900 dark:text-slate-100">Qty</div>
                 <div className="col-span-2 text-xs font-semibold text-slate-900 dark:text-slate-100">Unit</div>
                 <div className="col-span-1"></div>
              </div>
              {formData.items.map((item: any, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50 dark:bg-gray-800/50 p-3 md:p-0 rounded-lg md:rounded-none md:bg-transparent border border-gray-200 md:border-transparent dark:border-gray-700">
                  <div className="md:col-span-4">
                    <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Part / Item Name *</label>
                    <input 
                      type="text"
                      className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      value={item.item_id}
                      placeholder="Select / Enter Part ID"
                      onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Assigned Mechanic</label>
                    <select 
                      className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      value={item.mechanic_id}
                      onChange={(e) => handleItemChange(index, 'mechanic_id', e.target.value)}
                    >
                      <option value="">No specific mechanic</option>
                      {mockMechanics.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <div className="flex-1">
                      <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Qty</label>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 border-l-4 border-l-blue-500 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Unit</label>
                    <input 
                      type="text" 
                      name="unit"
                      list="common-units"
                      placeholder="e.g. Ltr, Pcs, Set"
                      className="block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                      value={item.unit || ''}
                      onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-1 text-right">
                     <button 
                        type="button" 
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-400 hover:text-red-600 p-2 border border-red-100 rounded-md hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                  </div>
                </div>
              ))}
              {formData.items.length === 0 && (
                <div className="text-center p-4 text-gray-500 text-sm border-t border-gray-100">No parts required currently.</div>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-sm z-40 lg:ml-[250px]">
        <div className="max-w-6xl mx-auto flex justify-end gap-4 items-center">
          <span className="text-sm text-gray-500 mr-auto">Any stock changes will be reconciled instantly upon saving.</span>
          <Link prefetch={false} href="/workshop/job-cards"
            className="px-6 py-2.5 rounded-md text-slate-900 dark:text-slate-100 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-transparent"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            form="job-card-form"
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50 shadow-md flex items-center gap-2"
          >
            {isSubmitting ? 'Updating...' : 'Commit Live Updates'}
          </button>
        </div>
      </div>
    </div>
  );
}
