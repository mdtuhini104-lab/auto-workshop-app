'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  ipAddress: string;
}

const mockLogs: AuditLog[] = [
  { id: 'LOG-01', timestamp: '2026-08-07 18:42:10', user: 'Admin (Mamun)', action: 'Updated Workshop Profile', module: 'Settings', ipAddress: '103.204.244.12' },
  { id: 'LOG-02', timestamp: '2026-08-07 17:15:30', user: 'Rahim Manager', action: 'Approved Quotation #QT-2607-002', module: 'Quotations', ipAddress: '103.204.244.15' },
  { id: 'LOG-03', timestamp: '2026-08-07 15:30:00', user: 'Reception Desk', action: 'Created Appointment #APT-104', module: 'Appointments', ipAddress: '103.204.244.19' },
  { id: 'LOG-04', timestamp: '2026-08-07 12:10:45', user: 'Kamal Mechanic', action: 'Updated Job Card #JC-991 Status to In Progress', module: 'Job Cards', ipAddress: '103.204.244.22' },
];

function AuditLogsContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockLogs.filter(l => 
    l.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Audit & Security Logs</h1>
          <p className="text-xs text-slate-500 mt-1">Immutable activity trail of system actions, user logins, and configuration changes.</p>
        </div>
        <Link href="/dashboard" prefetch={false} className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors shadow-xs w-fit">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center">
        <input 
          type="text" 
          placeholder="Filter audit logs by user, action, or module..."
          aria-label="Filter audit logs"
          className="w-72 h-8 px-3 text-xs border border-slate-300 rounded-lg outline-none focus:ring-1 focus:ring-[#004e89]"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="h-8 px-3 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors">
          Export Security Logs
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Log ID</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">User</th>
              <th className="py-2.5 px-3">Action Details</th>
              <th className="py-2.5 px-3">Module</th>
              <th className="py-2.5 px-3 text-right">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(log => (
              <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{log.id}</td>
                <td className="py-2.5 px-3 font-mono text-slate-600">{log.timestamp}</td>
                <td className="py-2.5 px-3 font-bold text-slate-900">{log.user}</td>
                <td className="py-2.5 px-3 text-slate-800 font-medium">{log.action}</td>
                <td className="py-2.5 px-3 font-semibold text-[#004e89]">{log.module}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-500">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AuditLogsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading audit logs...</div>}>
      <AuditLogsContent />
    </Suspense>
  );
}
