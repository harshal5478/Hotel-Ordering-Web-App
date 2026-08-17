import React from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

interface AnalyticsHeaderProps {
  currentPeriod: 'today' | 'yesterday' | '7days' | '30days';
}

export function AnalyticsHeader({ currentPeriod }: AnalyticsHeaderProps) {
  const periods: { id: 'today' | 'yesterday' | '7days' | '30days'; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'yesterday', label: 'Yesterday' },
    { id: '7days', label: 'Last 7 Days' },
    { id: '30days', label: 'Last 30 Days' },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100">
          Hotel Analytics & Performance
        </h1>
        <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-1">
          Realtime sales revenue, average order value, popular dishes, and order volume.
        </p>
      </div>

      {/* Date Filter Bar */}
      <div className="flex items-center space-x-1.5 bg-stone-200/60 dark:bg-stone-800/60 p-1 rounded-xl border border-stone-200 dark:border-stone-700">
        <Calendar className="h-4 w-4 text-stone-400 ml-2 mr-1" />
        {periods.map((p) => {
          const isActive = currentPeriod === p.id;
          return (
            <Link
              key={p.id}
              href={`/admin?period=${p.id}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {p.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
