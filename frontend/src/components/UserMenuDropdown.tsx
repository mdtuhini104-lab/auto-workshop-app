'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Settings, ShieldCheck, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

function UserMenuDropdownContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userState, setUserState] = useState({
    name: 'Admin User',
    email: 'admin@mamunautomobiles.com',
    role: 'System Admin',
    initials: 'AU'
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read user details and saved theme preference from local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && typeof parsed === 'object') {
            const name = parsed.name || 'Admin User';
            const email = parsed.email || 'admin@mamunautomobiles.com';
            const role = parsed.role || 'System Admin';
            const initials = typeof name === 'string' && name.trim() ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'AU';
            setUserState({ name, email, role, initials });
          }
        } catch (e) {
          console.warn('Failed to parse auth_user from localStorage', e);
        }
      }

      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || document.documentElement.classList.contains('dark')) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Persistent Theme toggle handler
  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  // Explicit route navigation handler
  const handleNavigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  // Secure Sign out & Session Clearance handler
  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('auth_user');
    }
    setIsOpen(false);
    showToast('✓ Logged out successfully!', 'success');
    setTimeout(() => {
      router.push('/login');
    }, 500);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition focus:outline-none cursor-pointer select-none"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {userState.initials}
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 absolute bottom-0 right-0" />
        </div>

        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden sm:inline-block">
          {userState.name}
        </span>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Card Popover */}
      {isOpen && (
        <div className="w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 space-y-2 z-50 absolute right-0 top-11 font-sans text-xs">
          {/* User Header Card */}
          <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">{userState.name}</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 rounded font-bold text-[10px]">
                {userState.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{userState.email}</p>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5 pt-1">
            <button
              onClick={() => handleNavigate('/settings/profile')}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition text-left cursor-pointer"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>👤 My Profile</span>
            </button>

            <button
              onClick={() => handleNavigate('/settings')}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition text-left cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>⚙️ Workshop Settings</span>
            </button>

            <button
              onClick={() => handleNavigate('/settings/security')}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition text-left cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>🔒 Security & Password</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-400" />}
                <span>{isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">{isDarkMode ? 'Dark' : 'Light'}</span>
            </button>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700/60 pt-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold transition text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>🚪 Sign Out / Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserMenuDropdown() {
  return (
    <Suspense fallback={<div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />}>
      <UserMenuDropdownContent />
    </Suspense>
  );
}
