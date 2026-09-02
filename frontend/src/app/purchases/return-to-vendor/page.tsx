"use client";
import React, { useState } from "react";

export default function ReturnToVendorPage() { 
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen rounded-xl mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Return to Vendor (RTV)</h1>
          <p className="text-gray-500 mt-2">Log and track defective or incorrect parts returned to suppliers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors"
        >
          + New Vendor Return
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Return ID</th>
              <th className="px-6 py-4 font-semibold">Supplier Name</th>
              <th className="px-6 py-4 font-semibold">Part Name</th>
              <th className="px-6 py-4 font-semibold text-center">Returned Qty</th>
              <th className="px-6 py-4 font-semibold">Reason</th>
              <th className="px-6 py-4 font-semibold text-center">Credit Note Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No recent returns found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Initiate Vendor Return</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <select className="w-full border-gray-300 rounded-md shadow-sm p-2 border">
                  <option>Select Supplier...</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part to Return</label>
                <select className="w-full border-gray-300 rounded-md shadow-sm p-2 border">
                  <option>Select Part from Stock...</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Qty</label>
                  <input type="number" min="1" className="w-full border-gray-300 rounded-md shadow-sm p-2 border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <select className="w-full border-gray-300 rounded-md shadow-sm p-2 border">
                    <option>Defective</option>
                    <option>Wrong Item Supplied</option>
                    <option>Excess Stock</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow">Submit Return</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  ); 
}
