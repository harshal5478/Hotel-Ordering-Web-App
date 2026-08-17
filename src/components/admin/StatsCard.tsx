import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  variant?: 'default' | 'pending' | 'preparing' | 'ready' | 'revenue';
}

export function StatsCard({
  title,
  value,
  icon,
  subtitle,
  variant = 'default',
}: StatsCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'pending':
        return 'border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400';
      case 'preparing':
        return 'border-purple-500/30 bg-purple-500/5 text-purple-600 dark:text-purple-400';
      case 'ready':
        return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400';
      case 'revenue':
        return 'border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400';
      default:
        return 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-amber-500';
    }
  };

  return (
    <Card className={cn('border bg-white dark:bg-stone-900 transition-all hover:shadow-md', getVariantStyles())}>
      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className="p-3 bg-white/80 dark:bg-stone-800/80 rounded-2xl shadow-xs border border-stone-200/50 dark:border-stone-700/50">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
