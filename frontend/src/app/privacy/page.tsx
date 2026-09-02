import React, { Suspense } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

function PrivacyContent() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 rounded-xl text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Effective Date: August 2026 — Mamun Automobiles ERP</p>
            </div>
          </div>
          <Link
            href="/login"
            prefetch={false}
            className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700/60 space-y-6">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Data Collection & Scope</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              We collect information necessary to operate the workshop platform efficiently, including vehicle registration numbers, customer contact information, billing records, and system usage analytics.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. How Information is Used</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Collected data is strictly utilized for generating quotations, managing job cards, processing invoices, tracking inventory, and sending automated service alerts via SMS/Email/WhatsApp.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Security & Protection</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              All data transmitted is encrypted using standard SSL/TLS protocols. Access controls restrict sensitive financial and user administrative details only to authorized system roles.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Cookies & Local Storage</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              We store session tokens and UI state preferences (such as dark mode) locally in browser storage to ensure high performance and offline resilience.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400 flex items-center justify-between">
            <span>© 2026 Mamun Automobiles. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="/terms" prefetch={false} className="hover:underline text-emerald-600 dark:text-emerald-400">Terms of Service</Link>
              <Link href="/privacy" prefetch={false} className="hover:underline text-emerald-600 dark:text-emerald-400">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold">Loading Privacy Policy...</div>}>
      <PrivacyContent />
    </Suspense>
  );
}
