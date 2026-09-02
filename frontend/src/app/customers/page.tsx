'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Search, Plus, Car, Phone, Mail, MapPin, Eye, CheckCircle2 } from 'lucide-react';

interface CustomerVehicle {
  plateNumber: string;
  model: string;
  year: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  vehicles: CustomerVehicle[];
  totalSpent: number;
}

const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+880 1711-000001',
    email: 'john.doe@gmail.com',
    address: 'House # 12, Road # 5, Sector # 3, Uttara, Dhaka',
    vehicles: [
      { plateNumber: 'DHK-12-3456', model: 'Toyota Corolla Cross', year: '2022' },
      { plateNumber: 'DHK-15-9876', model: 'Honda Civic Turbo', year: '2021' }
    ],
    totalSpent: 57500
  },
  {
    id: '2',
    name: 'Sarah Smith',
    phone: '+880 1819-000002',
    email: 'sarah.smith@yahoo.com',
    address: 'Plot # 45, Gulshan-2, Dhaka',
    vehicles: [
      { plateNumber: 'CTG-45-7890', model: 'Nissan X-Trail', year: '2020' }
    ],
    totalSpent: 20500
  },
  {
    id: '3',
    name: 'Ahmed Transport Ltd',
    phone: '+880 1912-000003',
    email: 'info@ahmedtransport.com',
    address: 'Tejgaon Industrial Area, Dhaka',
    vehicles: [
      { plateNumber: 'SYL-77-1122', model: 'Mitsubishi Pajero Sport', year: '2019' },
      { plateNumber: 'DHK-88-3344', model: 'Toyota HiAce Microbus', year: '2023' }
    ],
    totalSpent: 195000
  }
];

function CustomersContent() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State for + Add Customer
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newCust: Customer = {
      id: Date.now().toString(),
      name,
      phone,
      email,
      address,
      vehicles: plateNumber ? [{ plateNumber, model: vehicleModel || 'Standard Vehicle', year: '2024' }] : [],
      totalSpent: 0
    };

    setCustomers(prev => [newCust, ...prev]);
    setIsModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setPlateNumber('');
    setVehicleModel('');

    setToastMessage(`✓ Customer "${newCust.name}" added successfully!`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const filteredCustomers = customers.filter(c => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.vehicles.some(v => v.plateNumber.toLowerCase().includes(term) || v.model.toLowerCase().includes(term))
      );
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-800 dark:text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 space-x-1 mb-1">
            <Link href="/dashboard" prefetch={false} className="hover:underline">Dashboard</Link>
            <span>&gt;</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Customers</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Customer Directory & Vehicles</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage customer profiles, contact info, and registered vehicle ownership details.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#004e89] hover:bg-[#003d6c] text-white font-bold rounded-lg text-xs transition shadow-xs flex items-center gap-1.5 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Customer</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search by customer name, phone, email, or plate number..." 
            aria-label="Filter customers"
            className="w-full py-2 px-3 pl-9 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-1 focus:ring-[#004e89]" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Registered Vehicles</th>
                <th className="py-3 px-4 text-right">Total Spent</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredCustomers.map(cust => (
                <tr key={cust.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{cust.name}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">{cust.phone}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{cust.email}</td>
                  <td className="py-3.5 px-4 text-slate-500 truncate max-w-xs">{cust.address}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {cust.vehicles.map((v, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 rounded text-[11px] font-mono font-semibold">
                          {v.plateNumber} ({v.model})
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ৳ {cust.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/customers/${cust.id}`}
                      prefetch={false}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded font-semibold text-xs inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 text-slate-800 dark:text-slate-100">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Customer Profile</h3>
            <form onSubmit={handleAddCustomer} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Customer Name *</label>
                <input type="text" className="w-full h-9 px-3 border border-slate-300 rounded-lg outline-none bg-transparent" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Phone Number *</label>
                  <input type="text" className="w-full h-9 px-3 border border-slate-300 rounded-lg outline-none bg-transparent" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input type="email" className="w-full h-9 px-3 border border-slate-300 rounded-lg outline-none bg-transparent" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Street Address</label>
                <input type="text" className="w-full h-9 px-3 border border-slate-300 rounded-lg outline-none bg-transparent" value={address} onChange={e => setAddress(e.target.value)} />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">Initial Vehicle Entry (Optional)</span>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="License Plate (e.g. DHK-12-3456)" className="h-9 px-3 border border-slate-300 rounded-lg outline-none bg-transparent" value={plateNumber} onChange={e => setPlateNumber(e.target.value)} />
                  <input type="text" placeholder="Make / Model (e.g. Toyota Prado)" className="h-9 px-3 border border-slate-300 rounded-lg outline-none bg-transparent" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#004e89] text-white rounded-lg font-bold hover:bg-[#003d6c]">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading customers directory...</div>}>
      <CustomersContent />
    </Suspense>
  );
}
