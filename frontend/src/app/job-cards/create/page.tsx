'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function CreateJobCardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromQuotation = searchParams.get('fromQuotation');
  const fromQuote = searchParams.get('fromQuote');
  const rawData = searchParams.get('data');

  const [activeStep, setActiveStep] = useState<'customer' | 'items' | 'summary'>('customer');
  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [mechanic, setMechanic] = useState('Samim (Senior AC Technician)');
  const [tasks, setTasks] = useState('1. AC Gas Refill & Compressor Pressure Test\n2. Synthetic Engine Oil & Filter Change');
  const [partsUsed, setPartsUsed] = useState('Bosch Engine Oil 4L (PRT-8821), Air Filter (PRT-7719)');
  const [isSaved, setIsSaved] = useState(false);

  const customersList = [
    { id: '1', name: 'John Doe (01711223344)' },
    { id: '2', name: 'Sarah Smith (01855667788)' },
    { id: '3', name: 'Europetex Limited (01711-889900)' },
  ];

  const vehiclesList = [
    { id: '1', customerId: '1', name: 'Toyota Corolla (DHK-12-3456)' },
    { id: '2', customerId: '1', name: 'Honda CR-V (DHK-77-1122)' },
    { id: '3', customerId: '2', name: 'Nissan X-Trail (CTG-44-8899)' },
    { id: '4', customerId: '3', name: 'DHK-METRO-GA-13-8851 (Toyota Prado)' },
  ];

  useEffect(() => {
    let payload: any = null;

    if (rawData) {
      try {
        payload = JSON.parse(decodeURIComponent(rawData));
      } catch (e) {}
    }

    if (!payload) {
      const stored = sessionStorage.getItem('convert_quotation') || sessionStorage.getItem('conversion_payload');
      if (stored) {
        try {
          payload = JSON.parse(stored);
        } catch (e) {}
      }
    }

    if (payload) {
      setCustomerId(payload.customerId || '3');
      setVehicleId(payload.vehicleId || '4');

      if (payload.items && Array.isArray(payload.items)) {
        const serviceTasks = payload.items
          .filter((i: any) => i.type === 'Service')
          .map((i: any, idx: number) => `${idx + 1}. ${i.name || i.description}`)
          .join('\n');
        const parts = payload.items
          .filter((i: any) => i.type === 'Part')
          .map((i: any) => `${i.name || i.description} (${i.qty} ${i.unit || 'Pcs'})`)
          .join(', ');

        if (serviceTasks) setTasks(serviceTasks);
        if (parts) setPartsUsed(parts);
      }
      return;
    }

    if (fromQuotation || fromQuote) {
      setCustomerId('3');
      setVehicleId('4');
    }
  }, [fromQuotation, fromQuote, rawData]);

  const filteredVehicles = React.useMemo(() => {
    if (!customerId) return [];
    return vehiclesList.filter(v => v.customerId === customerId);
  }, [customerId]);

  const handleCustomerChange = (newCustId: string) => {
    setCustomerId(newCustId);
    setVehicleId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      router.push('/job-cards');
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto text-slate-800 dark:text-slate-100 font-sans">
      <div className="text-xs text-slate-500 space-x-1">
        <Link href="/job-cards" prefetch={false} className="hover:underline">Job Cards</Link>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">New Job Card</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Create New Work Order Job Card</h1>
        <p className="text-xs text-slate-500 mt-1">Assign technician, log service tasks, and specify inventory spare parts used.</p>
      </div>

      {isSaved && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
          ✓ Job Card created successfully! Deducting inventory stock items...
        </div>
      )}

      {/* Multi-step Wizard Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 gap-2">
        <button
          type="button"
          onClick={() => setActiveStep('customer')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
            activeStep === 'customer'
              ? 'border-blue-600 text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Step 1: Customer & Vehicle Selection
        </button>
        <button
          type="button"
          onClick={() => setActiveStep('items')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
            activeStep === 'items'
              ? 'border-blue-600 text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Step 2: Parts & Service Labor Checklist
        </button>
        <button
          type="button"
          onClick={() => setActiveStep('summary')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition ${
            activeStep === 'summary'
              ? 'border-blue-600 text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Step 3: Technical Execution Summary
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
        {activeStep === 'customer' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Select Customer *</label>
              <select className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent" value={customerId} onChange={e => handleCustomerChange(e.target.value)}>
                <option value="">-- Select Customer --</option>
                {customersList.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Select Vehicle *</label>
              <select className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent disabled:opacity-60" value={vehicleId} disabled={!customerId} onChange={e => setVehicleId(e.target.value)}>
                {!customerId ? (
                  <option value="">-- First Select a Customer --</option>
                ) : filteredVehicles.length === 0 ? (
                  <option value="">No vehicles registered for this customer</option>
                ) : (
                  <>
                    <option value="">-- Select Vehicle --</option>
                    {filteredVehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Assign Lead Technician / Mechanic *</label>
              <select className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent" value={mechanic} onChange={e => setMechanic(e.target.value)}>
                <option value="Samim (Senior AC Technician)">Samim (Senior AC Technician)</option>
                <option value="Sagor (Senior Engine Technician)">Sagor (Senior Engine Technician)</option>
                <option value="Kamal Hossain (Suspension Specialist)">Kamal Hossain (Suspension Specialist)</option>
              </select>
            </div>
          </div>
        )}

        {activeStep === 'items' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Service Tasks & Labor Instructions</label>
              <textarea rows={3} className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent" value={tasks} onChange={e => setTasks(e.target.value)} />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Inventory Parts Used (Auto-Stock Deduction)</label>
              <input type="text" className="w-full h-9 px-3 border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent font-mono" value={partsUsed} onChange={e => setPartsUsed(e.target.value)} />
            </div>
          </div>
        )}

        {activeStep === 'summary' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">Job Card Execution Summary</p>
              <p><span className="font-semibold text-slate-600">Customer & Vehicle:</span> {customersList.find(c => c.id === customerId)?.name || 'N/A'} - {filteredVehicles.find(v => v.id === vehicleId)?.name || 'N/A'}</p>
              <p><span className="font-semibold text-slate-600">Assigned Technician:</span> {mechanic}</p>
              <p><span className="font-semibold text-slate-600">Parts Issued:</span> {partsUsed}</p>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <div>
            {activeStep !== 'customer' && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep === 'summary' ? 'items' : 'customer')}
                className="px-4 py-2 border border-slate-300 rounded-lg font-semibold"
              >
                Previous Step
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <Link href="/job-cards" prefetch={false} className="px-4 py-2 border border-slate-300 rounded-lg font-semibold">Cancel</Link>
            {activeStep !== 'summary' ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep === 'customer' ? 'items' : 'summary')}
                className="px-5 py-2 bg-[#004e89] text-white rounded-lg font-bold hover:bg-[#003d6c]"
              >
                Next Step &rarr;
              </button>
            ) : (
              <button type="submit" className="px-5 py-2 bg-[#004e89] text-white rounded-lg font-bold hover:bg-[#003d6c]">Save & Open Job Card</button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CreateJobCardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading form...</div>}>
      <CreateJobCardContent />
    </Suspense>
  );
}

