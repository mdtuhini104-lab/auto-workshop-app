export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  category: string;
  balance: number;
  status: 'Active' | 'Inactive';
}

export interface PurchaseOrder {
  id: string;
  vendorName: string;
  orderDate: string;
  expectedDate: string;
  totalAmount: number;
  status: 'Approved' | 'Pending' | 'Received' | 'Cancelled';
}

export interface PurchaseReturnItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  tax: number;
  total: number;
}

export interface PurchaseReturnRecord {
  id: string;
  vendorName: string;
  refOrder: string;
  returnDate: string;
  reason: string;
  itemsReturned: string;
  itemsList: PurchaseReturnItem[];
  subtotal: number;
  deductions: number;
  totalCredit: number;
  status: 'Approved' | 'Pending' | 'Refunded';
  remarks: string;
}

export interface StockItem {
  id: string;
  partNo: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  location: string;
}

export interface StockAdjustment {
  id: string;
  date: string;
  itemName: string;
  type: 'Stock In (+)' | 'Stock Out (-)';
  qty: number;
  reason: string;
  adjustedBy: string;
}

export interface StockAlert {
  id: string;
  itemName: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  reorderQty: number;
  status: 'Critical Low' | 'Low Stock';
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMode: string;
  approvedBy: string;
}

export interface AccountNode {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: 'Corporate' | 'Individual';
  totalVehicles: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  salary: number;
  status: 'Active' | 'On Leave';
}

export interface VehicleDoc {
  id: string;
  vehicleNo: string;
  docType: 'Fitness Certificate' | 'Tax Token' | 'Route Permit' | 'Insurance';
  expiryDate: string;
  uploadedDate: string;
  status: 'Valid' | 'Expiring Soon';
}

export interface InvoiceFile {
  id: string;
  invoiceNo: string;
  category: 'Customer Invoice' | 'Vendor Bill' | 'Expense Receipt';
  partyName: string;
  issueDate: string;
  fileSize: string;
}

// Generic UI Component Interfaces
export interface KpiCardItem {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'danger' | 'info';
}

export interface TableColumn<T> {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => React.ReactNode;
}
