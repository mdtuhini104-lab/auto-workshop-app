"use client";
import React, {  useState , Suspense } from "react";

import { useSearchParams } from "next/navigation";

function BillingPageContent() {
  const searchParams = useSearchParams();
  const workOrderId = searchParams.get('work_order_id');
  const initialCustomerId = searchParams.get('customer_id') || "";
  const initialVehicleId = searchParams.get('vehicle_id') || "";

  const [customerId, setCustomerId] = useState(initialCustomerId);
  const [vehicleId, setVehicleId] = useState(initialVehicleId);
  const [billType, setBillType] = useState('Combined');
  const [billedBy, setBilledBy] = useState('Mamun Automobiles');
  
  const [subtotal, setSubtotal] = useState(15000);
  const [discountType, setDiscountType] = useState('Flat');
  const [discountValue, setDiscountValue] = useState(0);
  const [paidAmount, setPaidAmount] = useState(10000);

  const calculatedDiscount = discountType === 'Percentage' 
      ? (subtotal * (discountValue / 100)) 
      : discountValue;
  const grandTotal = Math.max(0, subtotal - calculatedDiscount);
  const balanceDue = Math.max(0, grandTotal - paidAmount);
  const saleType = paidAmount >= grandTotal ? 'CASH SALE' : 'CREDIT SALE';

  const applyDiscountAndPrint = async () => {
    // In a real app, this updates the invoice via fetch API
    window.print();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen rounded-xl mt-8 print:p-0 print:bg-white print:m-0">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Final Billing & Invoicing</h1>
          <p className="text-gray-500 mt-2">Manage split bills, apply post-print discounts, and finalize checkout.</p>
        </div>
        <div className="flex space-x-3 items-center">
            <span className="text-sm font-bold text-gray-600 uppercase">Billed By:</span>
            <select className="border border-blue-300 bg-blue-50 text-blue-800 font-bold rounded p-2 shadow-sm" value={billedBy} onChange={e => setBilledBy(e.target.value)}>
                <option value="Mamun Automobiles">Mamun Automobiles</option>
                <option value="Muntaha Motors">Muntaha Motors</option>
            </select>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 print:shadow-none print:border-none print:w-full">
        {/* Header section */}
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">{billedBy}</h2>
            <p className="text-gray-500 text-sm mt-1">{billedBy === 'Mamun Automobiles' ? '123 Auto Workshop Rd, Dhaka' : '456 Motor Valley, Chittagong'}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold text-blue-600">INVOICE #INV-1024</h3>
            <p className="text-gray-500 text-sm mt-1">Date: {new Date().toLocaleDateString()}</p>
            <div className="mt-2 inline-block px-3 py-1 bg-gray-100 font-bold text-gray-700 tracking-wider rounded border border-gray-300">
                {saleType}
            </div>
            <div className="mt-2 print:hidden">
                <select className="border-gray-300 rounded text-sm p-1 border shadow-sm" value={billType} onChange={e => setBillType(e.target.value)}>
                    <option value="Combined">Combined Bill</option>
                    <option value="Service">Service-Only Bill</option>
                    <option value="Product">Product-Only Bill</option>
                </select>
            </div>
          </div>
        </div>

        {/* Manual Bypass Selectors */}
        {!workOrderId && (
          <div className="mb-6 grid grid-cols-2 gap-4 p-4 bg-blue-50 border border-blue-100 rounded-lg print:hidden">
            <div>
              <label className="block text-sm font-bold text-blue-800 mb-1">Select Customer</label>
              <select className="w-full rounded p-2 border border-blue-200" value={customerId} onChange={e => setCustomerId(e.target.value)}>
                <option value="">Search Customer...</option>
                <option value="1">Acme Corp (ID: 1)</option>
                <option value="2">John Doe (ID: 2)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-blue-800 mb-1">Select Vehicle</label>
              <select className="w-full rounded p-2 border border-blue-200" value={vehicleId} onChange={e => setVehicleId(e.target.value)}>
                <option value="">Search Vehicle...</option>
                <option value="101">DHK-12-3456 (Toyota Corolla)</option>
              </select>
            </div>
          </div>
        )}

        {/* Bill Body mock */}
        <table className="w-full text-left mb-8">
          <thead className="bg-gray-100 border-b text-gray-700 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-3">Description</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(billType === 'Combined' || billType === 'Product') && (
              <tr>
                <td className="p-3">Synthetic Engine Oil (Castrol)</td>
                <td className="p-3 text-gray-500">Parts</td>
                <td className="p-3 text-center">1</td>
                <td className="p-3 text-right">5,000</td>
              </tr>
            )}
            {(billType === 'Combined' || billType === 'Service') && (
              <tr>
                <td className="p-3">Full Engine Repair & Tuning</td>
                <td className="p-3 text-gray-500">Repair & Maintenance</td>
                <td className="p-3 text-center">1</td>
                <td className="p-3 text-right">10,000</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end">
          <div className="w-80 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold">{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center text-gray-600 print:hidden">
              <span>Update Discount:</span>
              <div className="flex space-x-2">
                <select className="border rounded p-1 text-sm w-24" value={discountType} onChange={e => setDiscountType(e.target.value)}>
                  <option value="Flat">Flat</option>
                  <option value="Percentage">%</option>
                </select>
                <input type="number" className="border rounded p-1 text-sm w-20 text-right font-bold text-red-600" 
                  value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))} />
              </div>
            </div>

            <div className="flex justify-between text-gray-600 hidden print:flex">
              <span>Discount Applied:</span>
              <span className="font-semibold text-red-500">- {calculatedDiscount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-3">
              <span>Grand Total:</span>
              <span className="text-blue-600">BDT {grandTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center text-gray-600 pt-3 border-t">
              <span>Amount Paid:</span>
              <input type="number" className="border rounded p-1 text-sm w-24 text-right print:hidden font-bold" 
                value={paidAmount} onChange={e => setPaidAmount(Number(e.target.value))} />
              <span className="hidden print:inline font-semibold">BDT {paidAmount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-lg font-bold text-red-600 pt-1">
              <span>Balance Due (Ledger):</span>
              <span>BDT {balanceDue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Post-Print Controls */}
        <div className="mt-12 border-t pt-6 flex justify-between items-center print:hidden">
           <p className="text-sm text-gray-500">
             * Apply post-print negotiated discounts here. The invoice record & ledger will auto-update.
           </p>
           <button 
             onClick={applyDiscountAndPrint}
             className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded shadow text-lg"
           >
             Update Ledger & Print
           </button>
        </div>
      </div>
    </div>
  );
}


export default function BillingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <BillingPageContent />
    </Suspense>
  );
}
