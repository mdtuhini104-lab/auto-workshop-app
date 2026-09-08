'use client';

import dynamic from 'next/dynamic';

const UsersManagementPage = dynamic(() => import('@/app/peoples/users/page'), {
  ssr: false,
  loading: () => <div className="p-8 text-xs text-slate-400">Loading users...</div>,
});

export default function SettingsUsersPage() {
  return <UsersManagementPage />;
}
