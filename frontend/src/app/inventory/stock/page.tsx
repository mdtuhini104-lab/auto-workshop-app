'use client';

import React, { useState, useEffect } from 'react';
import { StockItem, KpiCardItem, TableColumn } from '../../../types/erp';
import { INITIAL_STOCK } from '../../../data/initialMockData';
import PageHeader from '../../../components/ui/PageHeader';
import KpiSummaryCards from '../../../components/ui/KpiSummaryCards';
import TableFilterBar from '../../../components/ui/TableFilterBar';
import DataTable from '../../../components/ui/DataTable';

export default function StockControlPage() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('erp_inventory_stock');
    if (saved) {
      try { setStock(JSON.parse(saved)); } catch { setStock(INITIAL_STOCK); }
    } else {
      setStock(INITIAL_STOCK);
      localStorage.setItem('erp_inventory_stock', JSON.stringify(INITIAL_STOCK));
    }
  }, []);

  const filtered = stock.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.partNo.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const kpis: KpiCardItem[] = [
    { title: 'Total Items in Stock', value: `${stock.reduce((a,b)=>a+b.quantity,0)} Units`, subtitle: 'Physical Qty' },
    { title: 'Total Inventory Valuation', value: `৳ ${stock.reduce((a,b)=>a+(b.quantity*b.unitCost),0).toLocaleString('en-BD')}`, badge: 'Valuation', badgeType: 'info' },
    { title: 'Unique Part SKUs', value: `${stock.length} SKUs`, badge: 'Registered', badgeType: 'success' },
    { title: 'Warehouse Location', value: 'Uttara Central', badge: 'Main Warehouse', badgeType: 'warning' }
  ];

  const columns: TableColumn<StockItem>[] = [
    { key: 'id', header: 'SKU / Item ID', render: (s) => <span className="font-bold text-[#004e89]">{s.id}</span> },
    { key: 'partNo', header: 'OEM Part Number', render: (s) => <span className="font-mono text-slate-600">{s.partNo}</span> },
    { key: 'name', header: 'Item Name', render: (s) => <span className="font-bold text-slate-900">{s.name}</span> },
    { key: 'category', header: 'Category', render: (s) => <span className="text-slate-600">{s.category}</span> },
    { key: 'quantity', header: 'Available Stock', align: 'center', render: (s) => <span className="font-bold text-emerald-700">{s.quantity} {s.unit}</span> },
    { key: 'unitCost', header: 'Unit Cost (৳)', align: 'right', render: (s) => <span className="font-mono text-slate-700">৳ {s.unitCost.toLocaleString('en-BD')}</span> },
    { key: 'totalValuation', header: 'Total Valuation (৳)', align: 'right', render: (s) => <span className="font-mono font-bold text-slate-900">৳ {(s.quantity * s.unitCost).toLocaleString('en-BD')}</span> },
    { key: 'location', header: 'Rack / Bin', align: 'center', render: (s) => <span className="font-mono text-xs bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200">{s.location}</span> }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Control (Inventory)"
        subtitle="Live tracking of spare parts, engine oils, and warehouse supplies"
        actionText="+ Add Stock Item"
        onActionClick={() => alert('Add Stock Item Flow')}
      />

      <KpiSummaryCards cards={kpis} />

      <TableFilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by Part #, item name, or category..."
      />

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(s) => s.id}
        emptyMessage="No inventory stock items found."
      />
    </div>
  );
}
