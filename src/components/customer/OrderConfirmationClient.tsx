'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  UtensilsCrossed,
  Sparkles,
  ArrowLeft,
  User,
  Phone,
  MessageSquare,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertTriangle,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatCurrency, getOrderStatusBadgeClass, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface OrderConfirmationClientProps {
  order: Order;
}

export function OrderConfirmationClient({ order }: OrderConfirmationClientProps) {
  const [currentOrder, setCurrentOrder] = useState<Order>(order);
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'reconnecting' | 'disconnected'
  >('connected');

  const tableNumber = currentOrder.tables?.table_number || 1;
  const shortOrderId = currentOrder.id.slice(0, 8).toUpperCase();

  // Supabase Realtime Subscription for this specific order
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`customer-order-${currentOrder.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${currentOrder.id}`,
        },
        (payload) => {
          const updated = payload.new as Partial<Order>;
          if (updated.status && updated.status !== currentOrder.status) {
            setCurrentOrder((prev) => ({
              ...prev,
              status: updated.status as OrderStatus,
              total_amount:
                updated.total_amount !== undefined
                  ? updated.total_amount
                  : prev.total_amount,
            }));

            toast.info(`Order Status Updated: ${updated.status}`, {
              duration: 5000,
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
        } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
          setConnectionStatus('disconnected');
        } else if (status === 'CLOSED') {
          setConnectionStatus('reconnecting');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentOrder.id, currentOrder.status]);

  const timelineSteps: { status: OrderStatus; label: string; description: string }[] = [
    {
      status: 'PENDING',
      label: 'Order Placed',
      description: 'Received by hotel system & waiting for staff acceptance',
    },
    {
      status: 'ACCEPTED',
      label: 'Order Accepted',
      description: 'Confirmed by manager / front desk',
    },
    {
      status: 'PREPARING',
      label: 'Kitchen Preparing',
      description: 'Chef line actively cooking your items',
    },
    {
      status: 'READY',
      label: 'Ready for Serving',
      description: 'Food plated and waiting for waiter',
    },
    {
      status: 'SERVED',
      label: 'Served to Table',
      description: 'Delivered to your table. Enjoy your meal!',
    },
  ];

  const statusOrder: Record<OrderStatus, number> = {
    PENDING: 1,
    ACCEPTED: 2,
    PREPARING: 3,
    READY: 4,
    SERVED: 5,
    CANCELLED: -1,
  };

  const currentStepLevel = statusOrder[currentOrder.status] || 1;

  return (
    <div className="space-y-4 pb-12">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center space-x-2">
          <Link
            href={`/menu?table=${tableNumber}`}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-extrabold text-lg text-stone-900 dark:text-stone-100">
            Order Confirmation
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          {connectionStatus === 'connected' ? (
            <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <Wifi className="h-3 w-3" />
              <span>Live Sync</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              <WifiOff className="h-3 w-3" />
              <span>Reconnecting...</span>
            </span>
          )}

          <button
            onClick={() => window.location.reload()}
            className="p-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 flex items-center space-x-1 text-xs font-semibold"
            title="Manual Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Status Header Card */}
      <Card className="p-5 border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent text-stone-900 dark:text-stone-100 text-center space-y-3 shadow-md">
        <div className="mx-auto h-14 w-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 shadow-inner">
          {currentOrder.status === 'SERVED' ? (
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          ) : currentOrder.status === 'PREPARING' ? (
            <ChefHat className="h-8 w-8 text-purple-500 animate-pulse" />
          ) : currentOrder.status === 'CANCELLED' ? (
            <AlertTriangle className="h-8 w-8 text-rose-500" />
          ) : (
            <Clock className="h-8 w-8 text-amber-500 animate-pulse" />
          )}
        </div>

        <div>
          <Badge
            variant="outline"
            className={cn('mb-2 text-xs font-black uppercase px-3 py-1', getOrderStatusBadgeClass(currentOrder.status))}
          >
            Status: {currentOrder.status}
          </Badge>
          <h2 className="font-black text-2xl text-stone-900 dark:text-stone-100">
            Order #{shortOrderId}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-semibold">
            Grand Palace Dining &bull; Table {tableNumber}
          </p>
        </div>
      </Card>

      {/* Live Order Timeline */}
      <Card className="p-4 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-4">
        <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Live Order Status Timeline</span>
          </h3>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
            Auto-Updates Live
          </span>
        </div>

        {currentOrder.status === 'CANCELLED' ? (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs font-semibold text-center space-y-1">
            <p className="font-bold text-sm">Order Cancelled</p>
            <p className="text-[11px] text-rose-300">
              This order was cancelled by hotel staff. Please speak with your waiter.
            </p>
          </div>
        ) : (
          <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
            {timelineSteps.map((step, idx) => {
              const stepLevel = idx + 1;
              const isCompleted = currentStepLevel > stepLevel;
              const isCurrent = currentStepLevel === stepLevel;

              return (
                <div key={step.status} className="relative flex items-start space-x-3">
                  <span
                    className={cn(
                      'absolute -left-6 h-5 w-5 rounded-full flex items-center justify-center font-black text-[10px] transition-all',
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-500/20'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                    )}
                  >
                    {isCompleted ? '✓' : stepLevel}
                  </span>

                  <div>
                    <h4
                      className={cn(
                        'text-xs font-bold leading-tight',
                        isCurrent
                          ? 'text-amber-600 dark:text-amber-400 font-black text-sm'
                          : isCompleted
                          ? 'text-stone-900 dark:text-stone-100'
                          : 'text-stone-400'
                      )}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Ordered Items Summary */}
      <Card className="p-4 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-stone-400">
          Ordered Items & Price Snapshot
        </h3>

        <div className="divide-y divide-stone-100 dark:divide-stone-800 space-y-2">
          {currentOrder.order_items?.map((item) => {
            const itemSubtotal = item.price * item.quantity;

            return (
              <div key={item.id} className="pt-2 first:pt-0 space-y-0.5">
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      {item.item_name}
                    </span>
                    <span className="text-stone-500 ml-1.5 font-semibold">
                      x{item.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {formatCurrency(itemSubtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>{formatCurrency(item.price)} each</span>
                  {item.item_note && (
                    <span className="text-amber-600 dark:text-amber-400 italic">
                      &bull; {item.item_note}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-stone-200 dark:border-stone-800 pt-3 flex justify-between items-center">
          <span className="font-black text-sm text-stone-900 dark:text-stone-100">
            Total Amount (Verified on Server)
          </span>
          <span className="text-lg font-black text-amber-600 dark:text-amber-400">
            {formatCurrency(currentOrder.total_amount)}
          </span>
        </div>
      </Card>

      {/* Guest & Note Details */}
      {(currentOrder.customer_name || currentOrder.customer_phone || currentOrder.order_note) && (
        <Card className="p-4 border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-2 text-xs">
          <h3 className="font-bold text-xs uppercase tracking-wider text-stone-400 mb-1">
            Order Details
          </h3>

          {currentOrder.customer_name && (
            <div className="flex items-center space-x-2 text-stone-700 dark:text-stone-300">
              <User className="h-3.5 w-3.5 text-stone-400" />
              <span>Guest: {currentOrder.customer_name}</span>
            </div>
          )}

          {currentOrder.customer_phone && (
            <div className="flex items-center space-x-2 text-stone-700 dark:text-stone-300">
              <Phone className="h-3.5 w-3.5 text-stone-400" />
              <span>Phone: {currentOrder.customer_phone}</span>
            </div>
          )}

          {currentOrder.order_note && (
            <div className="flex items-start space-x-2 text-stone-700 dark:text-stone-300 pt-1">
              <MessageSquare className="h-3.5 w-3.5 text-stone-400 shrink-0 mt-0.5" />
              <span>Note: &quot;{currentOrder.order_note}&quot;</span>
            </div>
          )}
        </Card>
      )}

      {/* Action Footer */}
      <div className="pt-2">
        <Link
          href={`/menu?table=${tableNumber}`}
          className="w-full py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
        >
          <UtensilsCrossed className="h-4 w-4" />
          <span>Add More Dishes to Table {tableNumber}</span>
        </Link>
      </div>
    </div>
  );
}
