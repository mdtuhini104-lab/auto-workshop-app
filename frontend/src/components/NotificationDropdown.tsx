'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/utils/api';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Workshops' | 'Finance' | 'Inventory';
  type: 'info' | 'success' | 'warning' | 'finance';
  timestamp: string;
  isRead: boolean;
  linkHref: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Inspection Completed',
    message: 'Toyota Prado (Dhaka Metro Ga-13-8851) inspection completed by Rahim Mechanic.',
    category: 'Workshops',
    type: 'success',
    timestamp: '5 mins ago',
    isRead: false,
    linkHref: '/quotations/inspections'
  },
  {
    id: 'n2',
    title: 'Low Stock Alert',
    message: 'Brake Pad (Toyota Prado) stock running low (2 items remaining).',
    category: 'Inventory',
    type: 'warning',
    timestamp: '25 mins ago',
    isRead: false,
    linkHref: '/inventory'
  },
  {
    id: 'n3',
    title: 'Invoice Payment Received',
    message: 'Invoice #INV-2026-089 paid ৳ 12,500.00 via Bkash.',
    category: 'Finance',
    type: 'finance',
    timestamp: '1 hour ago',
    isRead: false,
    linkHref: '/billing'
  },
  {
    id: 'n4',
    title: 'Work Order Assigned',
    message: 'Work Order #WO-2026-042 assigned to Kamal Hossain.',
    category: 'Workshops',
    type: 'info',
    timestamp: '2 hours ago',
    isRead: true,
    linkHref: '/quotations/orders'
  }
];

const READ_STORAGE_KEY = 'mamun_erp_read_notifications';

function getStoredReadIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    if (!raw || raw === 'undefined' || raw === 'null') return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse read notification IDs from localStorage:', error);
    return [];
  }
}

function saveStoredReadIds(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error('Failed to save read notification IDs to localStorage:', error);
  }
}

function NotificationDropdownContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Workshops' | 'Finance' | 'Inventory'>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initial page load / refresh hydration
  useEffect(() => {
    const readIds = getStoredReadIds();
    setNotifications(prev =>
      prev.map(n => ({
        ...n,
        isRead: n.isRead || readIds.includes(n.id)
      }))
    );
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    // 1. Optimistic UI update
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );

    // 2. Persist in localStorage
    const storedIds = getStoredReadIds();
    if (!storedIds.includes(id)) {
      saveStoredReadIds([...storedIds, id]);
    }

    // 3. Backend API call
    try {
      await fetchApi(`/api/notifications/${id}/read`, { method: 'PATCH' });
    } catch (err) {
      console.warn(`Failed to sync read status for notification ${id} to server:`, err);
    }
  };

  const markAllAsRead = async () => {
    // 1. Optimistic UI update
    const allIds = notifications.map(n => n.id);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

    // 2. Persist all notification IDs in localStorage
    const storedIds = getStoredReadIds();
    const updatedIds = Array.from(new Set([...storedIds, ...allIds]));
    saveStoredReadIds(updatedIds);

    // 3. Backend API call
    try {
      await fetchApi('/api/notifications/read-all', { method: 'PATCH' });
    } catch (err) {
      console.warn('Failed to sync mark all read to server:', err);
    }
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'Unread') return !n.isRead;
    if (activeTab !== 'All') return n.category === activeTab;
    return true;
  });

  const getTypeBadgeIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'warning':
        return (
          <span className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center shrink-0">
            ⚠️
          </span>
        );
      case 'success':
        return (
          <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0">
            ✓
          </span>
        );
      case 'finance':
        return (
          <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 font-bold flex items-center justify-center shrink-0">
            ৳
          </span>
        );
      default:
        return (
          <span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center shrink-0">
            ℹ️
          </span>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors focus:outline-none"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden text-slate-800 dark:text-slate-100">
          {/* Header Controls */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold hover:underline"
              >
                Mark all read
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={clearAll}
                className="text-slate-400 hover:text-rose-600 font-medium"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-2 border-b border-slate-100 dark:border-slate-700/60 overflow-x-auto text-[11px] hide-scrollbar">
            {(['All', 'Unread', 'Workshops', 'Finance', 'Inventory'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Notification Items List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(item => (
                <Link
                  key={item.id}
                  href={item.linkHref}
                  prefetch={false}
                  onClick={() => {
                    markAsRead(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-start gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors ${
                    !item.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                  }`}
                >
                  {getTypeBadgeIcon(item.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                  )}
                </Link>
              ))
            ) : (
              <div className="py-12 text-center space-y-2 p-4">
                <div className="text-3xl">🔔</div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">No notifications found</p>
                <p className="text-[11px] text-slate-400">All alerts and updates will show up here.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function NotificationDropdown() {
  return (
    <Suspense fallback={<div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 animate-pulse" />}>
      <NotificationDropdownContent />
    </Suspense>
  );
}

