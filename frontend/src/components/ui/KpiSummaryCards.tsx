'use client';

import React from 'react';
import { KpiCardItem } from '../../types/erp';

interface KpiSummaryCardsProps {
  cards: KpiCardItem[];
}

export default function KpiSummaryCards({ cards }: KpiSummaryCardsProps) {
  const getBadgeStyle = (type?: string) => {
    switch (type) {
      case 'success':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'warning':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'danger':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'info':
      default:
        return 'text-[#004e89] bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</p>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-black text-slate-900">{card.value}</p>
            {card.badge && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyle(card.badgeType)}`}>
                {card.badge}
              </span>
            )}
            {card.subtitle && !card.badge && (
              <span className="text-xs font-medium text-slate-400">{card.subtitle}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
