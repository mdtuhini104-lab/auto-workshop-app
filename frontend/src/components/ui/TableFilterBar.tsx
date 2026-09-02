'use client';

import React from 'react';

interface TableFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  statusFilter?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: { label: string; value: string }[];
}

export default function TableFilterBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  statusFilter,
  onStatusChange,
  statusOptions,
}: TableFilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 focus:border-[#004e89] text-slate-900 placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Status Filter Dropdown */}
      {statusOptions && onStatusChange && (
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Status:</label>
          <select
            value={statusFilter || 'All'}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full sm:w-40 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004e89]/30 text-slate-800 font-medium"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
