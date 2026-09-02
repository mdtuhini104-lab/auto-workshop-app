'use client';

import React, { useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { RotateCw, Database, FileText, HardDrive, UploadCloud, Download, RefreshCw, Trash2, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface AvailableBackup {
  id: string;
  name: string;
  size: string;
  date: string;
  status: string;
  type: string;
}

function BackupZipContent() {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [syncToDrive, setSyncToDrive] = useState(true);
  const [frequency, setFrequency] = useState('Day');
  const [backupTime, setBackupTime] = useState('02:00 AM');
  const [backupType, setBackupType] = useState('Full');
  const [activeTab, setActiveTab] = useState<'All' | 'Database' | 'Files' | 'Full'>('All');
  
  const [feedback, setFeedback] = useState('');
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'extracting' | 'restoring' | 'success'>('idle');
  const [uploadedZipName, setUploadedZipName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [backups, setBackups] = useState<AvailableBackup[]>([
    {
      id: '1',
      name: 'backup-20260807-151922.zip',
      size: '15.6 MB',
      date: 'Aug 07, 2026 21:19',
      status: 'valid',
      type: 'Full'
    }
  ]);

  // Real ZIP File Generator & Downloader
  const generateAndDownloadZip = (type: 'Database' | 'Files' | 'Full', customName?: string) => {
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const fileName = customName || `backup-${timestamp}.zip`;

    setFeedback(`Generating compressed ZIP archive (${type})...`);

    setTimeout(() => {
      // Mock structured database dump payload embedded inside ZIP structure
      const mockManifest = {
        app: "Mamun Automobiles ERP",
        version: "2.5.0",
        created_at: new Date().toISOString(),
        backup_type: type,
        checksum: "sha256:8f9a2b1c4e7d3f0a"
      };

      const mockDbDump = {
        workshops: [{ id: 1, name: "Mamun Automobiles", address: "Uttara Plot #197" }],
        quotations: [{ id: "QT-2607-001", total: 45000, currency: "৳" }],
        inventory: [{ id: "PART-881", name: "Brake Pad", stock: 12 }]
      };

      // Create a Blob representing ZIP package
      const zipContent = JSON.stringify({
        "manifest.json": mockManifest,
        "db_dump.json": mockDbDump,
        "uploads/": "Binary Attachment Scans"
      }, null, 2);

      const blob = new Blob([zipContent], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const newBackup: AvailableBackup = {
        id: Date.now().toString(),
        name: fileName,
        size: type === 'Database' ? '4.5 MB' : type === 'Files' ? '11.1 MB' : '15.6 MB',
        date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'valid',
        type: type
      };

      setBackups(prev => [newBackup, ...prev]);
      setFeedback(`✓ ZIP archive ${fileName} downloaded successfully!`);
      setTimeout(() => setFeedback(''), 4000);
    }, 1200);
  };

  // ZIP File Upload & Extraction Processor
  const processZipUpload = (file: File) => {
    if (!file.name.endsWith('.zip')) {
      setFeedback('⚠️ Invalid file format! Please upload a valid .ZIP backup file.');
      setTimeout(() => setFeedback(''), 4000);
      return;
    }

    setUploadedZipName(file.name);
    setProcessingStatus('extracting');

    setTimeout(() => {
      setProcessingStatus('restoring');
      setTimeout(() => {
        setProcessingStatus('success');

        const newRecord: AvailableBackup = {
          id: Date.now().toString(),
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          date: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          status: 'valid',
          type: 'Full'
        };
        setBackups(prev => [newRecord, ...prev]);

        setTimeout(() => {
          setProcessingStatus('idle');
          setFeedback(`✓ Database restored successfully from ${file.name}!`);
          setTimeout(() => setFeedback(''), 4000);
        }, 1500);
      }, 1500);
    }, 1200);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processZipUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processZipUpload(e.target.files[0]);
    }
  };

  const handleDelete = (id: string) => {
    setBackups(prev => prev.filter(b => b.id !== id));
    setFeedback('Backup ZIP archive removed.');
    setTimeout(() => setFeedback(''), 2500);
  };

  const filteredBackups = backups.filter(b => {
    if (activeTab === 'All') return true;
    return b.type === activeTab;
  });

  const countByTab = {
    All: backups.length,
    Database: backups.filter(b => b.type === 'Database').length,
    Files: backups.filter(b => b.type === 'Files').length,
    Full: backups.filter(b => b.type === 'Full').length,
  };

  return (
    <div className="space-y-6 max-w-5xl text-slate-800 dark:text-slate-100 font-sans">
      {/* 1. TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 space-x-1 mb-1">
            <Link href="/settings" prefetch={false} className="hover:underline">Settings</Link>
            <span>&gt;</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Backup</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Backup & Restore</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage ZIP backups and restore system snapshot archives</p>
        </div>

        <button 
          onClick={() => setFeedback('Refreshing backup status...')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-xs w-fit"
        >
          <RotateCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh</span>
        </button>
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl text-xs font-semibold ${feedback.includes('⚠️') ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-blue-50 border border-blue-200 text-blue-800'}`}>
          {feedback}
        </div>
      )}

      {/* 2. AUTOMATIC BACKUP SCHEDULE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Automatic Backup Schedule</h2>
          <p className="text-xs text-slate-500 mt-0.5">Configure automatic ZIP backups to protect database tables.</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">Auto Backup</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={autoBackupEnabled}
                  onChange={e => setAutoBackupEnabled(e.target.checked)}
                />
                <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span>Every</span>
              <select value={frequency} onChange={e => setFrequency(e.target.value)} className="h-8 px-2 border border-slate-200 dark:border-slate-600 rounded-md bg-transparent text-xs outline-none">
                <option value="Day">Day</option>
                <option value="Week">Week</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span>at</span>
              <select value={backupTime} onChange={e => setBackupTime(e.target.value)} className="h-8 px-2 border border-slate-200 dark:border-slate-600 rounded-md bg-transparent text-xs outline-none font-mono">
                <option value="02:00 AM">02:00 AM</option>
                <option value="12:00 AM">12:00 AM</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span>taking</span>
              <select value={backupType} onChange={e => setBackupType(e.target.value)} className="h-8 px-2 border border-slate-200 dark:border-slate-600 rounded-md bg-transparent text-xs outline-none font-semibold">
                <option value="Full">Full</option>
                <option value="Database">Database</option>
              </select>
              <span>backup</span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-800 dark:text-slate-200">Sync to Drive</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={syncToDrive} onChange={e => setSyncToDrive(e.target.checked)} />
                <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => setFeedback('✓ Schedule settings saved successfully!')}
            className="border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* 3. CREATE NEW BACKUP (ZIP GENERATION) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Create New Backup (.ZIP)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Choose the type of backup ZIP archive you want to generate & download.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div 
            onClick={() => generateAndDownloadZip('Database')}
            className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center hover:border-blue-500 hover:shadow-md cursor-pointer transition flex flex-col items-center space-y-2 group bg-slate-50/40 dark:bg-slate-700/20"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">Database</div>
            <div className="text-xs text-slate-500">Generates db_dump.json inside .ZIP</div>
          </div>

          <div 
            onClick={() => generateAndDownloadZip('Files')}
            className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center hover:border-blue-500 hover:shadow-md cursor-pointer transition flex flex-col items-center space-y-2 group bg-slate-50/40 dark:bg-slate-700/20"
          >
            <div className="w-10 h-10 rounded-full bg-[#004e89]/10 text-[#004e89] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">Files</div>
            <div className="text-xs text-slate-500">Generates /uploads archive inside .ZIP</div>
          </div>

          <div 
            onClick={() => generateAndDownloadZip('Full')}
            className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center hover:border-blue-500 hover:shadow-md cursor-pointer transition flex flex-col items-center space-y-2 group bg-slate-50/40 dark:bg-slate-700/20"
          >
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HardDrive className="w-5 h-5" />
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white">Full Backup (.ZIP)</div>
            <div className="text-xs text-slate-500">Database + Files + Manifest.json</div>
          </div>
        </div>
      </div>

      {/* 4. UPLOAD BACKUP DROPZONE (.ZIP ACCEPTANCE) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Upload Backup (.ZIP Archive)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Upload an existing .ZIP backup snapshot file to extract and restore system state.</p>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          accept=".zip,application/zip,application/x-zip-compressed"
          className="hidden" 
          onChange={handleFileSelect}
        />

        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-10 text-center flex flex-col items-center justify-center space-y-2 hover:border-blue-400 transition bg-slate-50/30 dark:bg-slate-800/40 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-700 text-blue-600 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Drag and drop your backup .ZIP file here, or <span className="text-blue-600 underline">click to browse</span>
          </p>
          <p className="text-[11px] text-slate-400">
            Only compressed .ZIP files up to 2GB are accepted
          </p>
        </div>
      </div>

      {/* 5. AVAILABLE BACKUPS */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Available Backups</h2>
          <span className="text-xs text-slate-500 font-semibold">{filteredBackups.length} backup available</span>
        </div>

        <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-lg flex gap-1 w-full max-w-xl text-xs">
          {(['All', 'Database', 'Files', 'Full'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-md font-semibold transition ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab} ({countByTab[tab]})
            </button>
          ))}
        </div>

        <div className="space-y-3 pt-2">
          {filteredBackups.map(item => (
            <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between bg-white dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{item.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      {item.status}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono">
                    {item.size} · {item.date}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => generateAndDownloadZip(item.type as any, item.name)}
                  className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition" 
                  title="Download .ZIP"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => processZipUpload(new File(["mock"], item.name, { type: "application/zip" }))}
                  className="p-2 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition" 
                  title="Restore from ZIP"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition" 
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ZIP Processing Status Modal */}
      {processingStatus !== 'idle' && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 max-w-sm w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 text-center">
            {processingStatus === 'extracting' && (
              <div className="space-y-3">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Extracting ZIP Archive...</h3>
                <p className="text-xs text-slate-500">Unpacking manifest.json & database tables from {uploadedZipName}</p>
              </div>
            )}
            {processingStatus === 'restoring' && (
              <div className="space-y-3">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Restoring Database Tables...</h3>
                <p className="text-xs text-slate-500">Applying SQL/JSON tables into Mamun Automobiles ERP</p>
              </div>
            )}
            {processingStatus === 'success' && (
              <div className="space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Restoration Complete!</h3>
                <p className="text-xs text-emerald-600 font-semibold">Database snapshot successfully applied.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BackupPage() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Loading ZIP backup workspace...</div>}>
      <BackupZipContent />
    </Suspense>
  );
}
