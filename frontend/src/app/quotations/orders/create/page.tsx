'use client';

import {  useState, useMemo, useEffect , Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface LineItem {
  id: string;
  name: string;
  type: 'Part' | 'Service';
  qty: number;
  unit?: string;
}

function CreateWorkOrderPageContent() {
  const searchParams = useSearchParams();
  const fromQuote = searchParams.get('fromQuote');
  const rawData = searchParams.get('data');

  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [mechanicId, setMechanicId] = useState('');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [quotationRef, setQuotationRef] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [isPreFilled, setIsPreFilled] = useState(false);

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

  const filteredVehicles = useMemo(() => {
    if (!customerId) return [];
    return vehiclesList.filter(v => v.customerId === customerId);
  }, [customerId]);

  const handleCustomerChange = (newCustId: string) => {
    setCustomerId(newCustId);
    setVehicleId('');
  };

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
      setQuotationRef(payload.sourceId || fromQuote || '');
      setIsPreFilled(true);
      const custId = payload.customerId || '3';
      const vehId = payload.vehicleId || '4';
      setCustomerId(custId);
      setVehicleId(vehId);

      if (payload.items && Array.isArray(payload.items)) {
        const mappedItems: LineItem[] = payload.items.map((item: any) => ({
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: item.name || item.description || '',
          type: item.type || (item.unit === 'Job' ? 'Service' : 'Part'),
          qty: Number(item.qty) || 1,
          unit: item.unit || (item.type === 'Service' ? 'Job' : 'Pcs'),
        }));
        setLineItems(mappedItems);
      }
      return;
    }

    if (fromQuote) {
      setQuotationRef(fromQuote);
      setIsPreFilled(true);
      setCustomerId('3');
      setVehicleId('4');
      setLineItems([
        { id: '1', name: 'Premium Synthetic Engine Oil (4L)', type: 'Part', qty: 1, unit: 'Ltr' },
        { id: '2', name: 'Oil Filter Assembly (Genuine)', type: 'Part', qty: 1, unit: 'Pcs' },
        { id: '3', name: 'Complete Brake System Overhaul', type: 'Service', qty: 1, unit: 'Job' },
      ]);
    }
  }, [fromQuote, rawData]);

  const handleAddLine = (type: 'Part' | 'Service') => {
    const newItem: LineItem = {
      id: Date.now().toString() + Math.random().toString(),
      name: '',
      type,
      qty: 1,
      unit: type === 'Part' ? 'Pcs' : 'Job'
    };
    setLineItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'name') {
          const lower = String(value).toLowerCase();
          if (lower.includes('oil') || lower.includes('fluid') || lower.includes('coolant')) updated.unit = 'Ltr';
          else if (lower.includes('pad') || lower.includes('shoe')) updated.unit = 'Set';
          else if (lower.includes('filter')) updated.unit = 'Pcs';
        }
        return updated;
      }
      return item;
    }));
  };

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Create Work Order</h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">Assign vehicle repair tasks to mechanics.</p>
        </div>
        <Link href="/quotations/orders" prefetch={false} className="py-1.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
          Back to Work Orders
        </Link>
      </div>

      {/* Pre-filled Banner */}
      {isPreFilled && (
        <div className="mb-3 px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>✓ Pre-filled from Approved Quotation #{quotationRef}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pb-16">
        
        {/* Core Info Grid */}
        <div className="p-3.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Customer</label>
              <select 
                className="w-full h-8 py-1 px-2.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none transition-colors"
                value={customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
              >
                <option value="" className="dark:bg-slate-800">-- Select Customer --</option>
                {customersList.map(c => (
                  <option key={c.id} value={c.id} className="dark:bg-slate-800">{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Vehicle</label>
              <select 
                className="w-full h-8 py-1 px-2.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none transition-colors disabled:opacity-60"
                value={vehicleId}
                disabled={!customerId}
                onChange={(e) => setVehicleId(e.target.value)}
              >
                {!customerId ? (
                  <option value="" className="dark:bg-slate-800">-- First Select a Customer --</option>
                ) : filteredVehicles.length === 0 ? (
                  <option value="" className="dark:bg-slate-800">No vehicles registered for this customer</option>
                ) : (
                  <>
                    <option value="" className="dark:bg-slate-800">-- Select Vehicle --</option>
                    {filteredVehicles.map(v => (
                      <option key={v.id} value={v.id} className="dark:bg-slate-800">{v.name}</option>
                    ))}
                  </>
                )}
              </select>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Quote Reference</label>
              <input 
                type="text" 
                placeholder="e.g. QT-2026-017"
                className="w-full h-8 py-1 px-2.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none transition-colors font-mono"
                value={quotationRef}
                onChange={(e) => setQuotationRef(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Assigned Mechanic</label>
              <select 
                className="w-full h-8 py-1 px-2.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none transition-colors"
                value={mechanicId}
                onChange={(e) => setMechanicId(e.target.value)}
              >
                <option value="" className="dark:bg-slate-800">Select Mechanic</option>
                <option value="m1" className="dark:bg-slate-800">Karim Rahman</option>
                <option value="m2" className="dark:bg-slate-800">Rafiqul Islam</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Target Completion Date</label>
              <input 
                type="date" 
                className="w-full h-8 py-1 px-2.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none transition-colors"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Mock Datalists for Hybrid Entry */}
        <datalist id="master-parts">
          <option value="Engine Oil Filter - Synthetic" />
          <option value="Brake Pads (Front)" />
          <option value="Spark Plugs" />
          <option value="Air Filter" />
        </datalist>
        <datalist id="master-services">
          <option value="General Servicing Labor" />
          <option value="Wheel Alignment" />
          <option value="Custom Bumper Repair" />
          <option value="Full Car Wash" />
        </datalist>

        {/* Hybrid Line Items Table */}
        <div className="p-3.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Approved Parts & Services to Execute</h2>
              <p className="text-[11px] text-slate-500">List items for the mechanic to fulfill.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => handleAddLine('Part')} className="h-7 px-2 text-xs font-medium text-[#004e89] dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Add Part
              </button>
              <button type="button" onClick={() => handleAddLine('Service')} className="h-7 px-2 text-xs font-medium text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/40 rounded transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Add Service
              </button>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="bg-transparent text-slate-500 font-semibold text-[10px] uppercase tracking-wider py-2 px-2 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap w-24">TYPE</th>
                  <th className="bg-transparent text-slate-500 font-semibold text-[10px] uppercase tracking-wider py-2 px-2 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">DESCRIPTION</th>
                  <th className="bg-transparent text-slate-500 font-semibold text-[10px] uppercase tracking-wider py-2 px-2 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap w-20">QTY</th>
                  <th className="bg-transparent text-slate-500 font-semibold text-[10px] uppercase tracking-wider py-2 px-2 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap w-24">UNIT</th>
                  <th className="bg-transparent text-slate-500 font-semibold text-[10px] uppercase tracking-wider py-2 px-2 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap text-center w-10">ACT</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map(item => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-1.5 px-2 border-b border-slate-100 dark:border-slate-800/50">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${item.type === 'Part' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 border-b border-slate-100 dark:border-slate-800/50">
                      <input 
                        type="text"
                        list={item.type === 'Part' ? 'master-parts' : 'master-services'}
                        placeholder={item.type === 'Part' ? "Select or type part..." : "Select or type service..."}
                        className="w-full h-7 py-1 px-2 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#004e89] outline-none transition-colors font-medium"
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      />
                    </td>
                    <td className="py-1.5 px-2 border-b border-slate-100 dark:border-slate-800/50">
                      <input 
                        type="number"
                        min="1"
                        className="w-full h-7 py-1 px-2 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#004e89] outline-none transition-colors font-mono"
                        value={item.qty || ''}
                        onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                      />
                    </td>
                    <td className="py-1.5 px-2 border-b border-slate-100 dark:border-slate-800/50">
                      <input 
                        type="text"
                        name="unit"
                        list="common-units"
                        placeholder="e.g. Ltr, Pcs, Set"
                        aria-label="Unit"
                        className="w-full h-7 py-1 px-2 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#004e89] outline-none transition-colors font-medium"
                        value={item.unit || ''}
                        onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                      />
                    </td>
                    <td className="py-1.5 px-2 border-b border-slate-100 dark:border-slate-800/50 text-center">
                      <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors" title="Remove line">
                        <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {lineItems.length === 0 && (
                  <tr><td colSpan={5} className="py-4 text-center text-xs text-slate-400">No items added to the work order.</td></tr>
                )}
              </tbody>
            </table>
            <datalist id="common-units">
              <option value="Pcs" />
              <option value="Ltr" />
              <option value="Set" />
              <option value="Can" />
              <option value="Box" />
              <option value="Kg" />
              <option value="Meter" />
              <option value="Job" />
              <option value="Hr" />
              <option value="পিস" />
              <option value="লিটার" />
              <option value="সেট" />
            </datalist>
          </div>
        </div>
      </div>

      {/* Sticky Footer Actions */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 h-12 px-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 z-50">
        <Link href="/quotations/orders" prefetch={false} className="h-8 px-4 rounded text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center">
          Cancel
        </Link>
        <button className="h-8 px-4 rounded text-xs font-semibold text-white bg-[#004e89] hover:bg-[#003d6c] transition-colors shadow-sm inline-flex items-center">
          Save Work Order
        </button>
      </div>
    </div>
  );
}



export default function CreateWorkOrderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <CreateWorkOrderPageContent />
    </Suspense>
  );
}
