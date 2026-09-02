"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '../../../utils/api';

interface Category {
  id: number;
  category_name: string;
  category_code: string;
  description: string;
  status: string;
  created_at: string;
}

export default function CategoriesListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = async (query = '') => {
    setIsLoading(true);
    try {
      const endpoint = query ? `/api/api_master_data.php?action=get_categories&search=${encodeURIComponent(query)}` : '/api/api_master_data.php?action=get_categories';
      const data = await fetchApi(endpoint);
      if (data && data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      } else if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = (Array.isArray(categories) ? categories : []).filter(c => {
    const matchTab = activeTab === 'All' || (activeTab === 'Trash' ? c.status === 'Trash' : c.status === activeTab);
    if (!matchTab) return false;
    if (!searchTerm) return true;
    const regex = new RegExp(searchTerm, 'i');
    return regex.test(c.category_name) || regex.test(c.description || '');
  });

  const tabs = ['All', 'Trash'];

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500 font-normal mt-1">Manage item and service categories</p>
        </div>
        <Link prefetch={false} href="/master-data/categories/add"
          className="bg-[#004e89] hover:bg-[#003d6c] text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create Category
        </Link>
      </div>

      {/* Toolbar: Tabs + Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === tab ? 'font-semibold text-slate-900 bg-slate-100' : 'font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              {tab === 'All' ? 'All Categories' : tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search categories..."
              className="w-64 py-2 px-3 pl-9 text-sm rounded-lg border border-slate-200 focus:border-[#004e89] outline-none bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') fetchCategories(searchTerm); }}
            />
          </div>
          <button className="py-2 px-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
            Bulk Actions
          </button>
        </div>
      </div>

      {/* Seamless Flat Table */}
      <div className="overflow-x-auto pb-4 flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Category Name</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Code</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Description</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap">Status</th>
              <th className="bg-transparent text-slate-500 font-semibold text-sm py-3 px-4 border-b-2 border-slate-100 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="py-12 px-4 text-center text-sm text-slate-400">Loading categories...</td></tr>
            ) : filteredCategories.length === 0 ? (
              <tr><td colSpan={5} className="py-12 px-4 text-center text-sm text-slate-400">No categories found matching your search.</td></tr>
            ) : (
              filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 text-sm text-slate-800 font-medium border-b border-slate-100 whitespace-nowrap">{cat.category_name}</td>
                  <td className="py-3 px-4 text-sm text-slate-500 border-b border-slate-100 whitespace-nowrap">{cat.category_code}</td>
                  <td className="py-3 px-4 text-sm text-slate-500 border-b border-slate-100 max-w-xs truncate">{cat.description || '-'}</td>
                  <td className="py-3 px-4 border-b border-slate-100 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                      {cat.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-slate-100 whitespace-nowrap text-right">
                    <button className="text-slate-400 hover:text-[#004e89] transition-colors text-sm font-medium">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
