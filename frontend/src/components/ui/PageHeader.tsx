'use client';

import React from 'react';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export default function PageHeader({
  title,
  subtitle,
  badgeText,
  actionText,
  actionHref,
  onActionClick,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {badgeText && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs font-medium text-slate-500 mt-1">{subtitle}</p>}
      </div>

      {actionText && actionHref && (
        <Link
          href={actionHref}
          prefetch={false}
          className="inline-flex items-center justify-center gap-2 bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shrink-0"
        >
          {actionText}
        </Link>
      )}

      {actionText && !actionHref && onActionClick && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center justify-center gap-2 bg-[#004e89] hover:bg-[#003d6c] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm shrink-0"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
