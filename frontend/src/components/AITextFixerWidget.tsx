'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Copy, Check, Languages, GripVertical, Minus } from 'lucide-react';

export default function AITextFixerWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Screen coordinates state
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Initialize default position on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPosition({
        x: Math.max(10, window.innerWidth - 320),
        y: Math.max(10, window.innerHeight - 80)
      });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();

    const currentX = position ? position.x : (window.innerWidth - 320);
    const currentY = position ? position.y : (window.innerHeight - 80);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: currentX,
      posY: currentY
    };

    setIsDragging(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.startX;
      const dy = moveEvent.clientY - dragStartRef.current.startY;

      const widgetWidth = widgetRef.current?.offsetWidth || 280;
      const widgetHeight = widgetRef.current?.offsetHeight || 60;

      const newX = Math.max(10, Math.min(window.innerWidth - widgetWidth - 10, dragStartRef.current.posX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - widgetHeight - 10, dragStartRef.current.posY + dy));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleProcess = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setCopied(false);

    try {
      const res = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      if (data.translated || data.result) {
        setOutput(data.translated || data.result);
      } else {
        setOutput('Could not process input text.');
      }
    } catch (error) {
      console.error('AI Error:', error);
      setOutput('Error connecting to AI service.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const style: React.CSSProperties = position
    ? {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        userSelect: isDragging ? 'none' : 'auto',
      }
    : {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        userSelect: isDragging ? 'none' : 'auto',
      };

  return (
    <div ref={widgetRef} style={style} className="select-none">
      {/* MINIMIZED CIRCULAR ICON */}
      {isMinimized && (
        <div className="relative group flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1 rounded-full shadow-2xl border-2 border-white/20">
          <div
            onMouseDown={handleMouseDown}
            title="Drag to move widget"
            className="cursor-grab active:cursor-grabbing p-1 text-white/70 hover:text-white transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <button
            onClick={() => setIsMinimized(false)}
            title="Expand AI Text Fixer & Translator"
            className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
          </button>
          <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block whitespace-nowrap bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-lg border border-slate-700">
            AI Text Fixer (Click to expand / Drag grip to move)
          </span>
        </div>
      )}

      {/* FULL UN-MINIMIZED FLOATING BUTTON */}
      {!isMinimized && !isOpen && (
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2.5 rounded-full shadow-2xl border border-white/20 hover:shadow-blue-500/25 transition-all">
          {/* Drag Handle */}
          <div
            onMouseDown={handleMouseDown}
            title="Drag to move widget"
            className="cursor-grab active:cursor-grabbing p-1 text-white/70 hover:text-white transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Main Clickable Button to Open Modal */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white pr-1"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
            <span>AI Text Fixer & Translator</span>
          </button>

          {/* Minimize / Collapse Toggle Button */}
          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize widget"
            className="p-1 hover:bg-white/20 rounded-full cursor-pointer transition-colors text-white/80 hover:text-white"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* OPEN EXPANDED MODAL CARD */}
      {!isMinimized && isOpen && (
        <div className="w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header with Drag Handle */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                onMouseDown={handleMouseDown}
                title="Drag to move modal"
                className="cursor-grab active:cursor-grabbing p-1 text-white/70 hover:text-white rounded transition-colors"
              >
                <GripVertical className="w-4 h-4" />
              </div>
              <Languages className="w-5 h-5 text-amber-300" />
              <div>
                <h3 className="font-bold text-sm leading-tight">AI Repair Note Fixer</h3>
                <p className="text-[10px] text-blue-100">Mamun Automobiles ERP Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                title="Minimize widget"
                className="p-1 rounded-lg hover:bg-white/20 transition cursor-pointer text-white/80 hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close modal"
                className="p-1 rounded-lg hover:bg-white/20 transition cursor-pointer text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter Mechanics Notes (Bangla / Banglish / Misspelled):
              </label>
              <textarea
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='e.g., "সামনের brak pad change kora hoise" or "spake plug mobil clean"'
                className="w-full text-xs p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleProcess}
              disabled={loading || !input.trim()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold py-2.5 rounded-lg transition cursor-pointer"
            >
              {loading ? (
                <span>Fixing & Translating...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Fix Spelling & Translate</span>
                </>
              )}
            </button>

            {output && (
              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Corrected Result
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {output}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
