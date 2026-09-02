'use client';

import React, {  useEffect, useState , Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Expense } from '@/types/erp';
import { INITIAL_EXPENSES } from '@/data/initialMockData';

function ExpenseViewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id') || 'EXP-2026-081';

  const [expense, setExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('erp_expenses');
    const expenses: Expense[] = saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    const found = expenses.find((e) => e.id === id) || expenses[0];
    setExpense(found);
  }, [id]);

  if (!expense) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="px-3.5 py-1.5 bg-white text-slate-700 border border-slate-300 shadow-xs rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          &larr; Back to Expenses
        </button>
        <div className="flex items-center gap-2">
          <Link prefetch={false} href={`/accounts/expenses/print?id=${expense.id}`}
            className="px-4 py-1.5 bg-[#003d6c] text-white font-medium rounded text-sm hover:bg-[#002d50] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            Print Expense Voucher
          </Link>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm">
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">{expense.id}</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Expense Payment Voucher
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-bold uppercase rounded-full bg-rose-100 text-rose-800 border border-rose-300">
            {expense.category}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs">
          <div>
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Voucher Date</p>
            <p className="font-mono text-slate-900 font-bold text-sm">{expense.date}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Payment Mode</p>
            <p className="font-semibold text-slate-800 text-sm">{expense.paymentMode}</p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Approved By</p>
            <p className="font-semibold text-slate-800 text-sm">{expense.approvedBy}</p>
          </div>
        </div>

        <div className="space-y-1 bg-slate-50 p-4 rounded-lg border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase">Particulars / Description</p>
          <p className="text-sm font-semibold text-slate-900">{expense.description}</p>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase">Voucher Total</p>
          <div className="flex justify-between items-center">
            <span className="text-slate-700 text-sm font-medium">Total Paid Amount:</span>
            <span className="text-2xl font-black font-mono text-rose-600">
              ৳ {expense.amount.toLocaleString('en-BD')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function ExpenseViewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <ExpenseViewPageContent />
    </Suspense>
  );
}
