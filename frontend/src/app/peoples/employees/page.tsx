'use client';

import React, { useState } from 'react';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  salary: number;
  status: 'Active' | 'On Leave';
}

const DEFAULT_EMPLOYEES: Employee[] = [
  { id: 'EMP-001', name: 'Kabir Hossain', role: 'Chief Senior Mechanic', department: 'Mechanical & Engine', phone: '01711-445566', salary: 35000, status: 'Active' },
  { id: 'EMP-002', name: 'Jasim Uddin', role: 'Auto Electrician Lead', department: 'Electrical & AC', phone: '01819-667788', salary: 28000, status: 'Active' },
  { id: 'EMP-003', name: 'Tariqul Islam', role: 'Store & Inventory Keeper', department: 'Warehouse & Store', phone: '01912-889900', salary: 22000, status: 'Active' },
];

export default function EmployeesPage() {
  const [employees] = useState<Employee[]>(DEFAULT_EMPLOYEES);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mechanics, Technicians & Staff Directory</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Workshop staff assignments, roles, and payroll overview</p>
        </div>
        <button className="bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          + Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-[#f1f5f9]">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Workshop Staff</p>
          <p className="text-2xl font-black text-slate-900 mt-2">{employees.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Active Technicians</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">{employees.filter(e=>e.status==='Active').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Monthly Payroll</p>
          <p className="text-2xl font-black text-[#004e89] mt-2">৳ {employees.reduce((a,b)=>a+b.salary,0).toLocaleString('en-BD')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase">Departments</p>
          <p className="text-2xl font-black text-amber-600 mt-2">3 Technical Units</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Employee ID</th>
              <th className="py-3 px-4">Staff Name</th>
              <th className="py-3 px-4">Role / Designation</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4 text-right">Base Salary (৳)</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-bold text-[#004e89]">{e.id}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{e.name}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{e.role}</td>
                <td className="py-3 px-4 text-slate-600">{e.department}</td>
                <td className="py-3 px-4 font-mono text-slate-600">{e.phone}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">৳ {e.salary.toLocaleString('en-BD')}</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{e.status}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">View Staff</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
