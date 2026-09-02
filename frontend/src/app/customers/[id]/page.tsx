'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { User, Car, Clock, Phone, Mail, MapPin } from 'lucide-react';

function CustomerDetailContent() {
  const params = useParams();
  const id = params?.id || '1';

  const customer = {
    id,
    name: 'John Doe',
    phone: '+880 1711-000001',
    email: 'john.doe@gmail.com',
    address: 'House # 12, Road # 5, Sector # 3, Uttara, Dhaka',
    totalSpent: 57500,
    vehicles: [
      { plateNumber: 'DHK-12-3456', model: 'Toyota Corolla Cross', year: '2022', color: 'Pearl White', vin: 'JTD1123984710293' },
      { plateNumber: 'DHK-15-9876', model: 'Honda Civic Turbo', year: '2021', color: 'Crystal Black', vin: 'HND9928374102938' }
    ],
    history: [
      { id: 'JOB-2026-089', date: '2026-07-21', vehicle: 'DHK-12-3456', service: 'Periodic Maintenance & Oil Change', total: 45000, status: 'Completed' },
      { id: 'JOB-2026-042', date: '2026-05-15', vehicle: 'DHK-15-9876', service: 'Brake Pad Replacement & Disc Turning', total: 12500, status: 'Completed' }
    ]
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto text-slate-800 dark:text-slate-100 font-sans">
      <div className="text-xs text-slate-500 space-x-1">
        <Link href="/customers" prefetch={false} className="hover:underline">Customers</Link>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">{customer.name}</span>
      </div>

      {/* Customer Header Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{customer.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1 font-mono">
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{customer.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{customer.email}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{customer.address}</span>
            </div>
          </div>
        </div>

        <div className="text-right border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-3 md:pt-0 md:pl-6">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block">Total Spent</span>
          <span className="text-xl font-extrabold text-emerald-600 font-mono">৳ {customer.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* Owned Vehicles List */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Car className="w-4 h-4 text-blue-600" />
          <span>Registered Vehicles ({customer.vehicles.length})</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {customer.vehicles.map((v, i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm font-mono text-slate-900 dark:text-white">{v.plateNumber}</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">{v.year}</span>
              </div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">{v.model} ({v.color})</p>
              <p className="text-[11px] text-slate-400 font-mono">VIN: {v.vin}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Past Service History Timeline */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          <span>Servicing & Repairs History</span>
        </h2>
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-3">Job Card No</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Vehicle</th>
              <th className="py-2.5 px-3">Service Provided</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-mono">
            {customer.history.map((h, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{h.id}</td>
                <td className="py-3 px-3 text-slate-500">{h.date}</td>
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">{h.vehicle}</td>
                <td className="py-3 px-3 font-sans text-slate-700 dark:text-slate-300">{h.service}</td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">{h.status}</span></td>
                <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">৳ {h.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CustomerDetailPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading customer profile...</div>}>
      <CustomerDetailContent />
    </Suspense>
  );
}
