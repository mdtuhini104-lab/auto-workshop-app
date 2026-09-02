"use client";
import React, { useEffect, useState } from "react";
import { fetchApi } from "../../../utils/api";

interface WorkOrder {
  id: number;
  quotation_id: number;
  status: string;
  start_date: string;
  vehicle_details: string;
}

export default function WorkOrdersPage() { 
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorkOrders();
  }, []);

  const loadWorkOrders = async () => {
    try {
      // Stubbed backend fetch matching ERP standard
      const response = await fetchApi("/api/api_workshop_flow.php?action=get_work_orders", { method: "GET" });
      if (response.success) {
        setWorkOrders(response.data || []);
      } else {
        setError("Failed to load work orders");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading work orders...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen rounded-xl mt-8">
      <h1 className="text-3xl font-bold text-gray-800">Master Work Orders</h1>
      <p className="text-gray-500 mt-2 p-4 bg-white border border-gray-200 rounded shadow-sm mb-6">
        Manage active work orders bridging quotations to mechanical job cards.
      </p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Work Order #</th>
              <th className="px-6 py-4 font-semibold">Vehicle Details</th>
              <th className="px-6 py-4 font-semibold">Quotation Ref</th>
              <th className="px-6 py-4 font-semibold">Start Date</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {workOrders.map((wo) => (
              <tr key={wo.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">WO-{wo.id.toString().padStart(4, '0')}</td>
                <td className="px-6 py-4 text-gray-800">{wo.vehicle_details || "N/A"}</td>
                <td className="px-6 py-4 text-gray-500">QT-{wo.quotation_id}</td>
                <td className="px-6 py-4 text-gray-600">{new Date(wo.start_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    wo.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    wo.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {wo.status}
                  </span>
                </td>
              </tr>
            ))}
            {workOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No active work orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  ); 
}
