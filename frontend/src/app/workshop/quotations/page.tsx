"use client";
import React, {  useState , Suspense } from "react";

import { useSearchParams } from "next/navigation";

function QuotationsPageContent() {
  const searchParams = useSearchParams();
  const inspectionId = searchParams.get('inspection_id');
  const initialCustomerId = searchParams.get('customer_id') || "";
  const initialVehicleId = searchParams.get('vehicle_id') || "";

  const [customerId, setCustomerId] = useState(initialCustomerId);
  const [vehicleId, setVehicleId] = useState(initialVehicleId);
  const [items, setItems] = useState<any[]>([]);
  const [quotedBy, setQuotedBy] = useState('Mamun Automobiles');

  const serviceCategories = ['None', 'Water Service', 'Repair & Maintenance', 'Denting & Painting', 'AC Service'];

  const addItem = () => {
    setItems([...items, { 
      description: '', 
      part_source: 'Inventory', 
      service_category: 'None', 
      quantity: 1, 
      service_charge: 0,
      is_local_procurement: false,
      external_vendor: '',
      external_rate: 0,
      is_locked_rate: false
    }]);
  };

  const checkHistoricalRate = async (index: number, description: string) => {
    // Mock API call for check_historical_rate
    if (description.toLowerCase().includes('oil')) {
        const newItems = [...items];
        newItems[index]['service_charge'] = 4500; // Found historical locked rate
        newItems[index]['is_locked_rate'] = true;
        setItems(newItems);
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'description') {
        checkHistoricalRate(index, value);
    }
    if (field === 'is_local_procurement') {
        newItems[index]['part_source'] = value ? 'Local Procurement' : 'Inventory';
    }
    setItems(newItems);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen rounded-xl mt-8 print:p-0 print:bg-white print:m-0">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quotation Generator</h1>
          <p className="text-gray-500 mt-2">Generate quotes with Service Categories and Ad-Hoc Procurement.</p>
        </div>
        <div className="flex space-x-3 items-center">
            <span className="text-sm font-bold text-gray-600 uppercase">Quoted By:</span>
            <select className="border border-purple-300 bg-purple-50 text-purple-800 font-bold rounded p-2 shadow-sm" value={quotedBy} onChange={e => setQuotedBy(e.target.value)}>
                <option value="Mamun Automobiles">Mamun Automobiles</option>
                <option value="Muntaha Motors">Muntaha Motors</option>
            </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:border-none print:shadow-none">
        
        {/* Dynamic Print Header */}
        <div className="hidden print:flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">{quotedBy}</h2>
            <p className="text-gray-500 text-sm mt-1">{quotedBy === 'Mamun Automobiles' ? '123 Auto Workshop Rd, Dhaka' : '456 Motor Valley, Chittagong'}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold text-purple-600 uppercase tracking-widest">Quotation</h3>
            <p className="text-gray-500 text-sm mt-1">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Manual Bypass Selectors */}
        {!inspectionId && (
          <div className="mb-6 grid grid-cols-2 gap-4 p-4 bg-purple-50 border border-purple-100 rounded-lg print:hidden">
            <div>
              <label className="block text-sm font-bold text-purple-800 mb-1">Select Customer</label>
              <select className="w-full rounded p-2 border border-purple-200" value={customerId} onChange={e => setCustomerId(e.target.value)}>
                <option value="">Search Customer...</option>
                <option value="1">Acme Corp (ID: 1)</option>
                <option value="2">John Doe (ID: 2)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-purple-800 mb-1">Select Vehicle</label>
              <select className="w-full rounded p-2 border border-purple-200" value={vehicleId} onChange={e => setVehicleId(e.target.value)}>
                <option value="">Search Vehicle...</option>
                <option value="101">DHK-12-3456 (Toyota Corolla)</option>
              </select>
            </div>
          </div>
        )}
        
        <h2 className="text-xl font-bold mb-4 print:hidden">Quote Items</h2>
        
        <div className="print:hidden">
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 p-4 border rounded bg-gray-50">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description / Part</label>
                <input type="text" className="w-full border-gray-300 rounded p-2 border" 
                  value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Category</label>
                <select className="w-full border-gray-300 rounded p-2 border"
                  value={item.service_category} onChange={e => updateItem(idx, 'service_category', e.target.value)}>
                  {serviceCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                 <input type="number" min="1" className="w-full border-gray-300 rounded p-2 border" 
                  value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Charge {item.is_locked_rate && <span className="text-xs text-green-600 ml-1 font-bold">(Locked Rate)</span>}
                 </label>
                 <input type="number" min="0" className={`w-full rounded p-2 border ${item.is_locked_rate ? 'border-green-500 bg-green-50' : 'border-gray-300'}`} 
                  value={item.service_charge} onChange={e => {
                      updateItem(idx, 'service_charge', Number(e.target.value));
                      updateItem(idx, 'is_locked_rate', false); // Manual override removes lock
                  }} />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" className="rounded" checked={item.is_local_procurement}
                    onChange={e => updateItem(idx, 'is_local_procurement', e.target.checked)} />
                  <span>Local Procurement</span>
                </label>
              </div>
  
              {/* Ad-Hoc Procurement Fields conditionally rendered */}
              {item.is_local_procurement && (
                <div className="col-span-6 grid grid-cols-2 gap-4 mt-2 p-3 bg-blue-50 border border-blue-100 rounded">
                  <div>
                    <label className="block text-xs font-bold text-blue-700 uppercase mb-1">External Vendor Name</label>
                    <input type="text" className="w-full border-gray-300 rounded p-2 border text-sm" 
                      placeholder="E.g. Ali Auto Parts"
                      value={item.external_vendor} onChange={e => updateItem(idx, 'external_vendor', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-blue-700 uppercase mb-1">External Purchase Rate</label>
                    <input type="number" min="0" className="w-full border-gray-300 rounded p-2 border text-sm" 
                      placeholder="Cost price"
                      value={item.external_rate} onChange={e => updateItem(idx, 'external_rate', Number(e.target.value))} />
                  </div>
                  <p className="col-span-2 text-xs text-blue-600">
                    * Saving this quote will automatically stage a Purchase Order for this item.
                  </p>
                </div>
              )}
            </div>
          ))}
          
          <button onClick={addItem} className="mt-2 text-blue-600 font-semibold text-sm hover:underline">
            + Add Row
          </button>
        </div>

        {/* Print Only Table view for Quotation */}
        <table className="hidden print:table w-full text-left mt-6">
            <thead className="bg-gray-100 border-b text-gray-700 uppercase text-xs tracking-wider">
                <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, i) => (
                    <tr key={i} className="border-b">
                        <td className="p-3">{item.description}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">{item.service_charge}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        <div className="mt-8 flex justify-end print:hidden">
           <button onClick={() => window.print()} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded shadow">
             Save & Print Quotation
           </button>
        </div>
      </div>
    </div>
  );
}


export default function QuotationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-semibold text-slate-500">Loading page...</div>}>
      <QuotationsPageContent />
    </Suspense>
  );
}
