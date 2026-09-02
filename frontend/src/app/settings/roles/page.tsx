'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

interface RolePermission {
  role: string;
  usersCount: number;
  description: string;
  permissions: { module: string; canRead: boolean; canWrite: boolean; canDelete: boolean }[];
}

const initialRoles: RolePermission[] = [
  {
    role: 'Admin / Owner',
    usersCount: 2,
    description: 'Full un-restricted access across all operational, financial, and system settings.',
    permissions: [
      { module: 'Master Data', canRead: true, canWrite: true, canDelete: true },
      { module: 'Quotations & Billing', canRead: true, canWrite: true, canDelete: true },
      { module: 'Inventory & Purchases', canRead: true, canWrite: true, canDelete: true },
      { module: 'Financial Accounts', canRead: true, canWrite: true, canDelete: true },
      { module: 'System Settings', canRead: true, canWrite: true, canDelete: true },
    ]
  },
  {
    role: 'Workshop Manager',
    usersCount: 4,
    description: 'Manages daily work orders, inventory stock, customer estimates, and mechanics.',
    permissions: [
      { module: 'Master Data', canRead: true, canWrite: true, canDelete: false },
      { module: 'Quotations & Billing', canRead: true, canWrite: true, canDelete: true },
      { module: 'Inventory & Purchases', canRead: true, canWrite: true, canDelete: false },
      { module: 'Financial Accounts', canRead: true, canWrite: false, canDelete: false },
      { module: 'System Settings', canRead: false, canWrite: false, canDelete: false },
    ]
  },
  {
    role: 'Mechanic / Technician',
    usersCount: 8,
    description: 'Can inspect vehicles, view assigned work cards, and update job status.',
    permissions: [
      { module: 'Master Data', canRead: true, canWrite: false, canDelete: false },
      { module: 'Quotations & Billing', canRead: true, canWrite: false, canDelete: false },
      { module: 'Inventory & Purchases', canRead: true, canWrite: false, canDelete: false },
      { module: 'Financial Accounts', canRead: false, canWrite: false, canDelete: false },
      { module: 'System Settings', canRead: false, canWrite: false, canDelete: false },
    ]
  },
  {
    role: 'Front Desk / Receptionist',
    usersCount: 3,
    description: 'Handles customer intake, appointment scheduling, and bill printing.',
    permissions: [
      { module: 'Master Data', canRead: true, canWrite: false, canDelete: false },
      { module: 'Quotations & Billing', canRead: true, canWrite: true, canDelete: false },
      { module: 'Inventory & Purchases', canRead: true, canWrite: false, canDelete: false },
      { module: 'Financial Accounts', canRead: false, canWrite: false, canDelete: false },
      { module: 'System Settings', canRead: false, canWrite: false, canDelete: false },
    ]
  }
];

function RolesSettingsContent() {
  const [roles, setRoles] = useState<RolePermission[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState(initialRoles[0].role);

  const current = roles.find(r => r.role === selectedRole) || roles[0];

  const togglePermission = (moduleName: string, field: 'canRead' | 'canWrite' | 'canDelete') => {
    setRoles(prev => prev.map(r => {
      if (r.role !== selectedRole) return r;
      return {
        ...r,
        permissions: r.permissions.map(p => {
          if (p.module !== moduleName) return p;
          return { ...p, [field]: !p[field] };
        })
      };
    }));
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto text-slate-800">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Roles & Permissions</h1>
          <p className="text-xs text-slate-500 mt-1">Configure staff security roles and module access privileges.</p>
        </div>
        <Link href="/dashboard" prefetch={false} className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors shadow-xs">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Role Selector Sidebar */}
        <div className="space-y-2">
          {roles.map(r => (
            <button
              key={r.role}
              onClick={() => setSelectedRole(r.role)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                selectedRole === r.role 
                  ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-extrabold flex justify-between items-center">
                <span>{r.role}</span>
                <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] text-slate-600 font-medium">{r.usersCount} users</span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal mt-1 line-clamp-2">{r.description}</p>
            </button>
          ))}
        </div>

        {/* Permissions Table */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">{current.role} Matrix</h2>
              <p className="text-[11px] text-slate-500">{current.description}</p>
            </div>
            <button className="px-3 py-1.5 bg-[#004e89] text-white rounded-lg text-xs font-semibold hover:bg-[#003d6c] transition-colors">
              Save Role Matrix
            </button>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Module</th>
                <th className="py-2.5 px-3 text-center">Read / View</th>
                <th className="py-2.5 px-3 text-center">Write / Edit</th>
                <th className="py-2.5 px-3 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {current.permissions.map(p => (
                <tr key={p.module} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-semibold text-slate-800">{p.module}</td>
                  <td className="py-3 px-3 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      checked={p.canRead} 
                      onChange={() => togglePermission(p.module, 'canRead')}
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      checked={p.canWrite} 
                      onChange={() => togglePermission(p.module, 'canWrite')}
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      checked={p.canDelete} 
                      onChange={() => togglePermission(p.module, 'canDelete')}
                    />
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

export default function RolesSettingsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading roles & permissions...</div>}>
      <RolesSettingsContent />
    </Suspense>
  );
}
