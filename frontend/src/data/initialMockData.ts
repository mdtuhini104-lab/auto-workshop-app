import { Vendor, PurchaseOrder, PurchaseReturnRecord, StockItem, Expense } from '../types/erp';

export const INITIAL_VENDORS: Vendor[] = [
  { id: 'VND-001', name: 'Akij Motors Ltd', contactPerson: 'Mamunur Rashid', phone: '01711-223344', category: 'Spare Parts & Filters', balance: 45000, status: 'Active' },
  { id: 'VND-002', name: 'Navana Toyota Motors', contactPerson: 'Tariqul Islam', phone: '01819-556677', category: 'OEM Body & Engine Parts', balance: 125000, status: 'Active' },
  { id: 'VND-003', name: 'Mobil Bangladesh (MJL)', contactPerson: 'Sabbir Ahmed', phone: '01912-334455', category: 'Lubricants & Oils', balance: 18000, status: 'Active' },
  { id: 'VND-004', name: 'Rahimafrooz Batteries', contactPerson: 'Kamarul Hasan', phone: '01677-889900', category: 'Electrical & Batteries', balance: 0, status: 'Active' },
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-2026-089', vendorName: 'Akij Motors Ltd', orderDate: '2026-07-25', expectedDate: '2026-07-29', totalAmount: 48500, status: 'Received' },
  { id: 'PO-2026-090', vendorName: 'Navana Toyota Motors', orderDate: '2026-07-27', expectedDate: '2026-07-31', totalAmount: 120000, status: 'Approved' },
  { id: 'PO-2026-091', vendorName: 'Mobil Bangladesh (MJL)', orderDate: '2026-07-29', expectedDate: '2026-08-02', totalAmount: 32000, status: 'Pending' },
];

export const INITIAL_PURCHASE_RETURNS: PurchaseReturnRecord[] = [
  {
    id: 'PR-2026-001',
    vendorName: 'Akij Motors Ltd',
    refOrder: 'PO-2026-001',
    returnDate: '2026-07-28',
    reason: 'Defective Parts',
    itemsReturned: 'Engine Oil Filter x 2',
    itemsList: [
      { id: '1', name: 'Engine Oil Filter', qty: 2, unitPrice: 1200, tax: 0, total: 2400 }
    ],
    subtotal: 2400,
    deductions: 0,
    totalCredit: 2400,
    status: 'Approved',
    remarks: 'Credit note issued CN-9821'
  },
  {
    id: 'PR-2026-002',
    vendorName: 'Navana Toyota Ltd',
    refOrder: 'INV-2026-105',
    returnDate: '2026-07-29',
    reason: 'Wrong Item Delivered',
    itemsReturned: 'Front Brake Pads Set x 1',
    itemsList: [
      { id: '1', name: 'Front Brake Pads Set', qty: 1, unitPrice: 4500, tax: 0, total: 4500 }
    ],
    subtotal: 4500,
    deductions: 0,
    totalCredit: 4500,
    status: 'Pending',
    remarks: 'Awaiting supplier confirmation'
  }
];

export const INITIAL_STOCK: StockItem[] = [
  { id: 'STK-001', partNo: 'OIL-SYN-5W40', name: 'Synthetic Engine Oil 5W-40 (4L)', category: 'Lubricants & Fluids', quantity: 45, unit: 'Can', unitCost: 4800, location: 'Rack A-12' },
  { id: 'STK-002', partNo: 'FLT-OIL-TYT', name: 'Oil Filter Assembly (Toyota)', category: 'Filters', quantity: 80, unit: 'Pcs', unitCost: 1400, location: 'Rack B-04' },
  { id: 'STK-003', partNo: 'PAD-BRK-FRT', name: 'Front Brake Pads Set (Akebono)', category: 'Brake System', quantity: 18, unit: 'Set', unitCost: 8500, location: 'Rack C-01' },
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'EXP-2026-081', date: '2026-07-28', category: 'Electricity & Utility', description: 'Uttara Workshop Electricity Bill - July', amount: 18500, paymentMode: 'Bank Transfer', approvedBy: 'Manager' },
  { id: 'EXP-2026-082', date: '2026-07-29', category: 'Tea & Refreshment', description: 'Client & Mechanic Staff Refreshment', amount: 1200, paymentMode: 'Petty Cash', approvedBy: 'Store Keeper' },
];
