"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QuickCustomerModal from '@/components/modals/QuickCustomerModal';
import QuickVehicleModal from '@/components/modals/QuickVehicleModal';

interface DiagnosticItem {
  id: string;
  itemId?: string;
  name: string;
  type: 'Part' | 'Service';
  qty: number;
  unit: string;
}

function CreateInspectionContent() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [odometer, setOdometer] = useState('');
  const [fuelLevel, setFuelLevel] = useState('1/2');
  const [severity, setSeverity] = useState('Low');
  
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

  // Relational vehicle filtering strictly based on selected customerId
  const filteredVehicles = useMemo(() => {
    if (!customerId) return [];
    return vehicles.filter(v => String(v.customerId) === String(customerId));
  }, [customerId, vehicles]);

  // Handle customer change with vehicle state reset
  const handleCustomerChange = (newCustId: string) => {
    setCustomerId(newCustId);
    setVehicleId('');
  };

  const [diagnosticItems, setDiagnosticItems] = useState<DiagnosticItem[]>([]);

  const handleAddItem = (type: 'Part' | 'Service') => {
    const newItem: DiagnosticItem = {
      id: Date.now().toString(),
      name: '',
      type,
      qty: 1,
      unit: type === 'Part' ? 'Pcs' : 'Job'
    };
    setDiagnosticItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setDiagnosticItems(prev => prev.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof DiagnosticItem, value: any) => {
    setDiagnosticItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
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

  const handleConvertToQuotation = () => {
    const payload = {
      customerId,
      vehicleId,
      odometer,
      fuelLevel,
      lineItems: diagnosticItems
    };
    sessionStorage.setItem('convert_inspection', JSON.stringify(payload));
    router.push('/quotations/create');
  };

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">New Vehicle Inspection</h1>
          <p className="text-xs text-slate-500 font-normal mt-0.5">Log initial vehicle condition, damages, fuel level, and customer complaints.</p>
        </div>
        <Link href="/quotations/inspections" prefetch={false} className="py-1.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
          Back to Inspections
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-16">
        
        {/* Card 1: Customer & Vehicle Details */}
        <div className="p-3.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">1. Customer & Vehicle Details</h2>
            <p className="text-[11px] text-slate-500">Log customer info, vehicle mileage, fuel level, mechanic assignment & severity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-3">
            
            {/* Row 1 */}
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
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Vehicle</label>
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
                    <option value="" className="dark:bg-slate-800">-- Select Vehicle --</option>
                    {filteredVehicles.map(v => (
                      <option key={v.id} value={v.id} className="dark:bg-slate-800">{v.name}</option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Odometer Reading (KM)</label>
              <input 
                type="number" 
                placeholder="e.g., 45000" 
                className="w-full h-8 py-1 px-2.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none transition-colors"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Fuel Level</label>
              <div className="flex gap-1">
                {['Empty', '1/4', '1/2', '3/4', 'Full'].map(level => (
                  <button 
                    key={level}
                    onClick={() => setFuelLevel(level)}
                    className={`flex-1 py-1 px-1 text-[10px] sm:text-xs font-medium rounded h-8 border transition-colors ${fuelLevel === level ? 'bg-[#004e89] border-[#004e89] text-white' : 'bg-transparent border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2 */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Assigned Mechanic</label>
              <select aria-label="Assigned Mechanic" className="w-full h-8 py-1 px-2.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none transition-colors">
                <option value="" className="dark:bg-slate-800">Select Mechanic</option>
                <option value="m1" className="dark:bg-slate-800">Karim Rahman</option>
                <option value="m2" className="dark:bg-slate-800">Rahim Hossain</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Issue Severity Level</label>
              <div className="flex gap-1">
                <button onClick={() => setSeverity('Low')} className={`flex-1 py-1 px-2.5 text-xs font-medium rounded h-8 border transition-colors ${severity === 'Low' ? 'bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-900/40 dark:border-blue-800 dark:text-blue-400' : 'bg-transparent border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>Low</button>
                <button onClick={() => setSeverity('Medium')} className={`flex-1 py-1 px-2.5 text-xs font-medium rounded h-8 border transition-colors ${severity === 'Medium' ? 'bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-900/40 dark:border-amber-800 dark:text-amber-400' : 'bg-transparent border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>Medium</button>
                <button onClick={() => setSeverity('High')} className={`flex-1 py-1 px-2.5 text-xs font-medium rounded h-8 border transition-colors ${severity === 'High' ? 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/40 dark:border-red-800 dark:text-red-400' : 'bg-transparent border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>High</button>
              </div>
            </div>
            <div className="xl:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Customer Complaints & Symptoms</label>
              <textarea rows={2} placeholder="Describe the complaints e.g., Engine knocking, AC not cooling..." aria-label="Customer Complaints and Symptoms" className="w-full h-auto py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none transition-colors resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Card 2: Visual Inspection & Vehicle Condition */}
        <div className="p-3.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">2. Visual Inspection & Vehicle Condition</h2>
            <p className="text-[11px] text-slate-500">Record external damages, body scratches, glass conditions, and accessory inventory.</p>
          </div>
          <div className="flex flex-col xl:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Damage & Components Checklist</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'scratch', label: 'Scratch' },
                  { id: 'dent', label: 'Dent' },
                  { id: 'windshield', label: 'Windshield Crack' },
                  { id: 'spare', label: 'Spare Tire Present' },
                  { id: 'tools', label: 'Tools/Jack Present' }
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-1.5 cursor-pointer py-1 px-2.5 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <input type="checkbox" className="w-3.5 h-3.5 text-[#004e89] rounded border-slate-300 dark:border-slate-600 focus:ring-[#004e89]" />
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="xl:w-1/3">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Additional Damage Notes</label>
              <textarea rows={2} placeholder="Any other observations..." className="w-full py-1.5 px-2.5 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-slate-300 dark:border-slate-700 focus:ring-1 focus:ring-[#004e89] outline-none transition-colors resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* Mock Datalists for Hybrid Entry */}
        <datalist id="master-parts">
          <option value="Engine Oil Filter - Synthetic" />
          <option value="Brake Pads (Front)" />
          <option value="Spark Plugs" />
          <option value="Air Filter" />
          <option value="Battery 12V" />
        </datalist>
        <datalist id="master-services">
          <option value="General Servicing Labor" />
          <option value="Wheel Alignment" />
          <option value="Custom Bumper Repair" />
          <option value="Full Car Wash" />
          <option value="Engine Diagnostics" />
        </datalist>

        {/* Card 3: Diagnostic Items & Required Services */}
        <div className="p-3.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">3. Diagnostic Items & Required Services</h2>
              <p className="text-[11px] text-slate-500">List required spare parts and labor services.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => handleAddItem('Part')} className="h-7 px-2 text-xs font-medium text-[#004e89] dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                Add Part
              </button>
              <button type="button" onClick={() => handleAddItem('Service')} className="h-7 px-2 text-xs font-medium text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/40 rounded transition-colors flex items-center gap-1">
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
                  <th className="bg-transparent text-slate-500 font-semibold text-[10px] uppercase tracking-wider py-2 px-2 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap w-20">EST. QTY</th>
                  <th className="bg-transparent text-slate-500 font-semibold text-[10px] uppercase tracking-wider py-2 px-2 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap w-24">UNIT</th>
                  <th className="bg-transparent text-slate-500 font-semibold text-[10px] uppercase tracking-wider py-2 px-2 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap text-center w-10">ACT</th>
                </tr>
              </thead>
              <tbody>
                {diagnosticItems.map(item => (
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
                        min="1"
                        placeholder="1"
                        aria-label="Quantity"
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
                        className="w-full h-7 py-1 px-2 text-xs text-slate-800 dark:text-slate-100 bg-transparent rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-[#004e89] outline-none transition-colors"
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
                {diagnosticItems.length === 0 && (
                  <tr><td colSpan={5} className="py-4 text-center text-xs text-slate-400">No diagnostic items added.</td></tr>
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
        <Link href="/quotations/inspections" prefetch={false} className="h-8 px-4 rounded text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center">
          Cancel
        </Link>
        <button className="h-8 px-4 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
          Save Inspection
        </button>
        <button onClick={handleConvertToQuotation} className="h-8 px-4 rounded text-xs font-semibold text-white bg-[#004e89] hover:bg-[#003d6c] transition-colors shadow-sm inline-flex items-center">
          Save & Convert to Quotation
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

export default function CreateInspectionPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-500">Loading form...</div>}>
      <CreateInspectionContent />
    </Suspense>
  );
}
