'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';

interface Appointment {
  id: string;
  bookingNo: string;
  customerName: string;
  phone: string;
  vehicleNo: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
}

const mockAppointments: Appointment[] = [
  { id: '1', bookingNo: 'APT-101', customerName: 'Europetex Ltd', phone: '+880 1711-123456', vehicleNo: 'DHK-METRO-GA-13-8851', serviceType: 'Periodic Maintenance & Oil Change', appointmentDate: '2026-08-08', appointmentTime: '10:00 AM', status: 'Confirmed' },
  { id: '2', bookingNo: 'APT-102', customerName: 'Tanvir Hossain', phone: '+880 1819-887766', vehicleNo: 'SYL-77-1122', serviceType: 'AC Gas Refill & Cooling Check', appointmentDate: '2026-08-08', appointmentTime: '02:30 PM', status: 'Scheduled' },
  { id: '3', bookingNo: 'APT-103', customerName: 'Sarah Smith', phone: '+880 1912-334455', vehicleNo: 'CTG-45-7890', serviceType: 'Brake Pad Replacement', appointmentDate: '2026-08-09', appointmentTime: '11:15 AM', status: 'Scheduled' },
  { id: '4', bookingNo: 'APT-104', customerName: 'John Doe', phone: '+880 1712-990011', vehicleNo: 'DHK-12-3456', serviceType: 'Engine Diagnostic & Suspension Check', appointmentDate: '2026-08-07', appointmentTime: '09:00 AM', status: 'In Progress' },
];

function AppointmentsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = useMemo(() => {
    return mockAppointments.filter(apt => {
      if (statusFilter !== 'All' && apt.status !== statusFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (!apt.bookingNo.toLowerCase().includes(term) && !apt.customerName.toLowerCase().includes(term) && !apt.vehicleNo.toLowerCase().includes(term)) {
          return false;
        }
      }
      return true;
    });
  }, [searchTerm, statusFilter]);

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-100 text-emerald-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-amber-100 text-amber-800';
      case 'Completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Service Appointments & Bookings</h1>
          <p className="text-xs text-slate-500 mt-1">Manage customer vehicle service reservations, slot timing, and confirmation status.</p>
        </div>
        <Link href="/dashboard" prefetch={false} className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors shadow-xs w-fit">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <input 
            type="text" 
            placeholder="Search booking no, customer, plate..."
            aria-label="Filter appointments"
            className="w-64 h-8 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select 
            aria-label="Filter appointment status"
            className="h-8 px-2.5 text-xs border border-slate-300 rounded-lg outline-none"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button className="h-8 px-3 bg-[#004e89] text-white rounded-lg text-xs font-semibold hover:bg-[#003d6c] transition-colors">
          + Book New Appointment
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Booking No</th>
              <th className="py-2.5 px-3">Customer</th>
              <th className="py-2.5 px-3">Vehicle</th>
              <th className="py-2.5 px-3">Service Requested</th>
              <th className="py-2.5 px-3">Date & Time</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(apt => (
              <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{apt.bookingNo}</td>
                <td className="py-2.5 px-3 font-semibold text-slate-800">
                  <div>{apt.customerName}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{apt.phone}</div>
                </td>
                <td className="py-2.5 px-3 text-slate-600 font-mono">{apt.vehicleNo}</td>
                <td className="py-2.5 px-3 text-slate-700 font-medium">{apt.serviceType}</td>
                <td className="py-2.5 px-3 text-slate-600 font-medium">
                  {apt.appointmentDate} <span className="text-slate-400">@ {apt.appointmentTime}</span>
                </td>
                <td className="py-2.5 px-3">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(apt.status)}`}>
                    {apt.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <Link href={`/quotations/inspections/create?appointment=${apt.id}`} prefetch={false} className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-bold transition-colors">
                    Start Inspection
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading appointments...</div>}>
      <AppointmentsContent />
    </Suspense>
  );
}
