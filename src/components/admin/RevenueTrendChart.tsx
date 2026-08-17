import React from 'react';
import { DailyDataPoint } from '@/actions/analytics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

interface RevenueTrendChartProps {
  data: DailyDataPoint[];
}

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 text-center text-xs text-stone-400">
        No sales data recorded for the selected period.
      </Card>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-4 shadow-xs">
      <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-amber-500" />
          <span>Daily Sales Revenue Trend</span>
        </CardTitle>
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
          Sales vs Date
        </span>
      </CardHeader>

      <CardContent className="p-0 pt-2">
        <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2 border-b border-stone-100 dark:border-stone-800">
          {data.map((item, idx) => {
            const heightPercent = Math.max(8, Math.round((item.revenue / maxRevenue) * 100));

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-1 group relative"
              >
                {/* Tooltip on Hover */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-950 text-white text-[10px] font-bold p-1.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20">
                  <p>{item.date}</p>
                  <p className="text-amber-400">{formatCurrency(item.revenue)}</p>
                  <p className="text-stone-400">{item.ordersCount} orders</p>
                </div>

                {/* Bar Column */}
                <div className="w-full bg-stone-100 dark:bg-stone-800/60 rounded-t-lg overflow-hidden flex items-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-amber-600 to-amber-400 group-hover:to-amber-300 transition-all rounded-t-lg"
                  />
                </div>

                <span className="text-[10px] font-semibold text-stone-400 truncate max-w-[40px]">
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
