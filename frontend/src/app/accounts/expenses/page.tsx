'use client';

import React, { useState, useEffect } from 'react';
import { Expense, KpiCardItem, TableColumn } from '../../../types/erp';
import { INITIAL_EXPENSES } from '../../../data/initialMockData';
import PageHeader from '../../../components/ui/PageHeader';
import KpiSummaryCards from '../../../components/ui/KpiSummaryCards';
import TableFilterBar from '../../../components/ui/TableFilterBar';
import DataTable from '../../../components/ui/DataTable';

export default function DailyExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('erp_expenses');
    if (saved) {
      try { setExpenses(JSON.parse(saved)); } catch { setExpenses(INITIAL_EXPENSES); }
    } else {
      setExpenses(INITIAL_EXPENSES);
      localStorage.setItem('erp_expenses', JSON.stringify(INITIAL_EXPENSES));
    }
  }, []);

  const filtered = expenses.filter(e => 
    e.id.toLowerCase().includes(search.toLowerCase()) || 
    e.category.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase())
  );

  const kpis: KpiCardItem[] = [
    { title: 'Total Expenses (MTD)', value: `৳ ${expenses.reduce((a,b)=>a+b.amount,0).toLocaleString('en-BD')}`, badge: 'Overheads', badgeType: 'danger' },
    { title: 'Petty Cash Used', value: `৳ ${expenses.filter(e=>e.paymentMode==='Petty Cash').reduce((a,b)=>a+b.amount,0).toLocaleString('en-BD')}`, badge: 'Petty Cash', badgeType: 'warning' },
    { title: 'Bank Paid Expenses', value: `৳ ${expenses.filter(e=>e.paymentMode!=='Petty Cash').reduce((a,b)=>a+b.amount,0).toLocaleString('en-BD')}`, badge: 'Bank TRX', badgeType: 'info' },
    { title: 'Vouchers Recorded', value: expenses.length, badge: 'Vouchers', badgeType: 'success' }
  ];

  const columns: TableColumn<Expense>[] = [
    { key: 'id', header: 'Voucher #', render: (e) => <span className="font-bold text-[#004e89]">{e.id}</span> },
    { key: 'date', header: 'Date', render: (e) => <span className="text-slate-600">{e.date}</span> },
    { key: 'category', header: 'Category', render: (e) => <span className="font-semibold text-slate-900">{e.category}</span> },
    { key: 'description', header: 'Description', render: (e) => <span className="text-slate-700">{e.description}</span> },
    { key: 'paymentMode', header: 'Payment Mode', render: (e) => <span className="text-slate-600">{e.paymentMode}</span> },
    { key: 'amount', header: 'Amount (৳)', align: 'right', render: (e) => <span className="font-mono font-bold text-rose-600">৳ {e.amount.toLocaleString('en-BD')}</span> },
    { key: 'approvedBy', header: 'Approved By', render: (e) => <span className="text-slate-700">{e.approvedBy}</span> }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Workshop Expenses"
        subtitle="Operational overheads, utility bills, and petty cash voucher tracking"
        actionText="+ Record Expense Voucher"
        onActionClick={() => alert('Record Expense Flow')}
      />

      <KpiSummaryCards cards={kpis} />

      <TableFilterBar
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by voucher #, category, or description..."
      />

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(e) => e.id}
        emptyMessage="No expense records found matching your search."
      />
    </div>
  );
}
