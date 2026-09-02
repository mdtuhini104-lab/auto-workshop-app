"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../../utils/api';

// --- Reusable Components ---

interface ComboboxProps {
  label: string;
  placeholder: string;
  items: { id: string | number; label: string; sublabel?: string }[];
  value: string | number;
  onChange: (id: string | number, label: string) => void;
  onQuickAdd?: () => void;
  required?: boolean;
  disabled?: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({ label, placeholder, items, value, onChange, onQuickAdd, required, disabled }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find(i => i.id.toString() === value?.toString());
  const displayLabel = selectedItem ? (selectedItem.sublabel ? `${selectedItem.label} (${selectedItem.sublabel})` : selectedItem.label) : '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = items.filter(
    item => 
      item.label.toLowerCase().includes(search.toLowerCase()) || 
      (item.sublabel && item.sublabel.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex justify-between mb-1 items-center">
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {onQuickAdd && (
          <button type="button" onClick={onQuickAdd} disabled={disabled} className="text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Add
          </button>
        )}
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm bg-white dark:bg-gray-700 dark:text-white sm:text-sm p-2.5 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-left h-[42px]"
      >
        <span className={`block truncate ${!selectedItem ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {selectedItem ? displayLabel : (label.includes('VEHICLE') ? 'Select vehicle...' : (label.includes('MECHANIC') ? 'Search mechanic...' : 'Select...'))}
        </span>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg p-2">
          <div className="relative mb-2">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              autoFocus
              placeholder={placeholder}
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white sm:text-sm p-2.5 pl-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    onChange(item.id, item.label);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 rounded-md flex items-center justify-between"
                >
                  <div className="truncate">
                    <span>{item.label}</span>
                    {item.sublabel && <span className="text-gray-500 dark:text-gray-400 ml-1">({item.sublabel})</span>}
                  </div>
                  {value.toString() === item.id.toString() && (
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">No results found.</div>
            )}
          </div>
        </div>
      )}
      <input type="text" required={required} value={value} className="opacity-0 absolute h-0 w-0 pointer-events-none" onChange={() => {}} />
    </div>
  );
};


const QuickCustomerModal = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: (data: any) => void }) => {
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', company: '', address: '', city: '', state: '', zip: '', country: '', status: 'Active' });

  const handleQuickAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await fetchApi('/api/api_inspections.php?action=quick_add_customer', {
        method: 'POST',
        data: { customer_name: newCustomer.name, phone: newCustomer.phone }
      });
      if (data.success) {
        onSuccess({ id: data.customer.id, name: data.customer.customer_name || newCustomer.name, phone: data.customer.phone });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Register New Customer</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Add New Customer</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Enter customer details to create a new customer</p>
          </div>
          <form id="customer-form" onSubmit={handleQuickAddCustomer} className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Name <span className="text-red-500">*</span></label>
                  <input type="text" required className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email (optional)</label>
                  <input type="email" placeholder="john@example.com" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone <span className="text-red-500">*</span></label>
                  <input type="text" required placeholder="+1 234 567 8900" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Company (optional)</label>
                  <input type="text" placeholder="Customer Name" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newCustomer.company} onChange={e => setNewCustomer({...newCustomer, company: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Address (optional)</label>
                <textarea rows={2} placeholder="Street address" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newCustomer.address} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">City (optional)</label>
                  <input type="text" placeholder="City" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newCustomer.city} onChange={e => setNewCustomer({...newCustomer, city: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">State (optional)</label>
                  <input type="text" placeholder="State" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newCustomer.state} onChange={e => setNewCustomer({...newCustomer, state: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">ZIP Code (optional)</label>
                  <input type="text" placeholder="ZIP" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newCustomer.zip} onChange={e => setNewCustomer({...newCustomer, zip: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Country (optional)</label>
                  <input type="text" placeholder="Country" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newCustomer.country} onChange={e => setNewCustomer({...newCustomer, country: e.target.value})} />
                </div>
                <div></div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Status <span className="text-red-500">*</span></label>
                <select className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newCustomer.status} onChange={e => setNewCustomer({...newCustomer, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            {/* Right column: Photo */}
            <div className="w-full md:w-64 flex flex-col">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Customer Photo (optional)</label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center p-6 h-48 mb-4 bg-gray-50 dark:bg-gray-800">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="text-sm text-gray-500">No media</span>
              </div>
              <button type="button" className="w-full bg-[#004e89] hover:bg-blue-800 text-white py-2 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                Select from Media
              </button>
            </div>
          </form>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors bg-white border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">Cancel</button>
          <button type="submit" form="customer-form" className="px-5 py-2 rounded-md bg-[#004e89] hover:bg-blue-800 text-white text-sm font-medium transition-colors">Create Customer</button>
        </div>
      </div>
    </div>
  );
};

const QuickVehicleModal = ({ customerId, onClose, onSuccess }: { customerId: string | number; onClose: () => void; onSuccess: (data: any) => void }) => {
  const [newVehicle, setNewVehicle] = useState({ plate_number: '', brand: '', model: '', year: '', engine: '', chassis: '', driver_name: '', driver_number: '', color: '' });

  const handleQuickAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost/auto-workshop-app/backend/api/api_inspections.php?action=quick_add_vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ plate_number: newVehicle.plate_number, brand: newVehicle.brand, model: newVehicle.model, customer_id: customerId ? parseInt(customerId.toString()) : null })
      });
      const data = await res.json();
      if (data.success) {
        onSuccess({ id: data.vehicle.id, plate_number: data.vehicle.plate_number, customer_id: customerId ? parseInt(customerId.toString()) : 0 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Quick Register New Vehicle</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="p-6 overflow-y-auto">
          <form id="vehicle-form" onSubmit={handleQuickAddVehicle} className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Vehicle / Plate Number <span className="text-red-500">*</span></label>
                <input type="text" required placeholder="DHAKA-METRO-GA-1234" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newVehicle.plate_number} onChange={e => setNewVehicle({...newVehicle, plate_number: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Brand</label>
                <select className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newVehicle.brand} onChange={e => setNewVehicle({...newVehicle, brand: e.target.value})}>
                  <option value="">Select Brand</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Model</label>
                <input type="text" placeholder="e.g. Corolla, Civic" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Year</label>
                <input type="text" placeholder="2026" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Engine Number (Optional)</label>
                <input type="text" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newVehicle.engine} onChange={e => setNewVehicle({...newVehicle, engine: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Chassis Number (Optional)</label>
                <input type="text" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newVehicle.chassis} onChange={e => setNewVehicle({...newVehicle, chassis: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Driver Name (Optional)</label>
                <input type="text" placeholder="Driver Name" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newVehicle.driver_name} onChange={e => setNewVehicle({...newVehicle, driver_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Driver Number (Optional)</label>
                <input type="text" placeholder="e.g. 017XXXXXXXX" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newVehicle.driver_number} onChange={e => setNewVehicle({...newVehicle, driver_number: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Color</label>
              <input type="text" placeholder="e.g. Silver, Black" className="block w-full rounded-md border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newVehicle.color} onChange={e => setNewVehicle({...newVehicle, color: e.target.value})} />
            </div>
            <div className="flex justify-end pt-4">
              <button type="submit" className="px-5 py-2.5 rounded-md bg-[#004e89] hover:bg-blue-800 text-white text-sm font-medium transition-colors">Register Vehicle</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


// --- Main Page Component ---

export default function NewInspectionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Dropdown states
  const [customers, setCustomers] = useState<{id: number, name: string, phone: string}[]>([]);
  const [vehicles, setVehicles] = useState<{id: number, plate_number: string, customer_id: number}[]>([]);
  
  const [formData, setFormData] = useState({
    customer_id: '',
    vehicle_id: '',
    mechanic_id: '',
    customer_requirement: '',
    mechanic_report: '',
    problems: [{ problem_title: '', description: '', severity: 'Medium', suggested_service_id: '', est_cost: '' }],
    items: [{ item_id: '', quantity: 1 }]
  });

  // Modal states
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  // Load initial data
  useEffect(() => {
    // Mock data fetch
    setCustomers([
      { id: 1, name: 'Petriot ECO', phone: '01914 093151' },
      { id: 2, name: 'B.S.B Spinning Mills Ltd.', phone: '01755555270' },
      { id: 3, name: 'Dobiruddin Spinning Mills Ltd.', phone: '01755555270' },
      { id: 4, name: 'Suraiya Spinning Mills LTD', phone: '01755555270' }
    ]);
    setVehicles([
      { id: 1, plate_number: '12-8432', customer_id: 1 },
      { id: 2, plate_number: '12-1212', customer_id: 1 },
      { id: 3, plate_number: '13-1212', customer_id: 1 }
    ]);
  }, []);

  const handleAddProblem = () => {
    setFormData(prev => ({
      ...prev,
      problems: [...prev.problems, { problem_title: '', description: '', severity: 'Medium', suggested_service_id: '', est_cost: '' }]
    }));
  };

  const handleRemoveProblem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      problems: prev.problems.filter((_, i) => i !== index)
    }));
  };

  const handleProblemChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updated = [...prev.problems];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, problems: updated };
    });
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { item_id: '', quantity: 1 }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const updated = [...prev.items];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, items: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_id) {
      setError('Please select a customer.');
      return;
    }
    if (!formData.vehicle_id) {
      setError('Please select a vehicle.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost/auto-workshop-app/backend/api/api_inspections.php?action=save_inspection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          customer_id: parseInt(formData.customer_id),
          vehicle_id: parseInt(formData.vehicle_id),
          mechanic_id: formData.mechanic_id ? parseInt(formData.mechanic_id) : null,
          problems: formData.problems.map(p => ({
            ...p,
            est_cost: parseFloat(p.est_cost || '0'),
            suggested_service_id: p.suggested_service_id ? parseInt(p.suggested_service_id) : null
          })),
          items: formData.items.map(i => ({
            ...i,
            item_id: i.item_id ? parseInt(i.item_id) : null,
            quantity: typeof i.quantity === 'string' ? parseInt(i.quantity) : i.quantity
          }))
        })
      });
      
      const data = await res.json();
      if (data.success) {
        router.push('/workshop/inspections');
      } else {
        setError(data.error || 'Failed to save inspection');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerSuccess = (newData: any) => {
    setCustomers(prev => [...prev, newData]);
    setFormData(prev => ({ ...prev, customer_id: newData.id.toString(), vehicle_id: '' }));
    setShowCustomerModal(false);
  };

  const handleVehicleSuccess = (newData: any) => {
    setVehicles(prev => [...prev, newData]);
    setFormData(prev => ({ ...prev, vehicle_id: newData.id.toString() }));
    setShowVehicleModal(false);
  };

  // Filter vehicles based on selected customer
  const filteredVehicles = formData.customer_id 
    ? vehicles.filter(v => v.customer_id.toString() === formData.customer_id)
    : [];

  const mockMechanics = [
    { id: 1, name: 'Admin User', email: 'admin@example.com' },
    { id: 2, name: 'Sagor', email: 'admins@example.com' },
    { id: 3, name: 'Samim', email: 'adminac@example.com' }
  ];

  return (
    <div className="p-6 h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-y-auto relative font-sans">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/workshop/inspections" prefetch={false} className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors mb-2 font-medium">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Quotations &gt; New
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Inspection</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Record vehicle problems and complaints</p>
        </div>

        <Link
          href="/quotations/create"
          prefetch={false}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 w-fit shrink-0"
        >
          <span>📄 Convert to Quotation</span>
        </Link>
      </div>

      <div className="w-full max-w-6xl mx-auto space-y-6 pb-24">
        
        {error && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm">{error}</div>}

        <form id="inspection-form" onSubmit={handleSubmit} className="space-y-6">
          
          {/* Top Card: Customer & Vehicle Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-5 uppercase tracking-wider">Customer & Vehicle Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <Combobox
                label="SELECT CUSTOMER"
                placeholder="Search by name or phone..."
                items={customers.map(c => ({ id: c.id, label: c.name, sublabel: c.phone }))}
                value={formData.customer_id}
                onChange={(id) => setFormData(prev => ({ ...prev, customer_id: id.toString(), vehicle_id: '' }))}
                onQuickAdd={() => setShowCustomerModal(true)}
                required
              />

              <Combobox
                label="SELECT VEHICLE"
                placeholder="Search vehicles..."
                items={filteredVehicles.map(v => ({ id: v.id, label: v.plate_number }))}
                value={formData.vehicle_id}
                onChange={(id) => setFormData(prev => ({ ...prev, vehicle_id: id.toString() }))}
                onQuickAdd={() => setShowVehicleModal(true)}
                required
                disabled={!formData.customer_id}
              />

              <Combobox
                label="SELECT MECHANIC (USER)"
                placeholder="Search by name..."
                items={mockMechanics.map(m => ({ id: m.id, label: m.name, sublabel: m.email }))}
                value={formData.mechanic_id}
                onChange={(id) => setFormData(prev => ({ ...prev, mechanic_id: id.toString() }))}
              />

            </div>
          </div>

          {/* Mid Section: Dual Textareas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                 Customer requirement
               </label>
               <textarea 
                 rows={4}
                 className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm p-3 transition-colors resize-none"
                 placeholder="Add any customer requirements..."
                 value={formData.customer_requirement}
                 onChange={(e) => setFormData({...formData, customer_requirement: e.target.value})}
               />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
               <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                 Report from mechanic
               </label>
               <textarea 
                 rows={4}
                 className="block w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm p-3 transition-colors resize-none"
                 placeholder="Add mechanic report and observations..."
                 value={formData.mechanic_report}
                 onChange={(e) => setFormData({...formData, mechanic_report: e.target.value})}
               />
            </div>
          </div>

          {/* Section A: Recorded Problems */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <span className="text-gray-400 font-light">+</span> Recorded Problems / Complaints
              </h2>
              <button 
                type="button" 
                onClick={handleAddProblem}
                className="text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Add
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="hidden md:grid grid-cols-12 gap-4 px-1 pb-2 border-b border-gray-100 dark:border-gray-700">
                 <div className="col-span-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Problem Title *</div>
                 <div className="col-span-3 text-xs font-semibold text-gray-700 dark:text-gray-300">Description</div>
                 <div className="col-span-2 text-xs font-semibold text-gray-700 dark:text-gray-300">Severity</div>
                 <div className="col-span-2 text-xs font-semibold text-gray-700 dark:text-gray-300">Suggested Service</div>
                 <div className="col-span-2 text-xs font-semibold text-gray-700 dark:text-gray-300">Est. Cost</div>
              </div>
              {formData.problems.map((prob, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3">
                    <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Problem Title *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Engine noise"
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 text-sm p-2.5 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      value={prob.problem_title}
                      onChange={(e) => handleProblemChange(index, 'problem_title', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <input 
                      type="text" 
                      placeholder="Details..."
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 text-sm p-2.5 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      value={prob.description}
                      onChange={(e) => handleProblemChange(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Severity</label>
                    <select 
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 text-sm p-2.5 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      value={prob.severity}
                      onChange={(e) => handleProblemChange(index, 'severity', e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Suggested Service</label>
                    <input
                      type="text"
                      placeholder="Suggested service..."
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 text-sm p-2.5 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      value={prob.suggested_service_id}
                      onChange={(e) => handleProblemChange(index, 'suggested_service_id', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <div className="flex-1">
                      <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Est. Cost</label>
                      <input 
                        type="number" 
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 text-sm p-2.5 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        placeholder="0.00"
                        value={prob.est_cost}
                        onChange={(e) => handleProblemChange(index, 'est_cost', e.target.value)}
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveProblem(index)}
                      className="text-red-400 hover:text-red-600 p-2 border border-red-100 rounded-md hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
              {formData.problems.length === 0 && (
                <div className="text-center p-4 text-gray-500 text-sm border-t border-gray-100">No problems added yet.</div>
              )}
            </div>
          </div>

          {/* Section B: Required Spare Parts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <span className="text-gray-400 font-light">+</span> Required Spare Parts / Items
              </h2>
              <button 
                type="button" 
                onClick={handleAddItem}
                className="text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Add
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="hidden md:flex gap-4 px-1 pb-2 border-b border-gray-100 dark:border-gray-700">
                 <div className="flex-1 text-xs font-semibold text-gray-700 dark:text-gray-300">Product Name *</div>
                 <div className="w-32 pr-10 text-xs font-semibold text-gray-700 dark:text-gray-300">Quantity</div>
              </div>
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Product Name *</label>
                    <input 
                      type="text"
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 text-sm p-2.5 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      value={item.item_id}
                      placeholder="Select Product"
                      onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                    />
                  </div>
                  <div className="w-32 flex items-center gap-2">
                    <div className="flex-1">
                      <label className="md:hidden block text-xs font-medium text-gray-500 mb-1">Quantity</label>
                      <input 
                        type="number" 
                        min="1"
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 text-sm p-2.5 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-400 hover:text-red-600 p-2 border border-red-100 rounded-md hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
              {formData.items.length === 0 && (
                <div className="text-center p-4 text-gray-500 text-sm border-t border-gray-100">No parts requested.</div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-sm z-40 lg:ml-[250px]">
        <div className="max-w-6xl mx-auto flex justify-end gap-4">
          <Link prefetch={false} href="/workshop/inspections"
            className="px-6 py-2.5 rounded-md text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-transparent"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            form="inspection-form"
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-full bg-[#004e89] text-white font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 shadow-md"
          >
            {isSubmitting ? 'Saving...' : 'Save Inspection'}
          </button>
        </div>
      </div>

      {showCustomerModal && (
        <QuickCustomerModal 
          onClose={() => setShowCustomerModal(false)}
          onSuccess={handleCustomerSuccess}
        />
      )}

      {showVehicleModal && (
        <QuickVehicleModal 
          customerId={formData.customer_id}
          onClose={() => setShowVehicleModal(false)}
          onSuccess={handleVehicleSuccess}
        />
      )}

    </div>
  );
}
