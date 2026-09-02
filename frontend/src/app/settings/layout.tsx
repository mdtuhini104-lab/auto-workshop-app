'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Sliders, ChevronDown, ChevronRight } from 'lucide-react';

export default function SettingsWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [advancedMode, setAdvancedMode] = useState(false);
  const [isAccountsOpen, setIsAccountsOpen] = useState(true);

  const accountsSubItems = [
    { label: 'Emails', href: '/settings/accounts/emails', icon: '📧' },
    { label: 'Calendars', href: '/settings/accounts/calendars', icon: '📅' },
    { label: 'WhatsApp', href: '/settings/accounts/whatsapp', icon: '💬' },
    { label: 'Telegram', href: '/settings/accounts/telegram', icon: '✈️' },
    { label: 'SMS', href: '/settings/accounts/sms', icon: '✉️' },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 font-sans overflow-hidden">
      {/* Left Column: Dedicated Settings Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col p-4 space-y-5 select-none shrink-0">
        {/* Top Header: Exit Settings */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
          <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#004e89]" />
            Settings
          </span>
          <Link
            href="/dashboard"
            prefetch={false}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Exit Settings</span>
          </Link>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 hide-scrollbar">
          {/* Group 1: SETTINGS */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
              SETTINGS
            </h3>
            <div className="space-y-0.5">
              <Link
                href="/settings"
                prefetch={false}
                className={`block px-3 py-1.5 rounded-lg text-xs transition ${
                  pathname === '/settings' || pathname === '/settings/profile'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                }`}
              >
                Organization
              </Link>
              <Link
                href="/settings/users"
                prefetch={false}
                className={`block px-3 py-1.5 rounded-lg text-xs transition ${
                  pathname === '/settings/users' || pathname === '/peoples/users'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                }`}
              >
                Users & Staff
              </Link>
              <Link
                href="/settings/experience"
                prefetch={false}
                className={`block px-3 py-1.5 rounded-lg text-xs transition ${
                  pathname === '/settings/experience'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                }`}
              >
                Experience
              </Link>

              {/* Accordion: @ Accounts */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsAccountsOpen(!isAccountsOpen)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/40 rounded-lg transition"
                >
                  <span className="flex items-center gap-1.5">@ Accounts</span>
                  {isAccountsOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>

                {isAccountsOpen && (
                  <div className="mt-0.5 space-y-0.5 pl-3 border-l border-slate-100 dark:border-slate-700/60 ml-3">
                    {accountsSubItems.map((acc) => {
                      const isActive = pathname === acc.href;
                      return (
                        <Link
                          key={acc.href}
                          href={acc.href}
                          prefetch={false}
                          className={`flex items-center gap-2 px-2.5 py-1 rounded-md text-xs transition ${
                            isActive
                              ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                          }`}
                        >
                          <span className="text-xs">{acc.icon}</span>
                          <span>{acc.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <Link
                href="/settings/backup"
                prefetch={false}
                className={`block px-3 py-1.5 rounded-lg text-xs transition ${
                  pathname === '/settings/backup'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                }`}
              >
                Backup
              </Link>
              <Link
                href="/settings/roles"
                prefetch={false}
                className={`block px-3 py-1.5 rounded-lg text-xs transition ${
                  pathname === '/settings/roles'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                }`}
              >
                Permissions
              </Link>
            </div>
          </div>

          {/* Group 2: ACCOUNTS */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
              ACCOUNTS
            </h3>
            <div className="space-y-0.5">
              <Link
                href="/settings/tax"
                prefetch={false}
                className={`block px-3 py-1.5 rounded-lg text-xs transition ${
                  pathname === '/settings/tax'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                }`}
              >
                Tax
              </Link>
              <Link
                href="/settings/payment-methods"
                prefetch={false}
                className={`block px-3 py-1.5 rounded-lg text-xs transition ${
                  pathname === '/settings/payment-methods'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                }`}
              >
                Payment Methods
              </Link>
              <Link
                href="/settings/preferences"
                prefetch={false}
                className={`block px-3 py-1.5 rounded-lg text-xs transition ${
                  pathname === '/settings/preferences'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                }`}
              >
                Preferences
              </Link>
            </div>
          </div>

          {/* Group 3: QUOTATIONS */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
              QUOTATIONS
            </h3>
            <div className="space-y-0.5">
              <Link
                href="/settings/cover-letter"
                prefetch={false}
                className={`block px-3 py-1.5 rounded-lg text-xs transition ${
                  pathname === '/settings/cover-letter'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                }`}
              >
                Cover Letter
              </Link>
              <Link
                href="/settings/tos"
                prefetch={false}
                className={`block px-3 py-1.5 rounded-lg text-xs transition ${
                  pathname === '/settings/tos'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                }`}
              >
                TOS
              </Link>
            </div>
          </div>

          {/* Group 4: NOTIFICATIONS */}
          <div className="space-y-1">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
              NOTIFICATIONS
            </h3>
            <div className="space-y-0.5">
              <Link
                href="/settings/notifications"
                prefetch={false}
                className={`block px-3 py-1.5 rounded-lg text-xs transition ${
                  pathname === '/settings/notifications'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                }`}
              >
                General
              </Link>
              <Link
                href="/settings/members"
                prefetch={false}
                className={`block px-3 py-1.5 rounded-lg text-xs transition ${
                  pathname === '/settings/members'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                }`}
              >
                Members
              </Link>
              <Link
                href="/settings/security"
                prefetch={false}
                className={`block px-3 py-1.5 rounded-lg text-xs transition ${
                  pathname === '/settings/security'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900'
                }`}
              >
                Security
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer: Advanced Switch */}
        <div className="border-t border-slate-100 dark:border-slate-700/60 pt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 shrink-0">
          <span className="font-semibold">Advanced:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={advancedMode}
              onChange={(e) => setAdvancedMode(e.target.checked)}
            />
            <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#004e89]"></div>
          </label>
        </div>
      </aside>

      {/* Right Column: Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-900">
        {children}
      </main>
    </div>
  );
}
