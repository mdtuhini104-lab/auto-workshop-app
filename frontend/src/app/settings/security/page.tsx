'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';

function SecurityContent() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setFeedback('⚠️ New password and confirmation do not match!');
      return;
    }
    setFeedback('✓ Security settings & password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl text-slate-800 dark:text-slate-100 font-sans">
      <div className="text-xs text-slate-500 space-x-1">
        <Link href="/settings" prefetch={false} className="hover:underline">Settings</Link>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">Security</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Security & Access Protection</h1>
        <p className="text-xs text-slate-500 mt-1">Manage admin account password, two-factor authentication, and session security.</p>
      </div>

      {feedback && (
        <div className={`p-3 rounded-lg text-xs font-semibold ${feedback.includes('✓') ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'}`}>
          {feedback}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/60 pb-2">Change Password</h2>
        <div className="space-y-1">
          <label className="font-bold text-slate-800 dark:text-slate-200">Current Password</label>
          <input 
            type="password" 
            className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-800 dark:text-slate-200">New Password</label>
            <input 
              type="password" 
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-800 dark:text-slate-200">Confirm New Password</label>
            <input 
              type="password" 
              className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/60 pb-2 pt-2">Two-Factor Authentication (2FA)</h2>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Require 2FA Code on Login</span>
            <span className="text-slate-500">Send 6-digit OTP code to admin mobile phone upon login attempt.</span>
          </div>
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            checked={twoFactor}
            onChange={e => setTwoFactor(e.target.checked)}
          />
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button type="submit" className="px-5 py-2 bg-[#004e89] text-white rounded-lg text-xs font-bold hover:bg-[#003d6c]">
            Update Security Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SecurityPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading security settings...</div>}>
      <SecurityContent />
    </Suspense>
  );
}
