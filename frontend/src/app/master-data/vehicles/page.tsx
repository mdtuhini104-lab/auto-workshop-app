"use client";

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../utils/api';

interface Vehicle {
  id: number;
  plate_number: string;
  brand: string;
  model: string;
  year: string;
  type: string;
  status: string;
}

interface Customer {
  id: number;
  customer_name: string;
}

export default function VehiclesListPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Active');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    plate_number: '',
    brand: '',
    model: '',
    year: '',
    engine_number: '',
    chassis_number: '',
    driver_name: '',
    driver_phone: '',
    color: '',
    type: '',
    status: 'Active'
  });

  const fetchVehicles = async (query = '') => {
    setIsLoading(true);
    try {
      const endpoint = query ? `/api/api_master_data.php?action=get_vehicles&search=${encodeURIComponent(query)}` : '/api/api_master_data.php?action=get_vehicles';
      const data = await fetchApi(endpoint);
      if (data && data.success && Array.isArray(data.data)) {
        setVehicles(data.data);
      } else if (Array.isArray(data)) {
        setVehicles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await fetchApi('/api/api_customers.php?action=get_customers');
      if (data && data.success && Array.isArray(data.data)) {
        setCustomers(data.data);
      } else if (Array.isArray(data)) {
        setCustomers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchCustomers();
  }, []);

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const result = await fetchApi('/api/api_master_data.php?action=save_vehicle', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      if (result.success) {
        setIsModalOpen(false);
        setFormData({
            customer_id: '', plate_number: '', brand: '', model: '', year: '',
            engine_number: '', chassis_number: '', driver_name: '', driver_phone: '', color: '', type: '', status: 'Active'
        });
        fetchVehicles(searchTerm);
      } else {
        alert(result.error || 'Failed to save vehicle');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredVehicles = (Array.isArray(vehicles) ? vehicles : []).filter(v => {
    const matchTab = v.status === activeTab;
    if (!matchTab) return false;
    if (!searchTerm) return true;
    const regex = new RegExp(searchTerm, 'i');
    return regex.test(v.brand) || regex.test(v.model || '') || regex.test(v.plate_number || '');
  });

  const tabs = ['Active', 'Inactive'];

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vehicles</h1>
          <p className="text-sm text-slate-500 font-normal mt-1">View and manage all registered vehicles</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#004e89] hover:bg-[#003d6c] text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Register Vehicle
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
              placeholder="Search vehicles..."
              className="w-64 py-2 px-3 pl-9 text-sm rounded-lg border border-slate-200 focus:border-[#004e89] outline-none bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') fetchVehicles(searchTerm); }}
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
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Vehicle No</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Brand</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Model</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Year</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Status</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="py-12 px-4 text-center text-sm text-slate-400">Loading vehicles...</td></tr>
            ) : filteredVehicles.length === 0 ? (
              <tr><td colSpan={7} className="py-12 px-4 text-center text-sm text-slate-400">No vehicles found matching your search.</td></tr>
            ) : (
              filteredVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 border-b border-slate-100 whitespace-nowrap"><input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500" /></td>
                  <td className="py-3 px-4 text-sm text-slate-800 font-medium border-b border-slate-100 whitespace-nowrap flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    {v.plate_number}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500 border-b border-slate-100 whitespace-nowrap">{v.brand}</td>
                  <td className="py-3 px-4 text-sm text-slate-500 border-b border-slate-100 whitespace-nowrap">{v.model}</td>
                  <td className="py-3 px-4 text-sm text-slate-500 border-b border-slate-100 whitespace-nowrap">{v.year || '-'}</td>
                  <td className="py-3 px-4 border-b border-slate-100 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${v.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {v.status}
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
          <div className="relative w-full max-w-2xl p-4">
            <div className="relative bg-white rounded-xl shadow-lg border border-slate-200">
              
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">
                  Register New Vehicle
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>
                </button>
              </div>

              <form onSubmit={handleSaveVehicle} className="p-4 space-y-3">
                
                <div className="w-full relative">
                  <div className="flex justify-between items-center mb-1">
                     <label className="block text-xs font-semibold text-slate-700">Customer <span className="text-red-500">*</span></label>
                     <button type="button" className="text-xs text-[#004e89] hover:text-blue-800 font-semibold flex items-center bg-blue-50 px-2 py-1 rounded">
                       <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                       Add Customer
                     </button>
                  </div>
                  <select 
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 bg-white focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    value={formData.customer_id}
                    onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                  >
                    <option value="">Select Customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.customer_name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle / Plate Number <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="DHAKA-METRO-GA-1234"
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 bg-white focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400" 
                      value={formData.plate_number}
                      onChange={(e) => setFormData({...formData, plate_number: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Brand</label>
                    <select 
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 bg-white focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    >
                      <option value="">Select Brand</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Honda">Honda</option>
                      <option value="Nissan">Nissan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Model</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Corolla, Civic"
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 bg-white focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400" 
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
                    <input 
                      type="text" 
                      placeholder="2026"
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 bg-white focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400" 
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Engine Number (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 bg-white focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                      value={formData.engine_number}
                      onChange={(e) => setFormData({...formData, engine_number: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Chassis Number (Optional)</label>
                    <input 
                      type="text" 
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 bg-white focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                      value={formData.chassis_number}
                      onChange={(e) => setFormData({...formData, chassis_number: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Driver Name (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="Driver Name"
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 bg-white focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400" 
                      value={formData.driver_name}
                      onChange={(e) => setFormData({...formData, driver_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Driver Number (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 017XXXXXXXX"
                      className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 bg-white focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400" 
                      value={formData.driver_phone}
                      onChange={(e) => setFormData({...formData, driver_phone: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Color</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Silver, Black"
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-sm text-slate-900 bg-white focus:border-[#004e89] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400" 
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
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
                    {isSaving ? 'Registering...' : 'Register Vehicle'}
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
