'use client';

import React, { useState, useEffect } from 'react';
import { PurchaseOrder, KpiCardItem, TableColumn } from '../../../types/erp';
import { INITIAL_PURCHASE_ORDERS } from '../../../data/initialMockData';
import PageHeader from '../../../components/ui/PageHeader';
import KpiSummaryCards from '../../../components/ui/KpiSummaryCards';
import TableFilterBar from '../../../components/ui/TableFilterBar';
import DataTable from '../../../components/ui/DataTable';

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('erp_purchase_orders');
    if (saved) {
      try { setOrders(JSON.parse(saved)); } catch { setOrders(INITIAL_PURCHASE_ORDERS); }
    } else {
      setOrders(INITIAL_PURCHASE_ORDERS);
      localStorage.setItem('erp_purchase_orders', JSON.stringify(INITIAL_PURCHASE_ORDERS));
    }
  }, []);

  const filtered = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.vendorName.toLowerCase().includes(search.toLowerCase())
  );

  const kpis: KpiCardItem[] = [
    { title: 'Total Orders', value: orders.length, subtitle: 'Records' },
    { title: 'Total Value', value: `৳ ${orders.reduce((a,b)=>a+b.totalAmount,0).toLocaleString('en-BD')}`, badge: 'Total PO', badgeType: 'info' },
    { title: 'Pending Approval', value: orders.filter(o=>o.status==='Pending').length, badge: 'Pending', badgeType: 'warning' },
    { title: 'Fully Received', value: orders.filter(o=>o.status==='Received').length, badge: 'Received', badgeType: 'success' }
  ];

  const columns: TableColumn<PurchaseOrder>[] = [
    { key: 'id', header: 'PO Number', render: (o) => <span className="font-bold text-[#004e89]">{o.id}</span> },
    { key: 'vendorName', header: 'Vendor Name', render: (o) => <span className="font-semibold text-slate-900">{o.vendorName}</span> },
    { key: 'orderDate', header: 'Order Date', render: (o) => <span className="text-slate-600">{o.orderDate}</span> },
    { key: 'expectedDate', header: 'Expected Delivery', render: (o) => <span className="text-slate-600">{o.expectedDate}</span> },
    { key: 'totalAmount', header: 'Total Amount (৳)', align: 'right', render: (o) => <span className="font-mono font-bold text-slate-900">৳ {o.totalAmount.toLocaleString('en-BD')}</span> },
    { key: 'status', header: 'Status', align: 'center', render: (o) => (
      <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
        o.status === 'Received' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
        o.status === 'Approved' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
      }`}>
        {o.status}
      </span>
    )},
    { key: 'actions', header: 'Actions', align: 'right', render: () => <button className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold hover:bg-slate-200 transition-colors">View</button> }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Orders"
        subtitle="Issue, approve, and track purchase orders to spare parts vendors"
        actionText="+ Create Purchase Order"
        onActionClick={() => alert('Create PO Flow')}
      />

      <KpiSummaryCards cards={kpis} />

      <TableFilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by PO # or vendor name..."
      />

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(o) => o.id}
        emptyMessage="No purchase orders found matching your search."
      />
    </div>
  );
}
