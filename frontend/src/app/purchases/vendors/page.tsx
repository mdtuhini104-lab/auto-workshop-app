'use client';

import React, { useState, useEffect } from 'react';
import { Vendor, KpiCardItem, TableColumn } from '../../../types/erp';
import { INITIAL_VENDORS } from '../../../data/initialMockData';
import PageHeader from '../../../components/ui/PageHeader';
import KpiSummaryCards from '../../../components/ui/KpiSummaryCards';
import TableFilterBar from '../../../components/ui/TableFilterBar';
import DataTable from '../../../components/ui/DataTable';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('erp_vendors');
    if (saved) {
      try { setVendors(JSON.parse(saved)); } catch { setVendors(INITIAL_VENDORS); }
    } else {
      setVendors(INITIAL_VENDORS);
      localStorage.setItem('erp_vendors', JSON.stringify(INITIAL_VENDORS));
    }
  }, []);

  const filtered = vendors.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase())
  );

  const kpis: KpiCardItem[] = [
    { title: 'Total Vendors', value: vendors.length, subtitle: 'Suppliers' },
    { title: 'Total Payable Balance', value: `৳ ${vendors.reduce((a,b)=>a+b.balance,0).toLocaleString('en-BD')}`, badge: 'Payable', badgeType: 'danger' },
    { title: 'Active Suppliers', value: vendors.filter(v=>v.status==='Active').length, badge: 'Active', badgeType: 'success' },
    { title: 'Categories', value: '4 Specialties', badge: 'Specialties', badgeType: 'info' }
  ];

  const columns: TableColumn<Vendor>[] = [
    { key: 'id', header: 'Vendor ID', render: (v) => <span className="font-bold text-[#004e89]">{v.id}</span> },
    { key: 'name', header: 'Company Name', render: (v) => <span className="font-bold text-slate-900">{v.name}</span> },
    { key: 'contactPerson', header: 'Contact Person', render: (v) => <span className="text-slate-700">{v.contactPerson}</span> },
    { key: 'phone', header: 'Phone', render: (v) => <span className="font-mono text-slate-600">{v.phone}</span> },
    { key: 'category', header: 'Supply Category', render: (v) => <span className="text-slate-600">{v.category}</span> },
    { key: 'balance', header: 'Payable Balance (৳)', align: 'right', render: (v) => <span className="font-mono font-bold text-rose-600">৳ {v.balance.toLocaleString('en-BD')}</span> },
    { key: 'status', header: 'Status', align: 'center', render: (v) => <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{v.status}</span> },
    { key: 'actions', header: 'Actions', align: 'right', render: () => <button className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold hover:bg-slate-200 transition-colors">Edit</button> }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendors & Suppliers"
        subtitle="Manage parts suppliers, lubricant distributors, and service vendors"
        actionText="+ Add New Vendor"
        onActionClick={() => alert('Add Vendor Modal / Flow')}
      />

      <KpiSummaryCards cards={kpis} />

      <TableFilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by vendor name, contact person, or category..."
      />

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(v) => v.id}
        emptyMessage="No vendors found matching your search."
      />
    </div>
  );
}
