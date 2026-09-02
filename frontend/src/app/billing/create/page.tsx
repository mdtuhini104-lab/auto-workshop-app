'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import QuickCustomerModal from '@/components/modals/QuickCustomerModal';
import QuickVehicleModal from '@/components/modals/QuickVehicleModal';

interface LineItem {
  id: string;
  name: string;
  type: 'Part' | 'Service';
  qty: number;
  unitPrice: number;
  total: number;
  unit: string;
}

function CreateBillingContent() {
  const searchParams = useSearchParams();
  const fromWorkOrder = searchParams.get('fromWorkOrder');
  const fromJobCard = searchParams.get('fromJobCard');
  const rawData = searchParams.get('data');

  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [discountType, setDiscountType] = useState<'Flat' | 'Percent'>('Flat');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [refSource, setRefSource] = useState('');
  const [isPreFilled, setIsPreFilled] = useState(false);
  
  const [customers, setCustomers] = useState([
    { id: '1', name: 'John Doe (01711223344)' },
    { id: '2', name: 'Sarah Smith (01855667788)' },
    { id: '3', name: 'Europetex Limited (01711-889900)' }
  ]);
  const [vehicles, setVehicles] = useState([
    { id: '1', customerId: '1', name: 'Toyota Corolla (DHK-12-3456)' },
    { id: '2', customerId: '1', name: 'Honda CR-V (DHK-77-1122)' },
    { id: '3', customerId: '2', name: 'Nissan X-Trail (CTG-44-8899)' },
    { id: '4', customerId: '3', name: 'Toyota Land Cruiser Prado (DHK-METRO-GA-13-8851)' }
  ]);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  useEffect(() => {
    const savedCust = localStorage.getItem('master_customers');
    if (savedCust) {
      try {
        const parsed = JSON.parse(savedCust);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomers(prev => [...parsed.map((c: any) => ({ id: String(c.id), name: `${c.name} (${c.phone})` })), ...prev]);
        }
      } catch (e) {}
    }
    const savedVeh = localStorage.getItem('master_vehicles');
    if (savedVeh) {
      try {
        const parsed = JSON.parse(savedVeh);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVehicles(prev => [...parsed.map((v: any) => ({ id: String(v.id), customerId: String(v.customerId || '1'), name: `${v.model} (${v.plateNumber})` })), ...prev]);
        }
      } catch (e) {}
    }
  }, []);

  const filteredVehicles = useMemo(() => {
    if (!customerId) return [];
    return vehicles.filter(v => String(v.customerId) === String(customerId));
  }, [customerId, vehicles]);

  const handleCustomerChange = (newCustId: string) => {
    setCustomerId(newCustId);
    setVehicleId('');
  };

  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  useEffect(() => {
    let payload: any = null;

    if (rawData) {
      try {
        payload = JSON.parse(decodeURIComponent(rawData));
      } catch (e) {}
    }

    if (!payload) {
      const stored = sessionStorage.getItem('convert_work_order') || sessionStorage.getItem('convert_job_card') || sessionStorage.getItem('conversion_payload');
      if (stored) {
        try {
          payload = JSON.parse(stored);
        } catch (e) {}
      }
    }

    if (payload) {
      const ref = payload.sourceId ? `Source #${payload.sourceId}` : fromWorkOrder ? `Work Order #${fromWorkOrder}` : fromJobCard ? `Job Card #${fromJobCard}` : '';
      setRefSource(ref);
      setIsPreFilled(true);
      const custId = payload.customerId || '3';
      const vehId = payload.vehicleId || '4';
      setCustomerId(custId);
      setVehicleId(vehId);

      if (payload.items && Array.isArray(payload.items)) {
        setLineItems(payload.items.map((it: any) => ({
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: it.name || it.description || '',
          type: it.type || 'Part',
          unitPrice: Number(it.unitPrice) || 0,
          qty: Number(it.qty) || 1,
          unit: it.unit || (it.type === 'Service' ? 'Job' : 'Pcs'),
          total: Number(it.amount) || (Number(it.qty) || 1) * (Number(it.unitPrice) || 0),
        })));
      }
      return;
    }

    const ref = fromWorkOrder ? `Work Order #${fromWorkOrder}` : fromJobCard ? `Job Card #${fromJobCard}` : null;
    if (ref) {
      setRefSource(ref);
      setIsPreFilled(true);
      setCustomerId('3');
      setVehicleId('4');

      setLineItems([
        { id: '1', name: 'Complete Suspension Overhaul', type: 'Service', unitPrice: 12500, qty: 1, unit: 'Job', total: 12500 },
        { id: '2', name: 'Shock Absorber Assembly Front (OEM)', type: 'Part', unitPrice: 14500, qty: 2, unit: 'Pcs', total: 29000 },
      ]);
    }
  }, [fromWorkOrder, fromJobCard, rawData]);

  const handleAddLine = (type: 'Part' | 'Service') => {
    const newItem: LineItem = {
      id: Date.now().toString() + Math.random().toString(),
      name: '',
      type,
      unitPrice: 0,
      qty: 1,
      total: 0,
      unit: type === 'Part' ? 'Pcs' : 'Hr'
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
        if (field === 'qty' || field === 'unitPrice') {
          updated.total = (Number(updated.qty) || 0) * (Number(updated.unitPrice) || 0);
        }
        if (field === 'name') {
          const nameLower = String(value).toLowerCase();
          if (nameLower.includes('oil') || nameLower.includes('fluid') || nameLower.includes('coolant')) updated.unit = 'Ltr';
          else if (nameLower.includes('pad') || nameLower.includes('shoe')) updated.unit = 'Set';
          else if (nameLower.includes('filter')) updated.unit = 'Pcs';
        }
        return updated;
      }
      return item;
    }));
  };

  const subtotal = useMemo(() => lineItems.reduce((acc, curr) => acc + curr.total, 0), [lineItems]);
  const discountAmount = useMemo(() => discountType === 'Flat' ? discountValue : (subtotal * discountValue) / 100, [subtotal, discountType, discountValue]);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = useMemo(() => (taxableAmount * taxPercent) / 100, [taxableAmount, taxPercent]);
  const grandTotal = taxableAmount + taxAmount;
  const balanceDue = grandTotal - amountPaid;

  const paymentStatus = useMemo(() => {
    if (amountPaid >= grandTotal && grandTotal > 0) return 'Paid';
    if (amountPaid > 0 && amountPaid < grandTotal) return 'Partial';
    return 'Unpaid';
  }, [amountPaid, grandTotal]);

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Create Direct Bill / Invoice</h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">Issue customer invoice for direct sales & service.</p>
        </div>
        <Link href="/billing" prefetch={false} className="py-1.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
          Back to Billing
        </Link>
      </div>

      {/* Pre-filled Banner */}
      {isPreFilled && (
        <div className="mb-3 px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>✓ Pre-filled from {refSource}</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pb-16">
        
        {/* Card 1: Core Info */}
        <div className="p-3.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">1. Customer & Vehicle Information</h2>
            <p className="text-[11px] text-slate-500">Select customer, vehicle details, and invoice dates.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Customer</label>
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(true)}
                  className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-2.5 py-1 rounded cursor-pointer"
                >
                  + New
                </button>
              </div>
              <select 
                className="w-full h-8 py-1 px-2.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none transition-colors"
                value={customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
              >
                <option value="" className="dark:bg-slate-800">-- Select Customer --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id} className="dark:bg-slate-800">{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Vehicle (Optional)</label>
                <button
                  type="button"
                  onClick={() => setIsVehicleModalOpen(true)}
                  className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-2.5 py-1 rounded cursor-pointer"
                >
                  + New
                </button>
              </div>
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
                    <option value="" className="dark:bg-slate-800">-- Select Vehicle / Over-the-counter --</option>
                    {filteredVehicles.map(v => (
                      <option key={v.id} value={v.id} className="dark:bg-slate-800">{v.name}</option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Invoice Date</label>
              <input 
                type="date" 
                className="w-full h-8 py-1 px-2.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none transition-colors"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Due Date</label>
              <input 
                type="date" 
                className="w-full h-8 py-1 px-2.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none transition-colors"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
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

        <div className="flex flex-col xl:flex-row gap-4">
          {/* Hybrid Line Items Table */}
          <div className="flex-1 p-3.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">2. Invoice Items & Services</h2>
                <p className="text-[11px] text-slate-500">List all items for customer invoice.</p>
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
                    <th className="bg-transparent text-slate-500 font-semibold text-[10px] uppercase tracking-wider py-2 px-2 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap w-28">PRICE (৳)</th>
                    <th className="bg-transparent text-slate-500 font-semibold text-[10px] uppercase tracking-wider py-2 px-2 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap w-20">QTY</th>
                    <th className="bg-transparent text-slate-500 font-semibold text-[10px] uppercase tracking-wider py-2 px-2 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap w-20">UNIT</th>
                    <th className="bg-transparent text-slate-500 font-semibold text-[10px] uppercase tracking-wider py-2 px-2 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap text-right w-28">TOTAL (৳)</th>
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
                          className="w-full h-7 py-1 px-2 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#004e89] outline-none transition-colors"
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        />
                      </td>
                      <td className="py-1.5 px-2 border-b border-slate-100 dark:border-slate-800/50">
                        <input 
                          type="number"
                          min="0"
                          placeholder="0.00"
                          aria-label="Unit Price"
                          className="w-full h-7 py-1 px-2 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#004e89] outline-none transition-colors"
                          value={item.unitPrice || ''}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                        />
                      </td>
                      <td className="py-1.5 px-2 border-b border-slate-100 dark:border-slate-800/50">
                        <input 
                          type="number"
                          min="1"
                          placeholder="1"
                          aria-label="Quantity"
                          className="w-full h-7 py-1 px-2 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#004e89] outline-none transition-colors"
                          value={item.qty || ''}
                          onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                        />
                      </td>
                      <td className="py-1.5 px-2 border-b border-slate-100 dark:border-slate-800/50">
                        <input 
                          type="text"
                          name="unit"
                          list="master-units"
                          placeholder="e.g. Ltr, Pcs, Set, Can"
                          aria-label="Unit"
                          className="w-full h-7 py-1 px-2 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#004e89] outline-none transition-colors"
                          value={item.unit || ''}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                        />
                      </td>
                      <td className="py-1.5 px-2 border-b border-slate-100 dark:border-slate-800/50 text-right text-xs font-semibold text-slate-800 dark:text-slate-200">
                        ৳ {item.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-1.5 px-2 border-b border-slate-100 dark:border-slate-800/50 text-center">
                        <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors" title="Remove line">
                          <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {lineItems.length === 0 && (
                    <tr><td colSpan={7} className="py-4 text-center text-xs text-slate-400">No items added to the bill.</td></tr>
                  )}
                </tbody>
              </table>
              <datalist id="master-units">
                <option value="Pcs" />
                <option value="Ltr" />
                <option value="Set" />
                <option value="Can" />
                <option value="Box" />
                <option value="Roll" />
                <option value="Bottle" />
                <option value="Kg" />
                <option value="Meter" />
                <option value="Hr" />
                <option value="Job" />
                <option value="পিস" />
                <option value="লিটার" />
                <option value="সেট" />
              </datalist>
            </div>
          </div>

          {/* Financial Engine Sidebar */}
          <div className="w-full xl:w-80 flex flex-col gap-3">
            <div className="p-3.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">3. Payment Summary & Calculations</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">৳ {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Discount</label>
                  <div className="flex gap-2">
                    <select 
                      className="w-24 h-7 py-1 px-1.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none"
                      value={discountType}
                      aria-label="Discount Type"
                      onChange={(e) => setDiscountType(e.target.value as 'Flat' | 'Percent')}
                    >
                      <option value="Flat">৳ Flat</option>
                      <option value="Percent">% Percent</option>
                    </select>
                    <input 
                      type="number" 
                      min="0"
                      placeholder="0.00"
                      aria-label="Discount Value"
                      className="flex-1 h-7 py-1 px-2 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none"
                      value={discountValue || ''}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">VAT/Tax (%)</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="0.00"
                    aria-label="VAT Tax Percent"
                    className="w-full h-7 py-1 px-2 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none"
                    value={taxPercent || ''}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                  />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Grand Total</span>
                  <span className="text-base font-bold text-[#004e89] dark:text-blue-400">৳ {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Payment</h2>
                <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${paymentStatus === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : paymentStatus === 'Partial' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
                  {paymentStatus}
                </span>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Amount Paid (৳)</label>
                <input 
                  type="number" 
                  min="0"
                  placeholder="0.00"
                  aria-label="Amount Paid"
                  className="w-full h-7 py-1 px-2 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none"
                  value={amountPaid || ''}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                />
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500">Balance Due</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">৳ {balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Footer Actions */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 h-12 px-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 z-50">
        <Link href="/billing" prefetch={false} className="h-8 px-4 rounded text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center">
          Cancel
        </Link>
        <button className="h-8 px-4 rounded text-xs font-semibold text-white bg-[#004e89] hover:bg-[#003d6c] transition-colors shadow-sm inline-flex items-center">
          Issue Invoice
        </button>
      </div>

      {/* Quick Creation Modals */}
      <QuickCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onCustomerCreated={(newCust) => {
          setCustomers(prev => [newCust, ...prev]);
          setCustomerId(newCust.id);
        }}
      />
      <QuickVehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        currentCustomer={customerId}
        onVehicleCreated={(newVeh) => {
          const vehObj = { id: newVeh.id, customerId: customerId || '1', name: newVeh.name };
          setVehicles(prev => [vehObj, ...prev]);
          setVehicleId(newVeh.id);
        }}
      />
    </div>
  );
}

export default function CreateBillingPage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-500 text-sm">Loading billing form...</div>}>
      <CreateBillingContent />
    </Suspense>
  );
}

