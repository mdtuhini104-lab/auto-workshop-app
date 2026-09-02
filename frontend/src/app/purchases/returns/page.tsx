'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PurchaseReturnRecord, PurchaseReturnItem, KpiCardItem, TableColumn } from '../../../types/erp';

export type { PurchaseReturnRecord, PurchaseReturnItem };

import { INITIAL_PURCHASE_RETURNS } from '../../../data/initialMockData';
import PageHeader from '../../../components/ui/PageHeader';
import KpiSummaryCards from '../../../components/ui/KpiSummaryCards';
import TableFilterBar from '../../../components/ui/TableFilterBar';
import DataTable from '../../../components/ui/DataTable';

export default function PurchaseReturnsListingPage() {
  const [returns, setReturns] = useState<PurchaseReturnRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const saved = localStorage.getItem('purchase_returns');
    if (saved) {
      try {
        setReturns(JSON.parse(saved));
      } catch {
        setReturns(INITIAL_PURCHASE_RETURNS);
        localStorage.setItem('purchase_returns', JSON.stringify(INITIAL_PURCHASE_RETURNS));
      }
    } else {
      setReturns(INITIAL_PURCHASE_RETURNS);
      localStorage.setItem('purchase_returns', JSON.stringify(INITIAL_PURCHASE_RETURNS));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm(`Are you sure you want to delete Purchase Return #${id}?`)) {
      const updated = returns.filter((item) => item.id !== id);
      setReturns(updated);
      localStorage.setItem('purchase_returns', JSON.stringify(updated));
    }
  };

  const filteredReturns = returns.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.refOrder.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalCount = returns.length;
  const totalRefundValue = returns.reduce((acc, curr) => acc + curr.totalCredit, 0);
  const pendingApprovals = returns.filter((r) => r.status === 'Pending').length;
  const resolvedCount = returns.filter((r) => r.status === 'Approved' || r.status === 'Refunded').length;

  const kpis: KpiCardItem[] = [
    { title: 'Total Returns', value: totalCount, subtitle: 'Records' },
    { title: 'Total Refund Value', value: `৳ ${totalRefundValue.toLocaleString('en-BD')}`, badge: 'Credit Total', badgeType: 'info' },
    { title: 'Pending Approvals', value: pendingApprovals, badge: 'Action Needed', badgeType: 'warning' },
    { title: 'Resolved / Credited', value: resolvedCount, badge: 'Completed', badgeType: 'success' }
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Refunded', value: 'Refunded' }
  ];

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Refunded':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const columns: TableColumn<PurchaseReturnRecord>[] = [
    { key: 'id', header: 'Return ID', render: (item) => (
      <Link prefetch={false} href={`/purchases/returns/view?id=${item.id}`} className="font-bold text-[#004e89] hover:underline">
        {item.id}
      </Link>
    )},
    { key: 'vendorName', header: 'Vendor / Supplier', render: (item) => <span className="font-semibold text-slate-900">{item.vendorName}</span> },
    { key: 'refOrder', header: 'Ref PO / Invoice', render: (item) => <span className="font-mono text-slate-600">{item.refOrder}</span> },
    { key: 'returnDate', header: 'Return Date', render: (item) => <span className="text-slate-600">{item.returnDate}</span> },
    { key: 'itemsReturned', header: 'Items Returned', render: (item) => <span className="text-slate-700 max-w-xs truncate block" title={item.itemsReturned}>{item.itemsReturned}</span> },
    { key: 'totalCredit', header: 'Total Credit (৳)', align: 'right', render: (item) => <span className="font-mono font-bold text-slate-900">৳ {item.totalCredit.toLocaleString('en-BD')}</span> },
    { key: 'status', header: 'Status', align: 'center', render: (item) => (
      <span className={`inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${getStatusBadgeStyle(item.status)}`}>
        {item.status}
      </span>
    )},
    { key: 'actions', header: 'Actions', align: 'right', render: (item) => (
      <div className="inline-flex items-center justify-end gap-2">
        <Link prefetch={false} href={`/purchases/returns/view?id=${item.id}`} className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors">
          View
        </Link>
        <button onClick={() => handleDelete(item.id)} className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-xs font-semibold transition-colors">
          Delete
        </button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Return to Vendor"
        subtitle="Track and manage defective parts, incorrect deliveries, and credit notes sent back to suppliers"
        badgeText="Purchases Module"
        actionText="+ Create Return"
        actionHref="/purchases/returns/create"
      />

      <KpiSummaryCards cards={kpis} />

      <TableFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by Return ID, Vendor, PO..."
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={statusOptions}
      />

      <DataTable
        columns={columns}
        data={filteredReturns}
        keyExtractor={(item) => item.id}
        emptyMessage="No purchase returns found matching your search."
      />
    </div>
  );
}
