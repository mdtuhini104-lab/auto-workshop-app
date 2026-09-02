'use client';

import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface QuickCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: (newCustomer: { id: string; name: string; phone: string }) => void;
}

export default function QuickCustomerModal({ isOpen, onClose, onCustomerCreated }: QuickCustomerModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const id = Date.now().toString();
    const newCust = { id, name, phone, email, address };

    // Persist to localStorage
    const saved = localStorage.getItem('master_customers');
    let existing: any[] = [];
    if (saved) {
      try { existing = JSON.parse(saved); } catch (err) {}
    }
    const updated = [newCust, ...existing];
    localStorage.setItem('master_customers', JSON.stringify(updated));

    onCustomerCreated({ id, name: `${name} (${phone})`, phone });
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            <h3 className="font-bold text-sm">Quick Add Customer</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-white/20 rounded cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
            <input 
              required 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Karim Ahmed" 
              className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
            <input 
              required 
              type="text" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="e.g. 01711000000" 
              className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="e.g. karim@gmail.com" 
              className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Address</label>
            <input 
              type="text" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              placeholder="e.g. House 12, Road 5, Uttara" 
              className="w-full text-xs p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer">Save Customer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
