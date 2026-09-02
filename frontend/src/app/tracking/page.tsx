'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';

interface VehicleStatus {
  id: string;
  vehicleNo: string;
  model: string;
  customerName: string;
  stage: 'Inspection' | 'Work In Progress' | 'Quality Check' | 'Ready for Delivery';
  assignedMechanic: string;
  estimatedCompletion: string;
  progressPercent: number;
}

const mockVehicles: VehicleStatus[] = [
  { id: 'V-01', vehicleNo: 'DHK-METRO-GA-13-8851', model: 'Toyota Land Cruiser Prado', customerName: 'Europetex Ltd', stage: 'Work In Progress', assignedMechanic: 'Rahim Uddin', estimatedCompletion: 'Today, 05:00 PM', progressPercent: 65 },
  { id: 'V-02', vehicleNo: 'DHK-12-3456', model: 'Honda Civic Turbo 2021', customerName: 'John Doe', stage: 'Inspection', assignedMechanic: 'Kamal Hossain', estimatedCompletion: 'Today, 02:00 PM', progressPercent: 25 },
  { id: 'V-03', vehicleNo: 'CTG-45-7890', model: 'Nissan X-Trail Hybrid', customerName: 'Sarah Smith', stage: 'Quality Check', assignedMechanic: 'Tariqul Islam', estimatedCompletion: 'Today, 04:30 PM', progressPercent: 90 },
  { id: 'V-04', vehicleNo: 'SYL-77-1122', model: 'Mitsubishi Pajero Sport', customerName: 'Tanvir Hossain', stage: 'Ready for Delivery', assignedMechanic: 'Billal Ahmed', estimatedCompletion: 'Completed', progressPercent: 100 },
];

function VehicleTrackingContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return mockVehicles.filter(v => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return v.vehicleNo.toLowerCase().includes(term) || v.customerName.toLowerCase().includes(term) || v.model.toLowerCase().includes(term);
    });
  }, [searchTerm]);

  const stages: VehicleStatus['stage'][] = ['Inspection', 'Work In Progress', 'Quality Check', 'Ready for Delivery'];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Live Vehicle Status Tracker Board</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time workshop floor stage tracking by license plate number.</p>
        </div>
        <Link href="/dashboard" prefetch={false} className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors shadow-xs w-fit">
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <input 
          type="text" 
          placeholder="Enter license plate number (e.g. DHK-12-3456 or GA-13-8851)..."
          aria-label="Filter vehicle status board"
          className="w-full max-w-md h-9 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#004e89]"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-xs text-slate-500 hover:text-slate-700 underline">
            Clear Search
          </button>
        )}
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map(stage => {
          const itemsInStage = filtered.filter(v => v.stage === stage);
          return (
            <div key={stage} className="bg-slate-100/70 p-3 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">{stage}</span>
                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600">
                  {itemsInStage.length}
                </span>
              </div>

              <div className="space-y-2">
                {itemsInStage.map(item => (
                  <div key={item.id} className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-2 text-xs">
                    <div className="font-mono font-bold text-slate-900 text-sm leading-tight">{item.vehicleNo}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{item.model}</div>
                    <div className="text-[11px] text-slate-400">Customer: <span className="font-semibold text-slate-700">{item.customerName}</span></div>
                    
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>Progress: {item.progressPercent}%</span>
                        <span className="font-semibold text-slate-700">{item.assignedMechanic}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${item.stage === 'Ready for Delivery' ? 'bg-emerald-500' : 'bg-blue-600'}`}
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {itemsInStage.length === 0 && (
                  <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                    No vehicles in this stage.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function VehicleTrackingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading tracking board...</div>}>
      <VehicleTrackingContent />
    </Suspense>
  );
}
