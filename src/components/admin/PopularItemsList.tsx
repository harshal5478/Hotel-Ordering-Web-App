import React from 'react';
import { PopularItem } from '@/actions/analytics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Flame } from 'lucide-react';

interface PopularItemsListProps {
  items: PopularItem[];
}

export function PopularItemsList({ items }: PopularItemsListProps) {
  if (!items || items.length === 0) {
    return (
      <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-3 shadow-xs">
        <CardHeader className="p-0 pb-1">
          <CardTitle className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-500" />
            <span>Popular Menu Dishes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 py-6 text-center text-xs text-stone-400">
          No dish sales recorded for this period.
        </CardContent>
      </Card>
    );
  }

  const maxQty = Math.max(...items.map((i) => i.quantitySold), 1);

  return (
    <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-4 shadow-xs">
      <CardHeader className="p-0 pb-1 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Flame className="h-4 w-4 text-amber-500" />
          <span>Top Popular Dishes</span>
        </CardTitle>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
          By Quantity Sold
        </span>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {items.map((item, idx) => {
          const widthPercent = Math.max(10, Math.round((item.quantitySold / maxQty) * 100));

          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400 w-5">
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {item.itemName}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-stone-900 dark:text-stone-100">
                    {item.quantitySold} sold
                  </span>
                  <span className="text-stone-400 text-[11px] ml-2">
                    ({formatCurrency(item.totalRevenue)})
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${widthPercent}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
