'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Expense } from '@/types/erp';
import { INITIAL_EXPENSES } from '@/data/initialMockData';

export default function CreateExpensePage() {
  const router = useRouter();

  const [category, setCategory] = useState('Electricity & Utility');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Petty Cash');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim() || amount <= 0) {
      alert('Please fill out Description and valid Amount.');
      return;
    }

    const newExpense: Expense = {
      id: `EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
      date,
      category,
      description,
      amount,
      paymentMode,
      approvedBy: 'Workshop Manager',
    };

    const saved = localStorage.getItem('erp_expenses');
    const existing: Expense[] = saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    const updated = [newExpense, ...existing];
    localStorage.setItem('erp_expenses', JSON.stringify(updated));

    router.push('/accounts/expenses');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          &larr; Back to Expenses
        </button>
        <h1 className="text-xl font-bold text-slate-900">Record Daily Expense Voucher</h1>
        <div className="w-16" />
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#004e89] border-b border-slate-100 pb-2">
          Expense Voucher Specifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Expense Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            >
              <option value="Electricity & Utility">Electricity & Utility</option>
              <option value="Tea & Refreshment">Tea & Refreshment</option>
              <option value="Workshop Maintenance & Rent">Workshop Maintenance & Rent</option>
              <option value="Staff Conveyance">Staff Conveyance</option>
              <option value="Stationery & Printing">Stationery & Printing</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Voucher Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700">Description / Particulars *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="e.g. Uttara Workshop Electricity Bill - July"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Amount (৳) *</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-900 font-medium"
            >
              <option value="Petty Cash">Petty Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="bKash / Mobile Banking">bKash / Mobile Banking</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-white text-slate-700 border border-slate-300 font-semibold rounded-lg text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#004e89] hover:bg-[#003d6c] text-white font-bold rounded-lg text-sm transition-colors shadow-sm"
          >
            Save Expense Voucher
          </button>
        </div>
      </form>
    </div>
  );
}
