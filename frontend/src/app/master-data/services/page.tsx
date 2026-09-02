"use client";

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../utils/api';

interface Service {
  id: number;
  service_name: string;
  service_code: string;
  core_category_type: string;
  base_labor_charge: number;
  estimated_duration: string;
  status: string;
}

export default function ServicesListPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Active');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    service_name: '',
    description: '',
    default_price: '0',
    active_status: true
  });

  const fetchServices = async (query = '') => {
    setIsLoading(true);
    try {
      const endpoint = query ? `/api/api_master_data.php?action=get_services&search=${encodeURIComponent(query)}` : '/api/api_master_data.php?action=get_services';
      const data = await fetchApi(endpoint);
      if (data.success) {
        setServices(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        service_name: formData.service_name,
        description: formData.description,
        base_labor_charge: parseFloat(formData.default_price),
        status: formData.active_status ? 'Active' : 'Inactive',
        core_category_type: '',
        estimated_duration: ''
      };

      const result = await fetchApi('/api/api_master_data.php?action=save_service', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (result.success) {
        setIsModalOpen(false);
        setFormData({ service_name: '', description: '', default_price: '0', active_status: true });
        fetchServices(searchTerm);
      } else {
        alert(result.error || 'Failed to create service');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredServices = services.filter(s => {
    const matchTab = s.status === activeTab;
    if (!matchTab) return false;
    if (!searchTerm) return true;
    const regex = new RegExp(searchTerm, 'i');
    return regex.test(s.service_name) || regex.test(s.core_category_type || '');
  });

  const tabs = ['Active', 'Inactive'];

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Services</h1>
          <p className="text-sm text-slate-500 font-normal mt-1">Manage your shop&apos;s available services and their default pricing.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#004e89] hover:bg-[#003d6c] text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Service
        </button>
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
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search services..."
              className="w-64 py-2 px-3 pl-9 text-sm rounded-lg border border-slate-200 focus:border-[#004e89] outline-none bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') fetchServices(searchTerm); }}
            />
          </div>
        </div>
      </div>

      {/* Seamless Flat Table */}
      <div className="overflow-x-auto pb-4 flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap w-10"><input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500" /></th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Code</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Service Name</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap text-right">Price</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Status</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="py-12 px-4 text-center text-sm text-slate-400">Loading services...</td></tr>
            ) : filteredServices.length === 0 ? (
              <tr><td colSpan={6} className="py-12 px-4 text-center text-sm text-slate-400">No services found matching your search.</td></tr>
            ) : (
              filteredServices.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 border-b border-slate-100 whitespace-nowrap"><input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500" /></td>
                  <td className="py-3 px-4 text-sm text-slate-500 border-b border-slate-100 whitespace-nowrap">{s.service_code || 'SRV-0000'}</td>
                  <td className="py-3 px-4 text-sm text-slate-800 font-medium border-b border-slate-100 whitespace-nowrap">{s.service_name}</td>
                  <td className="py-3 px-4 text-sm text-slate-800 border-b border-slate-100 whitespace-nowrap text-right">৳ {Number(s.base_labor_charge).toLocaleString()}</td>
                  <td className="py-3 px-4 border-b border-slate-100 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-slate-100 whitespace-nowrap text-right space-x-2">
                    <button className="text-slate-400 hover:text-[#004e89] transition-colors" title="Edit">
                      <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button className="text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                      <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg p-4">
            <div className="relative bg-white rounded-xl shadow-lg border border-slate-200">
              
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">
                  Add New Service
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                </button>
              </div>

              <form onSubmit={handleSaveService} className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Engine Oil Change"
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 bg-white focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400" 
                    value={formData.service_name}
                    onChange={(e) => setFormData({...formData, service_name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Details about the service..."
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 bg-white focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400 resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Default Price</label>
                    <input 
                      type="number" 
                      required
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 bg-white focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                      value={formData.default_price}
                      onChange={(e) => setFormData({...formData, default_price: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Active Status</label>
                    <div className="flex items-center justify-between border border-slate-200 rounded-lg p-2 bg-white">
                       <span className="text-xs text-slate-500">Enable or disable</span>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={formData.active_status} onChange={(e) => setFormData({...formData, active_status: e.target.checked})} />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#004e89]"></div>
                        </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 mt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-[#004e89] hover:bg-[#003d6c] text-white font-medium py-2 px-4 rounded-lg text-sm transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Adding...' : 'Add Service'}
                  </button>
                </div>
              </form>
              
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
