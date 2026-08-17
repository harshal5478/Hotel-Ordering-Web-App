import React from 'react';
import Link from 'next/link';
import { ClipboardList, ExternalLink } from 'lucide-react';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/shared/EmptyState';

interface RecentOrdersProps {
  orders: Order[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6">
        <EmptyState
          icon={<ClipboardList className="h-8 w-8 text-stone-400" />}
          title="No Recent Orders"
          description="Orders submitted by customers at dining tables will appear here live."
        />
      </Card>
    );
  }

  return (
    <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 overflow-hidden shadow-xs">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between border-b border-stone-100 dark:border-stone-800">
        <CardTitle className="text-base font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-amber-500" />
          <span>Recent Customer Orders</span>
        </CardTitle>

        <Link
          href="/admin/orders"
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>View All Orders</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
            <thead className="bg-stone-50 dark:bg-stone-800/50 uppercase text-[10px] tracking-wider text-stone-500 font-bold border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Table</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {orders.map((order) => {
                const shortId = order.id.slice(0, 8).toUpperCase();
                const tableNum = order.tables?.table_number || '?';
                const formattedTime = new Date(order.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={order.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-stone-900 dark:text-stone-100">
                      #{shortId}
                    </td>
                    <td className="p-4 font-extrabold text-amber-600 dark:text-amber-400">
                      Table {tableNum}
                    </td>
                    <td className="p-4 font-black text-stone-900 dark:text-stone-100">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="p-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="p-4 text-right font-medium text-stone-400">
                      {formattedTime}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
