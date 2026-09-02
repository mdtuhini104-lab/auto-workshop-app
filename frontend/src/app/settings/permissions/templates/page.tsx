'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Check } from 'lucide-react';

interface ModulePermission {
  moduleName: string;
  operations: {
    read: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    print: boolean;
    export: boolean;
  };
  expanded: boolean;
}

const moduleList = [
  'Dashboard', 'Master Data', 'Quotations', 'Purchases', 'Accounts', 'Peoples',
  'Files', 'Billing & Invoice', 'Notifications', 'Job Cards', 'Analytics',
  'Reports', 'Services', 'Vehicles', 'Profile', 'Settings', 'Companies', 'Inventory'
];

function NewTemplateBuilderContent() {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const [modules, setModules] = useState<ModulePermission[]>(
    moduleList.map(name => ({
      moduleName: name,
      operations: { read: false, create: false, edit: false, delete: false, print: false, export: false },
      expanded: false
    }))
  );

  const toggleAccordion = (index: number) => {
    setModules(prev => prev.map((m, idx) => idx === index ? { ...m, expanded: !m.expanded } : m));
  };

  const toggleOperation = (index: number, opKey: keyof ModulePermission['operations']) => {
    setModules(prev => prev.map((m, idx) => {
      if (idx !== index) return m;
      return {
        ...m,
        operations: { ...m.operations, [opKey]: !m.operations[opKey] }
      };
    }));
  };

  const toggleAllInModule = (index: number, enable: boolean) => {
    setModules(prev => prev.map((m, idx) => {
      if (idx !== index) return m;
      return {
        ...m,
        operations: { read: enable, create: enable, edit: enable, delete: enable, print: enable, export: enable }
      };
    }));
  };

  const summaryMetrics = useMemo(() => {
    let pagesCount = 0;
    let opsCount = 0;

    modules.forEach(m => {
      const activeOps = Object.values(m.operations).filter(Boolean).length;
      if (activeOps > 0) {
        pagesCount++;
        opsCount += activeOps;
      }
    });

    return { pagesCount, opsCount };
  }, [modules]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName) return;
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl text-slate-800 dark:text-slate-100 font-sans pb-12">
      {/* Breadcrumb Header */}
      <div className="text-xs text-slate-500 space-x-1">
        <Link href="/settings" prefetch={false} className="hover:underline">Settings</Link>
        <span>&gt;</span>
        <Link href="/settings/permissions" prefetch={false} className="hover:underline">Permissions</Link>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">Templates</span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">New Permission Template</h1>
        <p className="text-xs text-slate-500 mt-1">Create a new designation template for user permissions</p>
      </div>

      {isSaved && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
          ✓ Permission template &quot;{templateName}&quot; created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Card 1: Template Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-xs">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-900 dark:text-white">Template Name *</label>
            <input 
              type="text"
              placeholder="e.g., Manager, Sales Executive, Accounts"
              className="w-full h-9 px-3 text-xs border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent focus:ring-1 focus:ring-[#004e89]"
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-900 dark:text-white">Description</label>
            <textarea 
              rows={3}
              placeholder="Describe what this template is for..."
              className="w-full p-3 text-xs border border-slate-300 dark:border-slate-600 rounded-lg outline-none bg-transparent focus:ring-1 focus:ring-[#004e89]"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Form Card 2: Permissions Grid */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Permissions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Configure permissions for each module and operation</p>
            </div>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-full text-xs">
              {summaryMetrics.pagesCount} pages · {summaryMetrics.opsCount} operations
            </span>
          </div>

          {/* Module Accordions */}
          <div className="space-y-2">
            {modules.map((m, idx) => {
              const activeOpsCount = Object.values(m.operations).filter(Boolean).length;
              return (
                <div key={m.moduleName} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <div 
                    onClick={() => toggleAccordion(idx)}
                    className="p-3.5 bg-slate-50/70 dark:bg-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition select-none"
                  >
                    <div className="flex items-center gap-3">
                      {m.expanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{m.moduleName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {activeOpsCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">
                          {activeOpsCount} active
                        </span>
                      )}
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAllInModule(idx, activeOpsCount < 6);
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        {activeOpsCount === 6 ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                  </div>

                  {m.expanded && (
                    <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                      {(['read', 'create', 'edit', 'delete', 'print', 'export'] as const).map(opKey => (
                        <label key={opKey} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-700">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                            checked={m.operations[opKey]}
                            onChange={() => toggleOperation(idx, opKey)}
                          />
                          <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">{opKey}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/settings/permissions" prefetch={false} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
            Cancel
          </Link>
          <button type="submit" className="px-6 py-2.5 bg-[#004e89] hover:bg-[#003d6c] text-white rounded-lg text-xs font-bold transition shadow-sm">
            Create Template
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewTemplateBuilderPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading template builder...</div>}>
      <NewTemplateBuilderContent />
    </Suspense>
  );
}
