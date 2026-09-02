'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';

interface ActiveVehicle {
  id: string;
  vehicleNo: string;
  customerName: string;
  serviceAssigned: string;
  stage: string;
  status: 'In Progress' | 'Pending Quote' | 'Ready for Delivery' | 'Invoiced';
  viewUrl: string;
}

function DashboardContent() {
  const kpis = [
    {
      title: "Today's Revenue",
      value: '৳ 45,500',
      change: '+14% vs yesterday',
      isPositive: true,
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Active Work Orders',
      value: '8 Vehicles',
      change: 'Currently in Bays',
      isPositive: true,
      icon: (
        <svg className="w-5 h-5 text-[#004e89]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Pending Quotations',
      value: '5 Quotes',
      change: 'Awaiting Approval',
      isPositive: false,
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Completed Today',
      value: '12 Delivered',
      change: '100% Quality Checked',
      isPositive: true,
      icon: (
        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const activeVehicles: ActiveVehicle[] = [
    {
      id: '1',
      vehicleNo: 'DHK-METRO-GA-13-8851',
      customerName: 'Europetex Limited',
      serviceAssigned: 'Suspension Overhaul & Alignment',
      stage: 'Work Order #WO-2026-101',
      status: 'In Progress',
      viewUrl: '/quotations/orders/view?id=WO-2026-101',
    },
    {
      id: '2',
      vehicleNo: 'DHK-CH-51-7098',
      customerName: 'John Doe',
      serviceAssigned: 'Synthetic Engine Oil & Filter Change',
      stage: 'Quotation #QT-2026-031',
      status: 'Pending Quote',
      viewUrl: '/quotations/view?id=QT-2026-031',
    },
    {
      id: '3',
      vehicleNo: 'DHK-12-3456',
      customerName: 'Sarah Smith',
      serviceAssigned: 'Complete Brake System Repair',
      stage: 'Job Card #JC-2026-001',
      status: 'Ready for Delivery',
      viewUrl: '/job-cards/view?id=JC-2026-001',
    },
    {
      id: '4',
      vehicleNo: 'DHK-15-9876',
      customerName: 'Karim Corp',
      serviceAssigned: 'AC Diagnostic & Gas Refill',
      stage: 'Tax Invoice #INV-2026-001',
      status: 'Invoiced',
      viewUrl: '/billing/view?id=INV-2026-001',
    },
  ];

  const getStatusStyle = (status: ActiveVehicle['status']) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending Quote':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Ready for Delivery':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Invoiced':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workshop Operations Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time overview of active work orders, billing, and shop floor throughput.</p>
        </div>
        <div className="flex gap-2">
          <Link prefetch={false} href="/quotations/inspections/create"
            className="px-3.5 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
          >
            + New Inspection
          </Link>
          <Link prefetch={false} href="/quotations/create"
            className="px-3.5 py-2 bg-[#004e89] text-white rounded-lg text-xs font-semibold hover:bg-[#003d6c] transition-colors shadow-xs"
          >
            + Create Quotation
          </Link>
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">{kpi.title}</span>
              <div className="p-2 bg-slate-50 rounded-lg">{kpi.icon}</div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{kpi.value}</div>
            <div className={`text-[11px] font-semibold ${kpi.isPositive ? 'text-emerald-600' : 'text-amber-600'}`}>
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* 3. ACTIVE VEHICLES IN BAY */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Active Workshop Vehicles</h2>
            <p className="text-xs text-slate-500">Live tracker of vehicles undergoing diagnosis, quotes, or repair.</p>
          </div>
          <Link prefetch={false} href="/quotations" className="text-xs font-semibold text-[#004e89] hover:underline">
            View All Work Orders &rarr;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Vehicle Plate</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Service assigned</th>
                <th className="py-2.5 px-3">Stage / Reference</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeVehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 font-mono">{v.vehicleNo}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{v.customerName}</td>
                  <td className="py-3 px-3 text-slate-600">{v.serviceAssigned}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{v.stage}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 font-bold uppercase rounded-full border ${getStatusStyle(v.status)}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link prefetch={false} href={v.viewUrl}
                      className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded font-medium hover:bg-slate-200 transition-colors text-[11px]"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
