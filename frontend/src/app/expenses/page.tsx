'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { Plus, Search, DollarSign, Receipt, CheckCircle2 } from 'lucide-react';

interface ExpenseItem {
  id: string;
  category: 'Rent' | 'Utilities' | 'Mechanic Allowances' | 'Spare Parts Procurement' | 'Miscellaneous';
  description: string;
  amount: number;
  date: string;
  recordedBy: string;
}

const mockExpenses: ExpenseItem[] = [
  { id: '1', category: 'Rent', description: 'Uttara Plot #197 Monthly Workshop Premises Rent', amount: 85000, date: '2026-08-01', recordedBy: 'Mamun Director' },
  { id: '2', category: 'Spare Parts Procurement', description: 'Bulk Engine Oil & Filter Purchase from RahimAfrooz', amount: 45000, date: '2026-08-03', recordedBy: 'Admin User' },
  { id: '3', category: 'Utilities', description: 'DESCO Commercial Electricity Bill', amount: 18500, date: '2026-08-05', recordedBy: 'Tareq Accountant' },
  { id: '4', category: 'Mechanic Allowances', description: 'Weekly Overtime Commission for Samim & Sagor', amount: 12000, date: '2026-08-06', recordedBy: 'Mamun Director' },
];

function ExpensesContent() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(mockExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const [category, setCategory] = useState<ExpenseItem['category']>('Miscellaneous');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newExpense: ExpenseItem = {
      id: Date.now().toString(),
      category,
      description,
      amount: parseFloat(amount),
      date,
      recordedBy: 'Admin User'
    };

    setExpenses(prev => [newExpense, ...prev]);
    setIsModalOpen(false);
    setDescription('');
    setAmount('');

    setToastMessage(`✓ Expense ৳ ${parseFloat(amount).toLocaleString()} logged successfully!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      if (selectedCategory !== 'All' && exp.category !== selectedCategory) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return exp.description.toLowerCase().includes(term) || exp.category.toLowerCase().includes(term);
      }
      return true;
    });
  }, [expenses, selectedCategory, searchTerm]);

  const totalExpenseAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-800 dark:text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 space-x-1 mb-1">
            <Link href="/dashboard" prefetch={false} className="hover:underline">Dashboard</Link>
            <span>&gt;</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Daily Expenses</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Expense Tracker & Logger</h1>
          <p className="text-xs text-slate-500 mt-0.5">Record daily workshop operational costs, rent, utilities, and spare parts procurement expenses.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition shadow-xs flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log New Expense</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Expense Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Logged Expenses</span>
          <div className="text-xl font-extrabold text-rose-600 font-mono">
            ৳ {totalExpenseAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Current Month Premises Rent</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">৳ 85,000.00</div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Parts Procurement Spend</span>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">৳ 45,000.00</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar pb-1">
          {(['All', 'Rent', 'Utilities', 'Mechanic Allowances', 'Spare Parts Procurement', 'Miscellaneous'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search expenses..." 
            aria-label="Filter expenses"
            className="w-56 py-2 px-3 pl-9 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-1 focus:ring-rose-500" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Recorded By</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-sans">
              {filteredExpenses.map(exp => (
                <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
                  <td className="py-3.5 px-4 font-mono text-slate-500">{exp.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 rounded font-bold text-[10px]">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">{exp.description}</td>
                  <td className="py-3.5 px-4 text-slate-500">{exp.recordedBy}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600">
                    ৳ {exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 text-slate-800 dark:text-slate-100">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Log New Operational Expense</h3>
            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Category *</label>
                <select className="w-full h-9 px-3 border border-slate-300 rounded-lg outline-none bg-transparent" value={category} onChange={e => setCategory(e.target.value as any)}>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Mechanic Allowances">Mechanic Allowances</option>
                  <option value="Spare Parts Procurement">Spare Parts Procurement</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Expense Description *</label>
                <input type="text" placeholder="e.g., DESCO electricity bill payment" className="w-full h-9 px-3 border border-slate-300 rounded-lg outline-none bg-transparent" value={description} onChange={e => setDescription(e.target.value)} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Amount (৳) *</label>
                  <input type="number" placeholder="18500" className="w-full h-9 px-3 border border-slate-300 rounded-lg outline-none bg-transparent font-mono" value={amount} onChange={e => setAmount(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Date *</label>
                  <input type="date" className="w-full h-9 px-3 border border-slate-300 rounded-lg outline-none bg-transparent font-mono" value={date} onChange={e => setDate(e.target.value)} required />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExpensesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading expense tracker...</div>}>
      <ExpensesContent />
    </Suspense>
  );
}
