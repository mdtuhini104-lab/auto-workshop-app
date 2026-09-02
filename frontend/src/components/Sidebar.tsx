'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Database, 
  FileText, 
  ShoppingBag, 
  Boxes, 
  Receipt, 
  Users, 
  FolderArchive, 
  ChevronDown, 
  ChevronRight,
  Wrench,
  Calendar,
  BarChart3,
  Settings,
  User
} from 'lucide-react';

interface MenuItem {
  title: string;
  icon?: any;
  href?: string;
  subItems?: { title: string; href: string }[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    'Master Data': true,
    'Quotations': true,
    'Purchases': true,
    'Inventory': false,
    'Accounts': false,
    'Peoples': false,
    'Appointments & Tracking': false,
    'Reports & Analytics': false,
    'Files': false
  });

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const navigation: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard'
    },
    {
      title: 'Master Data',
      icon: Database,
      subItems: [
        { title: 'All Items', href: '/master-data/items' },
        { title: 'Categories', href: '/master-data/categories' },
        { title: 'Units', href: '/master-data/units' },
        { title: 'Workshops', href: '/master-data/workshops' },
        { title: 'Departments', href: '/master-data/departments' },
        { title: 'Services', href: '/master-data/services' },
        { title: 'Vehicles', href: '/master-data/vehicles' },
      ]
    },
    {
      title: 'Quotations',
      icon: FileText,
      subItems: [
        { title: 'Inspections', href: '/quotations/inspections' },
        { title: 'Quotations', href: '/quotations' },
        { title: 'Work Orders', href: '/quotations/orders' },
        { title: 'Job Cards', href: '/job-cards' },
        { title: 'Billing & Invoice', href: '/billing' },
        { title: 'Customer Statements', href: '/customer-statements' },
      ]
    },
    {
      title: 'Purchases',
      icon: ShoppingBag,
      subItems: [
        { title: 'Vendors / Suppliers', href: '/purchases/vendors' },
        { title: 'Purchase Orders', href: '/purchases/orders' },
        { title: 'Goods Received (GRN)', href: '/purchases/grn' },
        { title: 'Purchase Invoices', href: '/purchases/invoices' },
        { title: 'Vendor Payments', href: '/purchases/payments' },
        { title: 'Return to Vendor', href: '/purchases/returns' },
      ]
    },
    {
      title: 'Inventory',
      icon: Boxes,
      subItems: [
        { title: 'Stock Control', href: '/inventory/stock' },
        { title: 'Stock Adjustments', href: '/inventory/adjustments' },
        { title: 'Low Stock Alerts', href: '/inventory/alerts' },
      ]
    },
    {
      title: 'Accounts',
      icon: Receipt,
      subItems: [
        { title: 'Chart of Accounts', href: '/accounts/chart' },
        { title: 'Daily Expenses', href: '/accounts/expenses' },
        { title: 'Customer Ledgers', href: '/accounts/customer-ledgers' },
        { title: 'Vendor Ledgers', href: '/accounts/vendor-ledgers' },
      ]
    },
    {
      title: 'Peoples',
      icon: Users,
      subItems: [
        { title: 'Users & Staff', href: '/peoples/users' },
        { title: 'Customers', href: '/peoples/customers' },
        { title: 'Vendors', href: '/peoples/vendors' },
        { title: 'Mechanics & Staff', href: '/peoples/employees' },
      ]
    },
    {
      title: 'Appointments & Tracking',
      icon: Calendar,
      subItems: [
        { title: 'Service Appointments', href: '/appointments' },
        { title: 'Vehicle Status Board', href: '/tracking' },
      ]
    },
    {
      title: 'Reports & Analytics',
      icon: BarChart3,
      subItems: [
        { title: 'Sales Summary', href: '/reports/sales' },
        { title: 'Profit & Loss', href: '/reports/profit-loss' },
        { title: 'Mechanic Performance', href: '/reports/mechanics' },
        { title: 'VAT & Tax Summary', href: '/reports/tax' },
      ]
    },
    {
      title: 'Files',
      icon: FolderArchive,
      subItems: [
        { title: 'Vehicle Documents', href: '/files/vehicles' },
        { title: 'Invoices & Receipts', href: '/files/invoices' },
      ]
    }
  ];

  return (
    <aside className="w-64 h-screen flex flex-col bg-white border-r border-slate-200 shrink-0 select-none shadow-sm z-30 overflow-hidden">
      {/* Top Header Logo */}
      <div className="p-4 border-b border-slate-100 shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Wrench className="w-5 h-5"/>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-sm leading-tight">Mamun Automobiles</h1>
            <p className="text-[10px] text-slate-500 font-medium">Enterprise Workshop ERP</p>
          </div>
        </div>
      </div>

      {/* Middle Scrollable Navigation */}
      <nav className="flex-1 min-h-0 overflow-y-auto p-3 space-y-1 hide-scrollbar">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isSubMenuOpen = !!openMenus[item.title];
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isActiveDirect = item.href ? pathname === item.href : false;

          return (
            <div key={item.title} className="space-y-0.5">
              {/* Single Route or Parent Dropdown Header */}
              {item.href ? (
                <Link 
                  href={item.href}
                  prefetch={false}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    isActiveDirect
                      ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-slate-500"/>}
                  <span>{item.title}</span>
                </Link>
              ) : (
                <button
                  onClick={() => toggleMenu(item.title)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="w-4 h-4 text-slate-500"/>}
                    <span>{item.title}</span>
                  </div>
                  {hasSubItems && (
                    isSubMenuOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400"/>
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400"/>
                    )
                  )}
                </button>
              )}

              {/* Sub-Items List */}
              {hasSubItems && isSubMenuOpen && (
                <div className="overflow-hidden pl-9 pr-1 py-1 space-y-1 border-l ml-5">
                  {item.subItems!.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link 
                        key={sub.href}
                        href={sub.href}
                        prefetch={false}
                        className={`block px-2.5 py-1.5 rounded-md text-xs transition ${
                          isSubActive
                            ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                            : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {sub.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {/* Explicit safe-scroll spacer */}
        <div className="h-8 shrink-0" />
      </nav>

      {/* Pinned Isolated Footer */}
      <div className="p-3 border-t border-slate-200 bg-white shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-40 space-y-1">
        <Link
          href="/peoples/users"
          prefetch={false}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition ${
            pathname === '/peoples/users' || pathname === '/settings/users'
              ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-xs'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-slate-500"/>
          <span>Users & Staff</span>
        </Link>

        <Link
          href="/profile"
          prefetch={false}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition ${
            pathname === '/settings/profile' || pathname === '/profile'
              ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-xs'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4 text-slate-500"/>
          <span>Profile</span>
        </Link>

        <Link
          href="/settings"
          prefetch={false}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition ${
            pathname === '/settings'
              ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 shadow-xs'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-500"/>
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}

