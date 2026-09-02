'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AiInput from '@/components/ui/AiInput';
import QuickCustomerModal from '@/components/modals/QuickCustomerModal';
import QuickVehicleModal from '@/components/modals/QuickVehicleModal';

interface LineItem {
  id: string;
  name: string;
  type: 'Part' | 'Service';
  unitPrice: number;
  qty: number;
  unit: string;
}

function CreateQuotationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromInspection = searchParams.get('fromInspection');
  const rawData = searchParams.get('data');

  const [isSaving, setIsSaving] = useState(false);
  const [isPreFilled, setIsPreFilled] = useState(false);
  
  const [customerOptions, setCustomerOptions] = useState([
    'John Doe (01711223344)',
    'Sarah Smith (01855667788)',
    'Europetex Limited (01711-889900)',
    'Jane Smith (018XXXXXX)',
  ]);
  const [vehiclesList, setVehiclesList] = useState([
    { id: 'v1', customerName: 'John Doe (01711223344)', name: 'Toyota Corolla (DHK-12-3456)' },
    { id: 'v2', customerName: 'John Doe (01711223344)', name: 'Honda CR-V (DHK-77-1122)' },
    { id: 'v3', customerName: 'Sarah Smith (01855667788)', name: 'Nissan X-Trail (CTG-44-8899)' },
    { id: 'v4', customerName: 'Europetex Limited (01711-889900)', name: 'DHK-METRO-GA-13-8851 (Land Cruiser)' },
    { id: 'v5', customerName: 'Jane Smith (018XXXXXX)', name: 'Honda Civic (CTG-55-9988)' },
  ]);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  useEffect(() => {
    const savedCust = localStorage.getItem('master_customers');
    if (savedCust) {
      try {
        const parsed = JSON.parse(savedCust);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomerOptions(prev => [...parsed.map((c: any) => `${c.name} (${c.phone})`), ...prev]);
        }
      } catch (e) {}
    }
    const savedVeh = localStorage.getItem('master_vehicles');
    if (savedVeh) {
      try {
        const parsed = JSON.parse(savedVeh);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVehiclesList(prev => [...parsed.map((v: any) => ({
            id: String(v.id),
            customerName: v.customerName || v.customer_name || 'John Doe (01711223344)',
            name: `${v.model} (${v.plateNumber || v.plate_number})`
          })), ...prev]);
        }
      } catch (e) {}
    }
  }, []);

  const [customer, setCustomer] = useState('');
  const [vehicle, setVehicle] = useState('');

  // Relational vehicle filtering strictly based on selected customer
  const filteredVehicles = useMemo(() => {
    if (!customer) return [];
    return vehiclesList.filter(v => 
      v.customerName === customer || 
      customer.includes(v.customerName) || 
      v.customerName.includes(customer)
    );
  }, [customer, vehiclesList]);

  // Handle customer change with vehicle state reset
  const handleCustomerChange = (newCustomer: string) => {
    setCustomer(newCustomer);
    setVehicle('');
  };
  
  const [quotationDate, setQuotationDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [discountType, setDiscountType] = useState<'% ' | 'Fixed'>('% ');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [terms, setTerms] = useState(
    '1. Quotation valid for 7 days.\n2. 50% advance required to begin work.'
  );

  // Initial line items set to empty array on fresh load
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  useEffect(() => {
    let payload: any = null;

    if (rawData) {
      try {
        payload = JSON.parse(decodeURIComponent(rawData));
      } catch (e) {}
    }

    if (!payload) {
      const stored = sessionStorage.getItem('convert_inspection') || sessionStorage.getItem('conversion_payload');
      if (stored) {
        try {
          payload = JSON.parse(stored);
        } catch (e) {}
      }
    }

    if (payload) {
      setIsPreFilled(true);
      const custName = payload.customerName || 'Europetex Limited (01711-889900)';
      const vehName = payload.vehicleNo || 'DHK-METRO-GA-13-8851 (Land Cruiser)';

      setCustomerOptions(prev => prev.includes(custName) ? prev : [custName, ...prev]);
      setCustomer(custName);

      setVehiclesList(prev => {
        const exists = prev.some(v => v.name === vehName || v.name.includes(payload.vehicleNo || 'GA-13'));
        if (!exists) {
          return [{ id: `v-${Date.now()}`, customerName: custName, name: vehName }, ...prev];
        }
        return prev;
      });
      setVehicle(vehName);

      if (payload.items && Array.isArray(payload.items)) {
        setLineItems(payload.items.map((it: any) => ({
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: it.name || it.description || '',
          type: it.type || 'Part',
          unitPrice: Number(it.unitPrice || it.estimatedRate || it.rate) || 0,
          qty: Number(it.qty) || 1,
          unit: it.unit || (it.type === 'Service' ? 'Job' : 'Pcs'),
        })));
      }
      return;
    }

    if (fromInspection) {
      setIsPreFilled(true);
      const custName = 'Europetex Limited (01711-889900)';
      const vehName = 'DHK-METRO-GA-13-8851 (Land Cruiser)';
      setCustomer(custName);
      setVehicle(vehName);
      setLineItems([
        { id: '1', name: 'Engine Diagnostics & Scan', type: 'Service', unitPrice: 2000, qty: 1, unit: 'Job' },
        { id: '2', name: 'Synthetic Engine Oil 5W-40 (4L)', type: 'Part', unitPrice: 4800, qty: 1, unit: 'Can' },
        { id: '3', name: 'Front Brake Pads Set (Akebono)', type: 'Part', unitPrice: 8500, qty: 1, unit: 'Set' },
        { id: '4', name: 'Brake Overhaul Labor', type: 'Service', unitPrice: 3500, qty: 1, unit: 'Job' },
      ]);
    }
  }, [fromInspection, rawData]);

  // Guaranteed row append handler
  const handleAddRow = (type: 'Part' | 'Service') => {
    const newItem: LineItem = {
      id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: '',
      type,
      unitPrice: 0,
      qty: 1,
      unit: type === 'Part' ? 'Pcs' : 'Hr'
    };
    setLineItems(prev => [...prev, newItem]);
  };

  const handleRemoveRow = (id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'name') {
            const nameLower = value.toLowerCase();
            if (nameLower.includes('oil') || nameLower.includes('fluid') || nameLower.includes('coolant')) updated.unit = 'Ltr';
            else if (nameLower.includes('pad') || nameLower.includes('shoe')) updated.unit = 'Set';
            else if (nameLower.includes('filter')) updated.unit = 'Pcs';
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleSaveQuotation = async (status: 'Draft' | 'Approved') => {
    if (!customer || !vehicle) {
      alert('Please select a Customer and Vehicle first.');
      return;
    }
    if (lineItems.length === 0) {
      alert('Please add at least one Part or Service to the quotation.');
      return;
    }

    setIsSaving(true);

    const payload = {
      customer,
      vehicle,
      quotationDate,
      validUntil,
      status,
      lineItems,
      terms,
      subtotal,
      discountType,
      discountValue,
      taxPercent,
      grandTotal
    };

    try {
      // POST to backend API endpoint if active, or log and process mock save
      console.log('Saving quotation payload:', payload);

      // Simulate network save delay
      await new Promise(resolve => setTimeout(resolve, 600));

      // Redirect user back to quotations list
      router.push('/quotations');
    } catch (error) {
      console.error('Failed to save quotation:', error);
      alert('An error occurred while saving the quotation.');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculations
  const subtotal = useMemo(() => {
    return lineItems.reduce((acc, item) => acc + (Number(item.unitPrice) || 0) * (Number(item.qty) || 0), 0);
  }, [lineItems]);

  const discountAmount = useMemo(() => {
    if (discountType === '% ') {
      return (subtotal * (Number(discountValue) || 0)) / 100;
    }
    return Number(discountValue) || 0;
  }, [subtotal, discountType, discountValue]);

  const taxAmount = useMemo(() => {
    const afterDiscount = Math.max(0, subtotal - discountAmount);
    return (afterDiscount * (Number(taxPercent) || 0)) / 100;
  }, [subtotal, discountAmount, taxPercent]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + taxAmount);
  }, [subtotal, discountAmount, taxAmount]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Quotation</h1>
          <p className="text-sm text-slate-500">Draft a new estimate for customer repair & services.</p>
        </div>
        <Link className="px-4 py-2 border border-slate-300 rounded text-sm font-medium hover:bg-slate-50" href="/quotations" prefetch={false}>
          &larr; Back to Quotations
        </Link>
      </div>

      {/* Pre-filled Banner */}
      {isPreFilled && (
        <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>✓ Pre-filled from Approved Vehicle Inspection #{fromInspection}</span>
        </div>
      )}

      {/* Datalist for Auto-suggestions */}
      <datalist id="master-parts">
        <option value="Synthetic Engine Oil 4L" />
        <option value="Oil Filter - Genuine" />
        <option value="Front Brake Pads Set" />
        <option value="Air Filter Element" />
      </datalist>
      <datalist id="master-services">
        <option value="General Maintenance & Paid Service" />
        <option value="Wheel Alignment & Balancing" />
        <option value="Brake System Overhaul" />
        <option value="AC Gas Refill & Leak Inspection" />
      </datalist>
      <datalist id="master-units">
        <option value="Pcs" />
        <option value="Ltr" />
        <option value="Set" />
        <option value="Box" />
        <option value="Roll" />
        <option value="Bottle" />
        <option value="Hr" />
        <option value="Job" />
      </datalist>

      {/* 1. Customer & Vehicle Information */}
      <div className="bg-white p-4 border border-slate-200 rounded-lg space-y-3">
        <div className="border-b border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-slate-900">1. Customer & Vehicle Information</h2>
          <p className="text-xs text-slate-500">Select customer, vehicle details, and validity dates for quotation.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-600">CUSTOMER</label>
            <button
              type="button"
              onClick={() => setIsCustomerModalOpen(true)}
              className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-2.5 py-1 rounded cursor-pointer"
            >
              + New
            </button>
          </div>
          <select
            value={customer}
            onChange={e => handleCustomerChange(e.target.value)}
            className="w-full h-9 border border-slate-300 rounded px-2 text-xs"
          >
            <option value="">-- Select Customer --</option>
            {customerOptions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-600">VEHICLE</label>
            <button
              type="button"
              onClick={() => setIsVehicleModalOpen(true)}
              className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-2.5 py-1 rounded cursor-pointer"
            >
              + New
            </button>
          </div>
          <select
            value={vehicle}
            disabled={!customer}
            onChange={e => setVehicle(e.target.value)}
            className="w-full h-9 border border-slate-300 rounded px-2 text-xs disabled:opacity-60"
          >
            {!customer ? (
              <option value="">-- First Select a Customer --</option>
            ) : filteredVehicles.length === 0 ? (
              <option value="">No vehicles registered for this customer</option>
            ) : (
              <>
                <option value="">-- Select Vehicle --</option>
                {filteredVehicles.map(v => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
              </>
            )}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">QUOTATION DATE</label>
          <input
            type="date"
            value={quotationDate}
            onChange={e => setQuotationDate(e.target.value)}
            className="w-full h-9 border border-slate-300 rounded px-2 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">VALID UNTIL DATE</label>
          <input
            type="date"
            value={validUntil}
            onChange={e => setValidUntil(e.target.value)}
            className="w-full h-9 border border-slate-300 rounded px-2 text-xs"
          />
        </div>
      </div>
      </div>

      {/* 2. Quotation Line Items & Services */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">2. Quotation Line Items & Services</h2>
            <p className="text-xs text-slate-500">Add parts, components, and labor services required for this quotation.</p>
          </div>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <th className="py-2 px-2">Item / Service Description</th>
              <th className="py-2 px-2 w-24">Type</th>
              <th className="py-2 px-2 w-28">Unit Price (৳)</th>
              <th className="py-2 px-2 w-20">Qty</th>
              <th className="py-2 px-2 w-20">Unit</th>
              <th className="py-2 px-2 w-28 text-right">Total (৳)</th>
              <th className="py-2 px-2 w-12 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map(item => (
              <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 px-2">
                  <AiInput
                    value={item.name}
                    placeholder={`Type or select ${item.type.toLowerCase()}...`}
                    onChange={e => handleItemChange(item.id, 'name', e.target.value)}
                  />
                </td>
                <td className="py-2 px-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.type === 'Part' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {item.type}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    placeholder="0.00"
                    aria-label="Unit Price"
                    value={item.unitPrice}
                    onChange={e => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full h-8 border border-slate-300 rounded px-2 text-xs"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    placeholder="1"
                    aria-label="Quantity"
                    value={item.qty}
                    onChange={e => handleItemChange(item.id, 'qty', parseInt(e.target.value) || 1)}
                    className="w-full h-8 border border-slate-300 rounded px-2 text-xs"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="text"
                    name="unit"
                    list="common-units"
                    value={item.unit}
                    placeholder="e.g. Ltr, Pcs, Set, Can"
                    aria-label="Unit"
                    onChange={e => handleItemChange(item.id, 'unit', e.target.value)}
                    className="w-full h-8 border border-slate-300 rounded px-2 text-xs focus:ring-1 focus:ring-[#004e89]"
                  />
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
                </td>
                <td className="py-2 px-2 text-right font-semibold">
                  ৳ {((Number(item.unitPrice) || 0) * (Number(item.qty) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-2 px-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(item.id)}
                    className="text-red-500 hover:text-red-700 p-1 font-bold text-base"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Append Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => handleAddRow('Part')}
            className="px-3 py-1.5 border border-blue-500 text-blue-600 rounded text-xs font-medium hover:bg-blue-50 flex items-center gap-1"
          >
            + Add Part/Item
          </button>
          <button
            type="button"
            onClick={() => handleAddRow('Service')}
            className="px-3 py-1.5 border border-purple-500 text-purple-600 rounded text-xs font-medium hover:bg-purple-50 flex items-center gap-1"
          >
            + Add Labor/Service
          </button>
        </div>
      </div>

      {/* 3. Quotation Summary & Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 border border-slate-200 rounded-lg space-y-2">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2">Terms & Customer Notes</h2>
          <textarea
            rows={4}
            value={terms}
            onChange={e => setTerms(e.target.value)}
            className="w-full border border-slate-300 rounded p-2 text-xs"
          />
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-lg space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">3. Quotation Summary & Terms</h2>
          <div className="flex justify-between text-xs font-medium">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800">৳ {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <div className="flex items-center justify-between text-xs gap-2">
            <span>Discount</span>
            <div className="flex gap-1 w-48">
              <select
                value={discountType}
                aria-label="Discount Type"
                onChange={e => setDiscountType(e.target.value as any)}
                className="h-8 border border-slate-300 rounded text-xs px-1"
              >
                <option value="%">%</option>
                <option value="Fixed">Fixed (BDT)</option>
              </select>
              <input
                type="number"
                placeholder="0.00"
                aria-label="Discount Value"
                value={discountValue || ''}
                onChange={e => setDiscountValue(parseFloat(e.target.value) || 0)}
                className="h-8 border border-slate-300 rounded text-xs px-2 w-full"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs gap-2">
            <span>Tax / VAT (%)</span>
            <input
              type="number"
              placeholder="0.00"
              aria-label="Tax Percent"
              value={taxPercent || ''}
              onChange={e => setTaxPercent(parseFloat(e.target.value) || 0)}
              className="h-8 border border-slate-300 rounded text-xs px-2 w-32"
            />
          </div>

          <div className="border-t pt-2 flex justify-between items-center text-base font-bold text-[#004e89]">
            <span>Grand Total</span>
            <span>৳ {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => router.push('/quotations')}
              className="px-4 py-2 border rounded text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={() => handleSaveQuotation('Draft')}
              className="px-4 py-2 border rounded text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button 
              type="button" 
              onClick={() => handleSaveQuotation('Approved')}
              className="px-4 py-2 bg-[#004e89] text-white rounded text-xs font-medium hover:bg-[#003d6c] disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? 'Sending...' : 'Save & Send Quotation'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Creation Modals */}
      <QuickCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onCustomerCreated={(newCust) => {
          setCustomerOptions(prev => [newCust.name, ...prev]);
          setCustomer(newCust.name);
        }}
      />
      <QuickVehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        currentCustomer={customer}
        onVehicleCreated={(newVeh) => {
          setVehiclesList(prev => [{ id: newVeh.id, customerName: customer, name: newVeh.name }, ...prev]);
          setVehicle(newVeh.name);
        }}
      />
    </div>
  );
}

export default function CreateQuotationPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading form...</div>}>
      <CreateQuotationContent />
    </Suspense>
  );
}
