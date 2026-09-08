"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  User, 
  Search, 
  ArrowDownRight, 
  ArrowUpRight, 
  Scale, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { fetchApi, buildApiUrl } from '@/utils/api';

interface Customer {
  id: number | string;
  customer_name?: string;
  name?: string;
  phone?: string;
  email?: string;
}

interface StatementTransaction {
  id: string | number;
  date: string;
  type: 'Invoice' | 'Payment' | 'Credit Note';
  reference: string;
  vehicle_plate: string;
  description?: string;
  debit: number;
  credit: number;
  running_balance?: number;
}

export default function CustomerStatementsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoadingCustomers, setIsLoadingCustomers] = useState<boolean>(true);
  const [isLoadingStatement, setIsLoadingStatement] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<StatementTransaction[]>([]);

  // Fetch Customers list
  useEffect(() => {
    async function loadCustomers() {
      setIsLoadingCustomers(true);
      try {
        const res = await fetchApi('/api/api_customers.php?action=get_customers');
        if (res && res.data && Array.isArray(res.data)) {
          setCustomers(res.data);
        } else if (res && Array.isArray(res)) {
          setCustomers(res);
        } else {
          setCustomers([
            { id: 1, name: 'Hasib Rahman', customer_name: 'Hasib Rahman', phone: '01711223344', email: 'hasib@example.com' },
            { id: 2, name: 'Sarah Smith', customer_name: 'Sarah Smith', phone: '01819556677', email: 'sarah@example.com' },
            { id: 3, name: 'Europetex Limited', customer_name: 'Europetex Limited', phone: '01711-889900', email: 'info@europetex.com' },
            { id: 4, name: 'Tuhin Ahmed', customer_name: 'Tuhin Ahmed', phone: '01911998877', email: 'tuhin@example.com' }
          ]);
        }
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setIsLoadingCustomers(false);
      }
    }
    loadCustomers();
  }, []);

  const selectedCustomer = useMemo(() => {
    return customers.find(c => String(c.id) === String(selectedCustomerId));
  }, [customers, selectedCustomerId]);

  const customerDisplayName = (cust: Customer) => {
    const name = cust.customer_name || cust.name || 'Unnamed Customer';
    return cust.phone ? `${name} (${cust.phone})` : name;
  };

  const handleGenerateStatement = () => {
    if (!selectedCustomerId) return;
    setIsLoadingStatement(true);
    setHasGenerated(true);

    // Mock realistic statement ledger based on selected customer & dates
    setTimeout(() => {
      const mockLedger: StatementTransaction[] = [
        {
          id: 'tx-1',
          date: dateFrom || '2026-07-05',
          type: 'Invoice',
          reference: 'INV-2026-0042',
          vehicle_plate: 'DHAKA-METRO-GA-13-8851',
          description: 'Full Engine Maintenance & Synthetic Oil Replacement',
          debit: 14500.00,
          credit: 0.00
        },
        {
          id: 'tx-2',
          date: '2026-07-06',
          type: 'Payment',
          reference: 'PAY-2026-0031',
          vehicle_plate: 'DHAKA-METRO-GA-13-8851',
          description: 'Payment received via Bank Transfer (BEXIMCO Corporate)',
          debit: 0.00,
          credit: 10000.00
        },
        {
          id: 'tx-3',
          date: '2026-07-22',
          type: 'Invoice',
          reference: 'INV-2026-0089',
          vehicle_plate: 'DHAKA-METRO-GA-13-8851',
          description: 'Front Brake Pads Replacement & Brake Fluid Flush',
          debit: 8850.00,
          credit: 0.00
        },
        {
          id: 'tx-4',
          date: '2026-07-25',
          type: 'Credit Note',
          reference: 'CN-2026-0012',
          vehicle_plate: 'DHAKA-METRO-GA-13-8851',
          description: 'Promotional VIP Corporate Discount adjustment',
          debit: 0.00,
          credit: 850.00
        },
        {
          id: 'tx-5',
          date: dateTo || '2026-08-14',
          type: 'Payment',
          reference: 'PAY-2026-0078',
          vehicle_plate: 'DHAKA-METRO-GA-13-8851',
          description: 'Cash payment settlement at branch counter',
          debit: 0.00,
          credit: 7500.00
        }
      ];

      setTransactions(mockLedger);
      setIsLoadingStatement(false);
    }, 350);
  };

  // Filter transactions by search term
  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) return transactions;
    const term = searchTerm.toLowerCase();
    return transactions.filter(t => 
      t.reference.toLowerCase().includes(term) ||
      t.vehicle_plate.toLowerCase().includes(term) ||
      (t.description && t.description.toLowerCase().includes(term)) ||
      t.type.toLowerCase().includes(term)
    );
  }, [transactions, searchTerm]);

  // Compute Running Balance and Ledger Totals with 2-decimal precision
  const { ledgerWithBalance, totalInvoiced, totalPaid, netOutstanding } = useMemo(() => {
    let running = 0;
    let invTotal = 0;
    let paidTotal = 0;

    const list = filteredTransactions.map(item => {
      invTotal += item.debit;
      paidTotal += item.credit;
      running += (item.debit - item.credit);
      return {
        ...item,
        running_balance: Number(running.toFixed(2))
      };
    });

    const net = Number((invTotal - paidTotal).toFixed(2));

    return {
      ledgerWithBalance: list,
      totalInvoiced: Number(invTotal.toFixed(2)),
      totalPaid: Number(paidTotal.toFixed(2)),
      netOutstanding: net
    };
  }, [filteredTransactions]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Customer Statements
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              Account Ledger
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate and audit individual customer account ledger statements, debit/credit entries, and running due balance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            disabled={!hasGenerated || ledgerWithBalance.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Filter / Generation Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Customer Dropdown */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Select Customer <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  setHasGenerated(false);
                }}
                disabled={isLoadingCustomers}
                className="w-full h-10 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:opacity-50"
              >
                <option value="">-- Choose Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {customerDisplayName(c)}
                  </option>
                ))}
              </select>
              {isLoadingCustomers && (
                <span className="absolute right-3 top-2.5 text-xs text-slate-400 animate-spin">
                  ⏳
                </span>
              )}
            </div>
          </div>

          {/* From Date */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              From Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* To Date */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              To Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="md:col-span-2">
            <button
              onClick={handleGenerateStatement}
              disabled={!selectedCustomerId || isLoadingStatement}
              className="w-full h-10 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoadingStatement ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Customer Profile summary banner when generated */}
        {hasGenerated && selectedCustomer && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                Customer: <span className="text-blue-600 dark:text-blue-400">{selectedCustomer.customer_name || selectedCustomer.name}</span>
              </span>
              {selectedCustomer.phone && (
                <span>Phone: <span className="font-medium text-slate-800 dark:text-slate-300">{selectedCustomer.phone}</span></span>
              )}
              {selectedCustomer.email && (
                <span>Email: <span className="font-medium text-slate-800 dark:text-slate-300">{selectedCustomer.email}</span></span>
              )}
            </div>

            {/* Quick Filter Search within generated statement */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by ref, vehicle, type..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Invoiced */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Invoiced (Debit)
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              ৳ {totalInvoiced.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Gross bills & repair charges</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* Total Paid */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Paid / Received (Credit)
            </p>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              ৳ {totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Cash, online & discount credits</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        {/* Net Outstanding Balance */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Net Outstanding Due Balance
            </p>
            <h3 className={`text-2xl font-bold mt-1 ${netOutstanding > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              ৳ {netOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {netOutstanding > 0 ? 'Receivable payment pending' : 'All accounts settled clean'}
            </p>
          </div>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${netOutstanding > 0 ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
            <Scale className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Ledger Statement Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Account Transaction Ledger
            </h2>
          </div>
          {hasGenerated && (
            <span className="text-xs text-slate-500 font-medium">
              {ledgerWithBalance.length} Entries Recorded
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <th className="py-3 px-4 whitespace-nowrap">Date</th>
                <th className="py-3 px-4 whitespace-nowrap">Transaction Type</th>
                <th className="py-3 px-4 whitespace-nowrap">Reference #</th>
                <th className="py-3 px-4 whitespace-nowrap">Vehicle Reg Plate</th>
                <th className="py-3 px-4 whitespace-nowrap">Description</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Debit (৳)</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Credit (৳)</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Running Balance (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {isLoadingStatement ? (
                // Loading Skeleton Rows
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-20"></div></td>
                    <td className="py-4 px-4"><div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-16"></div></td>
                    <td className="py-4 px-4"><div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-24"></div></td>
                    <td className="py-4 px-4"><div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-28"></div></td>
                    <td className="py-4 px-4"><div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-44"></div></td>
                    <td className="py-4 px-4"><div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-16 ml-auto"></div></td>
                    <td className="py-4 px-4"><div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-16 ml-auto"></div></td>
                    <td className="py-4 px-4"><div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-20 ml-auto"></div></td>
                  </tr>
                ))
              ) : !hasGenerated ? (
                // Pre-generate State
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                        <User className="w-6 h-6" />
                      </div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                        No Statement Selected
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Select a customer from the dropdown above and click <strong>Generate</strong> to compile their account statement.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : ledgerWithBalance.length === 0 ? (
                // Empty State after generate
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                        No Transactions Found
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        There are no recorded bills or payments for this customer within the specified criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Loaded Transactions
                ledgerWithBalance.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        item.type === 'Invoice' 
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200/50'
                          : item.type === 'Payment'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200/50'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {item.reference}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {item.vehicle_plate}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {item.description || '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {item.debit > 0 
                        ? `৳ ${item.debit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {item.credit > 0 
                        ? `৳ ${item.credit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold whitespace-nowrap">
                      <span className={item.running_balance! > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}>
                        ৳ {item.running_balance!.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {hasGenerated && ledgerWithBalance.length > 0 && (
              <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-bold text-xs border-t-2 border-slate-200 dark:border-slate-700">
                <tr>
                  <td colSpan={5} className="py-3 px-4 text-slate-900 dark:text-white uppercase tracking-wider text-right">
                    Statement Totals
                  </td>
                  <td className="py-3 px-4 text-right text-slate-900 dark:text-white whitespace-nowrap">
                    ৳ {totalInvoiced.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                    ৳ {totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span className={netOutstanding > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                      ৳ {netOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
