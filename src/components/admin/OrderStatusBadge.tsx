import React from 'react';
import { OrderStatus } from '@/types';
import { getOrderStatusBadgeClass, cn } from '@/lib/utils';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border transition-colors',
        getOrderStatusBadgeClass(status),
        className
      )}
    >
      {status}
    </span>
  );
}
