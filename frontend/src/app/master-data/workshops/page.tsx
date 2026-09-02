"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../../utils/api';

interface Workshop {
  id: string | number;
  workshop_name?: string;
  name?: string;
  city: string;
  state: string;
  zip_code?: string;
  zip?: string;
  country: string;
  status: string;
  created_at?: string;
  createdAt?: string;
}

const DEFAULT_WORKSHOPS: Workshop[] = [
  {
    id: 'ws-001',
    name: 'Mamun Automobiles - Main Branch',
    city: 'Uttara, Dhaka',
    state: '',
    country: 'Bangladesh',
    status: 'Active',
    createdAt: '2026-07-21'
  }
];

export default function WorkshopsListPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Active');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchWorkshops = async () => {
    setIsLoading(true);
    try {
      let apiData: Workshop[] = [];
      try {
        const endpoint = searchTerm ? `/api/api_master_data.php?action=get_workshops&search=${encodeURIComponent(searchTerm)}` : '/api/api_master_data.php?action=get_workshops';
        const data = await fetchApi(endpoint);
        if (data && data.success && Array.isArray(data.data)) {
          apiData = data.data;
        } else if (Array.isArray(data)) {
          apiData = data;
        }
      } catch (err) {
        console.warn('API error, falling back to local storage:', err);
      }

      // Read from local storage
      const localDataRaw = localStorage.getItem('master_workshops');
      const localData: Workshop[] = localDataRaw ? JSON.parse(localDataRaw) : [];

      // Combine both or use fallback if both are empty
      let combined = [...(Array.isArray(localData) ? localData : []), ...(Array.isArray(apiData) ? apiData : [])];
      if (combined.length === 0) {
        combined = DEFAULT_WORKSHOPS;
        // Optionally seed local storage so it persists
        localStorage.setItem('master_workshops', JSON.stringify(DEFAULT_WORKSHOPS));
      }

      setWorkshops(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, [searchTerm]);

  const filteredWorkshops = (Array.isArray(workshops) ? workshops : []).filter(w => {
    const matchTab = w.status === activeTab || (activeTab === 'Trash' && w.status === 'Trash');
    const wName = (w.name || w.workshop_name || '').toLowerCase();
    const wCity = (w.city || '').toLowerCase();
    const matchSearch = wName.includes(searchTerm.toLowerCase()) || wCity.includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabs = ['Active', 'Inactive', 'Trash'];

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workshops</h1>
          <p className="text-sm text-slate-500 font-normal mt-1">Manage workshop branches and locations.</p>
        </div>
        <Link prefetch={false} href="/master-data/workshops/add"
          className="bg-[#004e89] hover:bg-[#003d6c] text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Workshop
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
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search workshops..."
              className="w-64 py-2 px-3 pl-9 text-sm rounded-lg border border-slate-200 focus:border-[#004e89] outline-none bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') fetchWorkshops(); }}
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
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Workshop Name</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">City/State</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Country</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Status</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Created At</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="py-12 px-4 text-center text-sm text-slate-400">Loading...</td></tr>
            ) : filteredWorkshops.length === 0 ? (
              <tr><td colSpan={7} className="py-12 px-4 text-center text-sm text-slate-400">No workshops found matching your criteria.</td></tr>
            ) : (
              filteredWorkshops.map((ws) => (
                <tr key={ws.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 border-b border-slate-100 whitespace-nowrap"><input type="checkbox" className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500" /></td>
                  <td className="py-3 px-4 text-sm text-slate-800 font-medium border-b border-slate-100 whitespace-nowrap">{ws.name || ws.workshop_name}</td>
                  <td className="py-3 px-4 text-sm text-slate-500 border-b border-slate-100 whitespace-nowrap">{ws.city || '-'}{ws.state ? `, ${ws.state}` : ''}</td>
                  <td className="py-3 px-4 text-sm text-slate-500 border-b border-slate-100 whitespace-nowrap">{ws.country || '-'}</td>
                  <td className="py-3 px-4 border-b border-slate-100 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ws.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {ws.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500 border-b border-slate-100 whitespace-nowrap">{new Date(ws.createdAt || ws.created_at || new Date()).toLocaleDateString()}</td>
                  <td className="py-3 px-4 border-b border-slate-100 whitespace-nowrap text-right space-x-2">
                    <button className="text-slate-400 hover:text-[#004e89] transition-colors" title="View">
                      <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    <button className="text-slate-400 hover:text-emerald-600 transition-colors" title="Edit">
                      <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button className="text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                      <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
        <div className="text-sm text-slate-500">Showing {filteredWorkshops.length} entries</div>
        <div className="flex space-x-1">
          <button className="px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-50 rounded-md disabled:opacity-40" disabled>Previous</button>
          <button className="px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-50 rounded-md disabled:opacity-40" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
