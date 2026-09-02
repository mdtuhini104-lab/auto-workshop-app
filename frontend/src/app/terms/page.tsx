import React, { Suspense } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

function TermsContent() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Last updated: August 2026 — Mamun Automobiles ERP</p>
            </div>
          </div>
          <Link
            href="/login"
            prefetch={false}
            className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700/60 space-y-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              By accessing or using the Mamun Automobiles Enterprise Workshop Management System, you agree to comply with and be bound by these Terms of Service. If you do not agree, please refrain from using the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. User Account & Security</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Users are responsible for maintaining the confidentiality of their credentials and account actions. Any unauthorized access must be reported to system administration immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Data & Privacy</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              All financial transactions, job cards, vehicle records, and customer details processed through this platform are stored securely under strict access controls. Refer to our Privacy Policy for details.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. System Availability</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              While we aim for 99.9% uptime, routine maintenance and updates may occur. Local storage caching ensures offline operation safety during brief connectivity disruptions.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400 flex items-center justify-between">
            <span>© 2026 Mamun Automobiles. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="/privacy" prefetch={false} className="hover:underline text-blue-600 dark:text-blue-400">Privacy Policy</Link>
              <Link href="/terms" prefetch={false} className="hover:underline text-blue-600 dark:text-blue-400">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold">Loading Terms of Service...</div>}>
      <TermsContent />
    </Suspense>
  );
}
