'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Check } from 'lucide-react';

interface AiInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  onSuggestionApplied?: (correctedText: string) => void;
}

export default function AiInput({
  value,
  onChange,
  label,
  className = '',
  onSuggestionApplied,
  ...props
}: AiInputProps) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!value || value.trim().length < 3) {
      setSuggestion(null);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/ai/suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: value }),
        });
        const data = await res.json();

        if (data.isError && data.corrected && data.corrected.trim() !== value.trim()) {
          setSuggestion(data.corrected.trim());
        } else {
          setSuggestion(null);
        }
      } catch (err) {
        console.error('AI Suggestion error:', err);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [value]);

  const applySuggestion = () => {
    if (!suggestion) return;
    
    // Synthetic Change Event creation
    const event = {
      target: { value: suggestion },
      currentTarget: { value: suggestion }
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(event);
    if (onSuggestionApplied) {
      onSuggestionApplied(suggestion);
    }
    setSuggestion(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      applySuggestion();
    }
    if (props.onKeyDown) {
      props.onKeyDown(e);
    }
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          {...props}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          className={`w-full text-xs px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition ${className}`}
        />
        {loading && (
          <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-spin absolute right-2.5" />
        )}
      </div>

      {/* Floating AI Suggestion Badge */}
      {suggestion && !loading && (
        <div className="mt-1 flex items-center justify-between gap-2 p-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-md text-[11px] shadow-sm animate-fade-in">
          <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-200 truncate">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-semibold shrink-0">AI Suggestion:</span>
            <span className="font-medium underline decoration-blue-400 truncate font-sans leading-relaxed">{suggestion}</span>
          </div>

          <button
            type="button"
            onClick={applySuggestion}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-0.5 rounded text-[10px] transition cursor-pointer shrink-0"
          >
            <Check className="w-3 h-3" />
            <span>Apply (Tab)</span>
          </button>
        </div>
      )}
    </div>
  );
}
