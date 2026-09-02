"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewQuotationPage() {
  const router = useRouter();
  const [selectedInspection, setSelectedInspection] = useState("");
  const [discount, setDiscount] = useState<number>(0);
  const [vatRate, setVatRate] = useState<number>(15); // Default 15% VAT
  
  // Dynamic Items State
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, rate: 0, isLabor: false }
  ]);

  // Mock inspections for dropdown
  const pendingInspections = [
    { id: "INSP-101", customer: "John Doe", vehicle: "DHA-11-2233", details: "Toyota Corolla 2019" },
    { id: "INSP-102", customer: "Jane Smith", vehicle: "CTG-55-9988", details: "Honda Civic 2021" }
  ];

  const handleInspectionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedInspection(val);
    
    // Auto-inject data for demo
    if(val === "INSP-101") {
      setItems([
        { id: Date.now(), description: "Brake Pad Replacement (Front)", quantity: 1, rate: 3500, isLabor: false },
        { id: Date.now() + 1, description: "Labor Charge - Brake Pads", quantity: 1, rate: 1000, isLabor: true },
      ]);
    } else {
      setItems([{ id: Date.now(), description: "", quantity: 1, rate: 0, isLabor: false }]);
    }
  };

  const handleAddRow = () => {
    setItems(prev => [...prev, { id: Date.now() + Math.random(), description: "", quantity: 1, rate: 0, isLabor: false }]);
  };

  const handleUpdateItem = (id: number, field: string, value: string | number | boolean) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveRow = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Calculations using useMemo
  const subTotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  }, [items]);

  const vatAmount = useMemo(() => {
    const totalAfterDiscount = Math.max(0, subTotal - discount);
    return (totalAfterDiscount * vatRate) / 100;
  }, [subTotal, discount, vatRate]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subTotal - discount) + vatAmount;
  }, [subTotal, discount, vatAmount]);

  const handleSave = async (status: "Draft" | "Sent") => {
    // API Call would go here
    // Example: fetch('/backend/api/api_workshop_flow.php?action=log_quotation', { ... })
    alert(`Quotation saved as ${status}!`);
    router.push('/quotations');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Quotation</h1>
        <Link href="/quotations" prefetch={false} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium">
          Cancel
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm space-y-8">
        
        {/* Inspection Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Inspection</label>
          <select 
            className="w-full md:w-1/2 border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-[#004e89] outline-none transition-shadow"
            value={selectedInspection}
            onChange={handleInspectionSelect}
          >
            <option value="">-- Choose an Inspected Vehicle --</option>
            {pendingInspections.map(insp => (
              <option key={insp.id} value={insp.id}>{insp.id} - {insp.vehicle} ({insp.customer})</option>
            ))}
          </select>
        </div>

        {/* Dynamic Items Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Parts & Labor Items</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 w-1/3">Description</th>
                  <th className="pb-3 px-4 w-1/6">Type</th>
                  <th className="pb-3 px-4 w-1/12 text-right">Qty</th>
                  <th className="pb-3 px-4 w-1/6 text-center">Unit</th>
                  <th className="pb-3 px-4 w-1/6 text-right">Unit Price</th>
                  <th className="pb-3 px-4 w-1/6 text-right">Total</th>
                  <th className="pb-3 px-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {items.map((item: any, index) => (
                  <tr key={item.id}>
                    <td className="py-4 pr-4">
                      <input 
                        type="text" 
                        value={item.description}
                        onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                        placeholder="Enter description..."
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent focus:ring-1 focus:ring-[#004e89] outline-none"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <select 
                        value={item.isLabor ? 'true' : 'false'}
                        onChange={(e) => handleUpdateItem(item.id, 'isLabor', e.target.value === 'true')}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent outline-none"
                      >
                        <option value="false">Part</option>
                        <option value="true">Labor</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <input 
                        type="number" 
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full text-right border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent outline-none"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <input 
                        type="text" 
                        name="unit"
                        list="common-units"
                        placeholder="e.g. Ltr, Pcs, Set, Can"
                        value={item.unit || ''}
                        onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent outline-none text-xs focus:ring-1 focus:ring-[#004e89]"
                      />
                    </td>
                    <td className="py-4 px-4">
                      <input 
                        type="number" 
                        min="0"
                        value={item.rate}
                        onChange={(e) => handleUpdateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full text-right border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-transparent outline-none"
                      />
                    </td>
                    <td className="py-4 px-4 text-right font-medium text-gray-900 dark:text-gray-100">
                      ৳ {(item.quantity * item.rate).toLocaleString()}
                    </td>
                    <td className="py-4 pl-2 text-right">
                      <button type="button" onClick={() => handleRemoveRow(item.id)} className="text-red-500 hover:text-red-700 transition-colors p-1">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button type="button" onClick={handleAddRow} className="mt-2 text-[#004e89] dark:text-blue-400 font-medium hover:underline flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Row</span>
          </button>
        </div>

        {/* Foot Calculator */}
        <div className="flex flex-col items-end space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700 w-full">
           <div className="w-full md:w-1/3 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                 <span className="text-gray-600 dark:text-gray-400 font-medium">Sub Total:</span>
                 <span className="font-semibold text-gray-900 dark:text-white">৳ {subTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-gray-600 dark:text-gray-400 font-medium">Discount (Flat):</span>
                 <input 
                   type="number"
                   value={discount}
                   onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                   className="w-32 text-right border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-transparent outline-none focus:ring-1 focus:ring-[#004e89]" 
                 />
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-gray-600 dark:text-gray-400 font-medium">VAT (%):</span>
                 <input 
                   type="number"
                   value={vatRate}
                   onChange={(e) => setVatRate(parseFloat(e.target.value) || 0)}
                   className="w-32 text-right border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-transparent outline-none focus:ring-1 focus:ring-[#004e89]" 
                 />
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700 text-lg">
                 <span className="font-bold text-gray-900 dark:text-white">Grand Total:</span>
                 <span className="font-bold text-[#004e89] dark:text-blue-400">৳ {grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
           </div>
        </div>

        {/* Action Hooks */}
        <div className="flex justify-end space-x-4 pt-8">
           <button 
             onClick={() => handleSave("Draft")}
             className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
           >
             Save as Draft
           </button>
           <button 
             onClick={() => handleSave("Sent")}
             className="px-6 py-3 bg-[#004e89] hover:bg-blue-800 text-white font-medium rounded-md transition-colors shadow-sm"
           >
             Save & Sent
           </button>
        </div>

      </div>
    </div>
  );
}
