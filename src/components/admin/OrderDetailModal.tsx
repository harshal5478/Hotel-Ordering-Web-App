'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  MessageSquare,
  Clock,
  Loader2,
  Utensils,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatCurrency, getOrderStatusBadgeClass, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { updateAdminOrderStatus } from '@/actions/orderManagement';
import { toast } from 'sonner';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onOrderUpdated: (updatedOrder: Order) => void;
}

export function OrderDetailModal({
  order,
  onClose,
  onOrderUpdated,
}: OrderDetailModalProps) {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [submitting, setSubmitting] = useState(false);

  const tableNumber = order.tables?.table_number || '?';
  const shortId = order.id.slice(0, 8).toUpperCase();
  const formattedTime = new Date(order.created_at).toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const statuses: OrderStatus[] = [
    'PENDING',
    'ACCEPTED',
    'PREPARING',
    'READY',
    'SERVED',
    'CANCELLED',
  ];

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) return;

    if (
      newStatus === 'CANCELLED' &&
      !confirm(`Are you sure you want to CANCEL Order #${shortId}?`)
    ) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await updateAdminOrderStatus(order.id, newStatus);
      if (!res.success) {
        toast.error(res.error || 'Failed to update order status');
      } else {
        toast.success(`Order #${shortId} status updated to ${newStatus}`);
        setCurrentStatus(newStatus);
        onOrderUpdated({ ...order, status: newStatus });
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <Card className="w-full max-w-lg bg-stone-900 border-stone-800 text-stone-100 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-stone-400 hover:text-white p-1"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black text-white">Order #{shortId}</span>
            <Badge
              variant="outline"
              className={cn(
                'text-[10px] font-black uppercase px-2.5 py-0.5',
                getOrderStatusBadgeClass(currentStatus)
              )}
            >
              {currentStatus}
            </Badge>
          </div>

          <div className="flex items-center space-x-3 text-xs text-stone-400 mt-1 font-semibold">
            <span className="text-amber-400 font-extrabold">Table {tableNumber}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Status Selector Control */}
        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
          <label className="text-xs font-bold text-stone-300 block">
            Update Order Status
          </label>
          <div className="flex items-center space-x-2">
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              disabled={submitting}
              className="flex-1 h-9 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs font-extrabold text-amber-400 focus:outline-none"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {submitting && <Loader2 className="h-4 w-4 animate-spin text-amber-400" />}
          </div>
        </div>

        {/* Itemized Snapshot Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Utensils className="h-3.5 w-3.5 text-amber-500" />
            <span>Ordered Items & Price Snapshot</span>
          </h4>

          <div className="bg-stone-950 rounded-xl border border-stone-800 divide-y divide-stone-800/80 p-3 space-y-2">
            {order.order_items?.map((item) => {
              const itemSubtotal = item.price * item.quantity;
              return (
                <div key={item.id} className="pt-2 first:pt-0 space-y-0.5">
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <span className="font-extrabold text-white">
                        {item.item_name}
                      </span>
                      <span className="text-amber-400 font-black ml-2">
                        x{item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-white">
                      {formatCurrency(itemSubtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] text-stone-400">
                    <span>{formatCurrency(item.price)} each</span>
                    {item.item_note && (
                      <span className="text-amber-400 italic">
                        &bull; {item.item_note}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="pt-3 border-t border-stone-800 flex justify-between items-center text-sm font-black">
              <span className="text-stone-300">Total Bill Amount</span>
              <span className="text-amber-400 text-base">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Kitchen Notes */}
        {(order.customer_name || order.customer_phone || order.order_note) && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Customer Details & Instructions
            </h4>

            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2 text-xs">
              {order.customer_name && (
                <div className="flex items-center space-x-2 text-stone-300">
                  <User className="h-3.5 w-3.5 text-stone-400" />
                  <span>Guest: {order.customer_name}</span>
                </div>
              )}

              {order.customer_phone && (
                <div className="flex items-center space-x-2 text-stone-300">
                  <Phone className="h-3.5 w-3.5 text-stone-400" />
                  <span>Phone: {order.customer_phone}</span>
                </div>
              )}

              {order.order_note && (
                <div className="flex items-start space-x-2 text-stone-300 pt-1">
                  <MessageSquare className="h-3.5 w-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span>Kitchen Note: &quot;{order.order_note}&quot;</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="button"
            onClick={onClose}
            className="w-full text-xs font-bold bg-stone-800 hover:bg-stone-700 text-white"
          >
            Close Order View
          </Button>
        </div>
      </Card>
    </div>
  );
}
