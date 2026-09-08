'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';

interface TimelineItem {
  id: number;
  vehicle_id: number;
  customer_id: number;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  ownership_start_date: string;
  ownership_end_date?: string | null;
  ownership_status: 'Active' | 'Previous';
  transfer_reason?: string;
  transfer_reference?: string;
  notes?: string;
  transferred_by_user?: string;
}

interface ServiceHistoryItem {
  service_type: string;
  reference_no: string;
  service_date: string;
  amount: number | string;
  status: string;
  customer_id?: number;
  owner_name?: string;
}

interface VehicleProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: number | null;
  onOpenTransferModal: () => void;
}

export default function VehicleProfileModal({
  isOpen,
  onClose,
  vehicleId,
  onOpenTransferModal
}: VehicleProfileModalProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [vehicle, setVehicle] = useState<any>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'services'>('overview');

  useEffect(() => {
    if (!isOpen || !vehicleId) return;

    const loadVehicleProfile = async () => {
      setLoading(true);
      try {
        const res = await fetchApi(`/api/api_ownership_transfer.php?action=get_vehicle_ownership_history&vehicle_id=${vehicleId}`);
        if (res && res.success) {
          setVehicle(res.vehicle);
          setTimeline(res.timeline || []);
          setServiceHistory(res.service_history || []);
        }
      } catch (err) {
        console.error('Failed to load vehicle history', err);
      } finally {
        setLoading(false);
      }
    };

    loadVehicleProfile();
  }, [isOpen, vehicleId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-black tracking-tight">{vehicle?.plate_number || 'Loading...'}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${vehicle?.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-300'}`}>
                    {vehicle?.status || 'Active'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {vehicle?.brand} {vehicle?.model} {vehicle?.year ? `(${vehicle?.year})` : ''} • VIN / Chassis: {vehicle?.chassis_number || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={onOpenTransferModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Transfer Ownership
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex gap-2 mt-6 border-b border-slate-700/60 pb-px text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${activeTab === 'overview' ? 'text-blue-400 border-blue-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
            >
              Section 1 & 2: Specs & Active Owner
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${activeTab === 'timeline' ? 'text-blue-400 border-blue-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
            >
              Section 3: Ownership Timeline ({timeline.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`pb-2.5 px-3 font-semibold transition-colors border-b-2 ${activeTab === 'services' ? 'text-blue-400 border-blue-400' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
            >
              Section 4: Service History ({serviceHistory.length})
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Loading vehicle profile & ownership logs...
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW (SPECS & CURRENT ACTIVE OWNER) */}
              {(activeTab === 'overview' || activeTab === 'timeline') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Section 1: Vehicle Specs */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Section 1: Vehicle Specifications</h3>
                      <span className="text-[11px] font-mono text-slate-400">ID: #{vehicle?.id}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Make & Model</span>
                        <span className="text-slate-900 font-bold">{vehicle?.brand} {vehicle?.model}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Model Year</span>
                        <span className="text-slate-900 font-bold">{vehicle?.year || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Engine Number</span>
                        <span className="text-slate-900 font-mono font-bold">{vehicle?.engine_number || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Chassis / VIN</span>
                        <span className="text-slate-900 font-mono font-bold">{vehicle?.chassis_number || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Color</span>
                        <span className="text-slate-900 font-medium">{vehicle?.color || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Registration Plate</span>
                        <span className="text-blue-700 font-mono font-bold">{vehicle?.plate_number}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Current Active Owner */}
                  <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">Section 2: Current Active Owner</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
                        Active Owner
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-slate-500 block font-medium">Owner Name</span>
                        <span className="text-slate-900 font-bold text-sm">
                          {vehicle?.current_owner_name || vehicle?.customer_name || 'No Owner Assigned'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-slate-500 block font-medium">Phone Number</span>
                          <span className="text-slate-800 font-mono font-semibold">
                            {vehicle?.current_owner_phone || vehicle?.customer_phone || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block font-medium">Email Address</span>
                          <span className="text-slate-800 font-medium truncate block">
                            {vehicle?.current_owner_email || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={onOpenTransferModal}
                          className="w-full py-2 px-3 bg-white border border-blue-300 hover:bg-blue-50 text-blue-700 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          Reassign / Transfer Ownership
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: Ownership History Timeline */}
              {(activeTab === 'timeline' || activeTab === 'overview') && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Section 3: Ownership History Timeline</h3>
                      <p className="text-xs text-slate-500">Historical date ranges and ownership tenure</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                      {timeline.length} Registered Transfers
                    </span>
                  </div>

                  {timeline.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No past ownership transfers recorded yet.
                    </div>
                  ) : (
                    <div className="relative pl-6 border-l-2 border-blue-200 space-y-6 my-2">
                      {timeline.map((t, idx) => {
                        const isActive = t.ownership_status === 'Active';
                        return (
                          <div key={t.id || idx} className="relative group">
                            {/* Marker Node */}
                            <div className={`absolute -left-[31px] top-0 w-5 h-5 rounded-full border-2 bg-white flex items-center justify-center ${isActive ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-400 bg-white text-slate-400'}`}>
                              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-slate-400'}`} />
                            </div>

                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-slate-900">{t.customer_name}</span>
                                  {isActive ? (
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                                      Current Owner
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 font-medium text-[10px] rounded-full">
                                      Previous Owner
                                    </span>
                                  )}
                                </div>
                                <span className="font-mono text-xs font-semibold text-slate-600 bg-white px-2.5 py-0.5 rounded border border-slate-200">
                                  {t.ownership_start_date} → {isActive ? 'Present' : (t.ownership_end_date || 'N/A')}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
                                <div>
                                  <span className="text-slate-400">Contact:</span> {t.customer_phone || 'N/A'}
                                </div>
                                <div>
                                  <span className="text-slate-400">Reason:</span> {t.transfer_reason || 'Registration'}
                                </div>
                                <div>
                                  <span className="text-slate-400">Ref:</span> {t.transfer_reference || 'None'}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Section 4: Chronological Service History by Owner */}
              {(activeTab === 'services' || activeTab === 'overview') && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Section 4: Chronological Service History</h3>
                      <p className="text-xs text-slate-500">Historical service records pinned to their original commissioner</p>
                    </div>
                  </div>

                  {serviceHistory.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No services or inspections recorded yet for this vehicle.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold text-[10px]">
                            <th className="py-2.5 px-3">Date</th>
                            <th className="py-2.5 px-3">Service Type</th>
                            <th className="py-2.5 px-3">Ref No</th>
                            <th className="py-2.5 px-3">Commissioned By (Owner)</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {serviceHistory.map((s, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">{s.service_date}</td>
                              <td className="py-2.5 px-3 font-semibold text-slate-800">{s.service_type}</td>
                              <td className="py-2.5 px-3 font-mono font-medium text-blue-600">{s.reference_no}</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                                  <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                  {s.owner_name || 'Historical Client'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                  {s.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                                {Number(s.amount) > 0 ? `৳${Number(s.amount).toLocaleString()}` : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
