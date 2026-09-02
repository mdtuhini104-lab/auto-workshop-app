'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Lock, Users, Plus, ShieldCheck, ChevronRight } from 'lucide-react';

function PermissionsHubContent() {
  return (
    <div className="space-y-6 max-w-5xl text-slate-800 dark:text-slate-100 font-sans">
      {/* Breadcrumb Header */}
      <div className="text-xs text-slate-500 space-x-1">
        <Link href="/settings" prefetch={false} className="hover:underline">Settings</Link>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">Permissions</span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Permissions</h1>
        <p className="text-xs text-slate-500 mt-1">Manage user permissions and designation templates</p>
      </div>

      {/* Top Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Permission Templates */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Permission Templates</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create and manage designation templates (Manager, Sales Executive, Accounts, Senior Technician, etc.)
            </p>
          </div>

          <Link
            href="/settings/permissions/templates"
            prefetch={false}
            className="w-full py-2.5 bg-[#004e89] hover:bg-[#003d6c] text-white font-bold rounded-lg text-xs transition shadow-xs flex items-center justify-center gap-2 mt-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Manage Templates</span>
          </Link>
        </div>

        {/* Card 2: User Permissions */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">User Permissions</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Assign templates and customize permissions for individual workshop staff members and admins.
            </p>
          </div>

          <Link
            href="/peoples/users"
            prefetch={false}
            className="w-full py-2.5 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-xs transition shadow-xs flex items-center justify-center gap-2 mt-2"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Go to Users</span>
          </Link>
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Quick Actions</h2>
          <p className="text-xs text-slate-500 mt-0.5">Common permission management tasks</p>
        </div>

        <div className="space-y-2 pt-1">
          <Link
            href="/settings/permissions/templates"
            prefetch={false}
            className="flex items-center justify-between p-3.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  Create New Template
                </span>
                <span className="text-[11px] text-slate-400 block">Define custom role access matrix across all 18 modules</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/peoples/users"
            prefetch={false}
            className="flex items-center justify-between p-3.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  Assign Permissions to Users
                </span>
                <span className="text-[11px] text-slate-400 block">Map staff members to specific permission templates</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PermissionsHubPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading permissions hub...</div>}>
      <PermissionsHubContent />
    </Suspense>
  );
}
