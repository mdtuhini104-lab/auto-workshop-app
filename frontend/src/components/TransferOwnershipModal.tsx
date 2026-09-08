'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';

interface CustomerOption {
  id: number | string;
  customer_name?: string;
  name?: string;
  phone?: string;
  email?: string;
}

interface TransferOwnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    id: number;
    plate_number: string;
    brand: string;
    model: string;
    year?: string | number;
    chassis_number?: string;
    engine_number?: string;
    color?: string;
    current_owner_id?: number | string;
    customer_name?: string;
    customer_phone?: string;
  } | null;
  onSuccess?: () => void;
}

export default function TransferOwnershipModal({
  isOpen,
  onClose,
  vehicle,
  onSuccess
}: TransferOwnershipModalProps) {
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [transferDate, setTransferDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [transferReason, setTransferReason] = useState<string>('Sold to New Buyer');
  const [transferReference, setTransferReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    // Reset state
    setSelectedCustomerId('');
    setTransferDate(new Date().toISOString().split('T')[0]);
    setTransferReason('Sold to New Buyer');
    setTransferReference('');
    setNotes('');
    setSearchFilter('');
    setIsConfirmOpen(false);
    setErrorMsg('');

    const loadCustomers = async () => {
      try {
        const res = await fetchApi('/api/api_customers.php?action=get_customers');
        if (res && res.success && Array.isArray(res.data)) {
          setCustomers(res.data);
        } else if (Array.isArray(res)) {
          setCustomers(res);
        }
      } catch (err) {
        console.error('Failed to load customers', err);
      }
    };
    loadCustomers();
  }, [isOpen, vehicle]);

  if (!isOpen || !vehicle) return null;

  const currentOwnerName = vehicle.customer_name || 'Unassigned / Company Owned';
  const currentOwnerId = vehicle.current_owner_id;

  // Filter out the current owner so user doesn't re-transfer to same person
  const eligibleCustomers = customers.filter(c => {
    const cId = String(c.id);
    const currId = currentOwnerId ? String(currentOwnerId) : '';
    if (currId && cId === currId) return false;

    const name = (c.name || c.customer_name || '').toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    const q = searchFilter.toLowerCase();
    return name.includes(q) || phone.includes(q);
  });

  const selectedCustomerObj = customers.find(c => String(c.id) === String(selectedCustomerId));

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!selectedCustomerId) {
      setErrorMsg('Please select the new customer/owner.');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleExecuteTransfer = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        action: 'transfer_ownership',
        vehicle_id: vehicle.id,
        new_customer_id: Number(selectedCustomerId),
        transfer_date: transferDate,
        transfer_reason: transferReason,
        transfer_reference: transferReference,
        notes: notes
      };

      const res = await fetchApi('/api/api_ownership_transfer.php?action=transfer_ownership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res && (res.success || res.transfer_id)) {
        setIsConfirmOpen(false);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setErrorMsg(res?.error || 'Failed to complete ownership transfer.');
        setIsConfirmOpen(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while transferring ownership.');
      setIsConfirmOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold">Transfer Vehicle Ownership</h2>
              <p className="text-xs text-slate-400">Seamless atomic transfer with historical audit log</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleOpenConfirm} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Vehicle & Current Owner Snapshot */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Vehicle Specification</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{vehicle.brand} {vehicle.model} ({vehicle.year || 'N/A'})</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                  {vehicle.plate_number}
                </span>
                {vehicle.color && <span className="text-xs text-slate-500">• {vehicle.color}</span>}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Registered Owner</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{currentOwnerName}</p>
              {vehicle.customer_phone && (
                <p className="text-xs text-slate-500 font-mono mt-1">Contact: {vehicle.customer_phone}</p>
              )}
            </div>
          </div>

          {/* Critical Accounting Callout Warning */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-semibold block mb-0.5 text-amber-950">Strict Accounting Integrity Protection:</strong>
              Previous customer invoices, payments, ledger entries, and accounting balances will remain strictly unchanged and pinned to the previous owner. Future job cards and invoices will be routed to the new owner.
            </div>
          </div>

          {/* New Customer Search & Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select New Owner (Customer) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Filter customer by name or phone..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full text-xs py-2 px-3 pl-8 rounded-lg border border-slate-200 mb-2 focus:border-blue-500 outline-none"
              />
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full text-sm font-medium py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none bg-white text-slate-800"
              required
            >
              <option value="">-- Choose New Owner --</option>
              {eligibleCustomers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.customer_name} {c.phone ? `(${c.phone})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Transfer Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Effective Transfer Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={transferDate}
                onChange={(e) => setTransferDate(e.target.value)}
                className="w-full text-sm py-2 px-3 rounded-xl border border-slate-300 focus:border-blue-600 outline-none text-slate-800 font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                BRTA / Transfer Ref No
              </label>
              <input
                type="text"
                placeholder="e.g. BRTA-TRF-90214"
                value={transferReference}
                onChange={(e) => setTransferReference(e.target.value)}
                className="w-full text-sm py-2 px-3 rounded-xl border border-slate-300 focus:border-blue-600 outline-none text-slate-800"
              />
            </div>
          </div>

          {/* Reason & Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Transfer Reason
            </label>
            <select
              value={transferReason}
              onChange={(e) => setTransferReason(e.target.value)}
              className="w-full text-sm py-2 px-3 rounded-xl border border-slate-300 focus:border-blue-600 outline-none text-slate-800"
            >
              <option value="Sold to New Buyer">Sold to New Buyer</option>
              <option value="Corporate Fleet Reallocation">Corporate Fleet Reallocation</option>
              <option value="Family / Relative Transfer">Family / Relative Transfer</option>
              <option value="Lease / Bank Return">Lease / Bank Return</option>
              <option value="Other / Correction">Other / Correction</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Internal Notes / Remarks
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Verified registration certificate and buyer agreement copy..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 focus:border-blue-600 outline-none text-slate-800"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedCustomerId || isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Proceed to Transfer
            </button>
          </div>
        </form>

        {/* Confirmation Modal Overlay */}
        {isConfirmOpen && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-6 z-20 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Confirm Ownership Transfer</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to transfer <strong className="text-slate-800">{vehicle.plate_number}</strong> from <strong className="text-slate-800">{currentOwnerName}</strong> to <strong className="text-blue-700">{selectedCustomerObj?.name || selectedCustomerObj?.customer_name}</strong>?
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl text-left text-xs space-y-1 font-medium text-slate-600 border border-slate-200">
                <div className="flex justify-between">
                  <span>Transfer Date:</span>
                  <span className="font-mono text-slate-900">{transferDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reason:</span>
                  <span className="text-slate-900">{transferReason}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ledger Status:</span>
                  <span className="text-emerald-700 font-semibold">Previous Ledgers Isolated</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsConfirmOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleExecuteTransfer}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Executing Transfer...
                    </>
                  ) : (
                    'Confirm & Commit'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
