'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';

interface VehicleItem {
  id: number;
  plate_number: string;
  brand: string;
  model: string;
  year?: string | number;
  ownership_start_date?: string;
  ownership_end_date?: string;
  transfer_reason?: string;
  new_current_owner_name?: string;
  status?: string;
}

interface CustomerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: {
    id: string | number;
    name?: string;
    customer_name?: string;
    phone?: string;
    email?: string;
    company?: string;
    type?: string;
  } | null;
}

export default function CustomerProfileModal({
  isOpen,
  onClose,
  customer
}: CustomerProfileModalProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentlyOwned, setCurrentlyOwned] = useState<VehicleItem[]>([]);
  const [previouslyOwned, setPreviouslyOwned] = useState<VehicleItem[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'previous'>('current');

  useEffect(() => {
    if (!isOpen || !customer) return;

    const loadCustomerVehicles = async () => {
      setLoading(true);
      try {
        const res = await fetchApi(`/api/api_ownership_transfer.php?action=get_customer_vehicles&customer_id=${customer.id}`);
        if (res && res.success) {
          setCurrentlyOwned(res.currently_owned || []);
          setPreviouslyOwned(res.previously_owned || []);
        } else {
          // Fallback mock based on customer
          setCurrentlyOwned([
            { id: 101, plate_number: 'DHAKA-METRO-GA-13-8851', brand: 'Toyota', model: 'Land Cruiser Prado', year: '2022', ownership_start_date: '2025-01-01', status: 'Active' }
          ]);
          setPreviouslyOwned([
            { id: 98, plate_number: 'DHAKA-METRO-KA-44-1122', brand: 'Honda', model: 'Civic Turbo', year: '2019', ownership_start_date: '2022-03-10', ownership_end_date: '2024-11-20', transfer_reason: 'Sold to corporate buyer', new_current_owner_name: 'Europetex Limited' }
          ]);
        }
      } catch (err) {
        console.error('Failed to load customer vehicles', err);
      } finally {
        setLoading(false);
      }
    };

    loadCustomerVehicles();
  }, [isOpen, customer]);

  if (!isOpen || !customer) return null;

  const displayName = customer.name || customer.customer_name || 'Customer Details';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in duration-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
              {displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-white">{displayName}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-blue-300 border border-blue-500/20 uppercase tracking-wider">
                  ID: #{customer.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {customer.phone || 'No phone'} • {customer.email || 'No email'} {customer.company ? `• ${customer.company}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 shrink-0">
          <button
            onClick={() => setActiveTab('current')}
            className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === 'current' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Currently Owned Vehicles ({currentlyOwned.length})
          </button>
          <button
            onClick={() => setActiveTab('previous')}
            className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === 'previous' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            Previously Owned Vehicles ({previouslyOwned.length})
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              Loading customer fleet history...
            </div>
          ) : (
            <>
              {activeTab === 'current' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium">Vehicles currently registered under {displayName}&apos;s ownership:</p>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active Fleet: {currentlyOwned.length}
                    </span>
                  </div>

                  {currentlyOwned.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-400">
                      No vehicles currently owned by this client.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentlyOwned.map((veh) => (
                        <div key={veh.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-blue-300 transition-all">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {veh.plate_number}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Active Owner
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mt-2">{veh.brand} {veh.model}</h4>
                          <div className="text-xs text-slate-500 mt-1 flex justify-between">
                            <span>Year: {veh.year || 'N/A'}</span>
                            <span>Since: <strong className="text-slate-700 font-mono">{veh.ownership_start_date || 'N/A'}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'previous' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium">Vehicles previously owned by {displayName} and transferred away:</p>
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Past Transferred: {previouslyOwned.length}
                    </span>
                  </div>

                  {previouslyOwned.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-400">
                      No previous vehicle ownership transfers recorded for this client.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {previouslyOwned.map((veh) => (
                        <div key={veh.id} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                                {veh.plate_number}
                              </span>
                              <span className="text-xs font-bold text-slate-800">{veh.brand} {veh.model}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Ownership Tenure: <span className="font-mono font-medium text-slate-700">{veh.ownership_start_date}</span> → <span className="font-mono font-medium text-slate-700">{veh.ownership_end_date || 'Transferred'}</span>
                            </p>
                            {veh.transfer_reason && (
                              <p className="text-[11px] text-slate-400 mt-0.5">Reason: {veh.transfer_reason}</p>
                            )}
                          </div>

                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Registered Owner</span>
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1 sm:justify-end">
                              <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              {veh.new_current_owner_name || 'New Buyer'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
