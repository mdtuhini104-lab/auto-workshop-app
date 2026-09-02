'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 space-y-4">
      <h2 className="text-xl font-bold">Something went wrong!</h2>
      <p className="text-xs text-slate-400 font-mono bg-slate-800 p-3 rounded max-w-md overflow-x-auto">
        {error?.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition"
      >
        Try again
      </button>
    </div>
  );
}
