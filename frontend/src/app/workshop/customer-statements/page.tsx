'use client';

import dynamic from 'next/dynamic';

const CustomerStatementsPage = dynamic(() => import('@/app/customer-statements/page'), {
  ssr: false,
  loading: () => <div className="p-8 text-xs text-slate-400">Loading statements...</div>,
});

export default function WorkshopCustomerStatementsPage() {
  return <CustomerStatementsPage />;
}
