'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChefHat,
  Clock,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  BellRing,
  Flame,
  Check,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { updateOrderStatusAction, getKitchenOrders } from '@/actions/kitchen';
import { createClient } from '@/lib/supabase/client';
import { initAudioContext, playNewOrderChime } from '@/lib/audio';
import { getOrderStatusBadgeClass, cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface KitchenDisplayClientProps {
  initialOrders: Order[];
}

export function KitchenDisplayClient({
  initialOrders,
}: KitchenDisplayClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeFilter, setActiveFilter] = useState<
    'active' | 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'SERVED'
  >('active');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [nowTimestamp, setNowTimestamp] = useState(() => Date.now());

  // Periodically update age indicators every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Supabase Realtime Subscription Setup
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('kitchen-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newOrderPayload = payload.new as Order;
            toast.success(
              `NEW ORDER RECEIVED! Order #${newOrderPayload.id.slice(0, 6).toUpperCase()}`,
              { duration: 6000 }
            );

            if (soundEnabled) {
              playNewOrderChime();
            }

            const freshOrders = await getKitchenOrders();
            setOrders(freshOrders);
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrderPayload = payload.new as Order;
            setOrders((prevOrders) =>
              prevOrders.map((o) =>
                o.id === updatedOrderPayload.id
                  ? { ...o, status: updatedOrderPayload.status }
                  : o
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [soundEnabled]);

  const toggleSound = () => {
    if (!soundEnabled) {
      initAudioContext();
      playNewOrderChime();
      setSoundEnabled(true);
      toast.success('Kitchen sound alerts enabled');
    } else {
      setSoundEnabled(false);
      toast.info('Kitchen sound alerts disabled');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (!res.success) {
        toast.error(res.error || 'Failed to update order status');
      } else {
        toast.success(`Order status updated to ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch {
      toast.error('An unexpected error occurred while updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const refreshOrders = async () => {
    toast.info('Refreshing kitchen display...');
    const fresh = await getKitchenOrders();
    setOrders(fresh);
  };

  const getOrderAgeText = (createdAt: string) => {
    const createdTime = new Date(createdAt).getTime();
    const diffSeconds = Math.max(0, Math.floor((nowTimestamp - createdTime) / 1000));

    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h ago`;
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (activeFilter === 'active') {
        return order.status !== 'SERVED' && order.status !== 'CANCELLED';
      }
      return order.status === activeFilter;
    });
  }, [orders, activeFilter]);

  const counts = useMemo(() => {
    return {
      pending: orders.filter((o) => o.status === 'PENDING').length,
      accepted: orders.filter((o) => o.status === 'ACCEPTED').length,
      preparing: orders.filter((o) => o.status === 'PREPARING').length,
      ready: orders.filter((o) => o.status === 'READY').length,
      served: orders.filter((o) => o.status === 'SERVED').length,
    };
  }, [orders]);

  return (
    <div className="space-y-6 select-none pb-12">
      {/* Top Tablet-Friendly Control Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-stone-900 p-4 rounded-2xl border border-stone-800 shadow-md">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveFilter('active')}
            aria-label="Filter active kitchen orders"
            className={cn(
              'h-11 px-4 rounded-xl border transition-all flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-amber-500',
              activeFilter === 'active'
                ? 'bg-amber-500 text-stone-950 border-amber-400 font-extrabold shadow-sm'
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750'
            )}
          >
            <span>All Active</span>
            <span className="px-2 py-0.5 rounded-full bg-stone-950/20 text-stone-950 text-[10px] font-black">
              {counts.pending + counts.accepted + counts.preparing + counts.ready}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('PENDING')}
            aria-label="Filter new pending orders"
            className={cn(
              'h-11 px-4 rounded-xl border transition-all flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-amber-500',
              activeFilter === 'PENDING'
                ? 'bg-amber-500 text-stone-950 border-amber-400 font-extrabold shadow-sm'
                : 'bg-amber-950/40 text-amber-300 border-amber-800/80 hover:bg-amber-950/80'
            )}
          >
            <BellRing className="h-4 w-4 text-amber-400" />
            <span>New Orders</span>
            {counts.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black">
                {counts.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFilter('PREPARING')}
            aria-label="Filter preparing orders"
            className={cn(
              'h-11 px-4 rounded-xl border transition-all flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-purple-500',
              activeFilter === 'PREPARING'
                ? 'bg-purple-600 text-white border-purple-400 font-extrabold shadow-sm'
                : 'bg-purple-950/40 text-purple-300 border-purple-800/80 hover:bg-purple-950/80'
            )}
          >
            <Flame className="h-4 w-4 text-purple-400" />
            <span>Cooking</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-900 text-purple-200 text-[10px] font-black">
              {counts.preparing}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('READY')}
            aria-label="Filter ready orders"
            className={cn(
              'h-11 px-4 rounded-xl border transition-all flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-emerald-500',
              activeFilter === 'READY'
                ? 'bg-emerald-600 text-white border-emerald-400 font-extrabold shadow-sm'
                : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/80 hover:bg-emerald-950/80'
            )}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Ready</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 text-[10px] font-black">
              {counts.ready}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter('SERVED')}
            aria-label="Filter served history orders"
            className={cn(
              'h-11 px-4 rounded-xl border transition-all flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-stone-500',
              activeFilter === 'SERVED'
                ? 'bg-stone-700 text-white border-stone-600 font-extrabold shadow-sm'
                : 'bg-stone-850 text-stone-400 border-stone-800 hover:bg-stone-800'
            )}
          >
            <span>Served History</span>
            <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 text-[10px] font-black">
              {counts.served}
            </span>
          </button>
        </div>

        {/* Audio Toggle & Refresh Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Disable kitchen sound alerts' : 'Enable kitchen sound alerts'}
            className={cn(
              'h-11 px-4 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500',
              soundEnabled
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
            )}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-4 w-4 text-emerald-400" />
                <span>Sound Enabled</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4" />
                <span>Enable Sound</span>
              </>
            )}
          </button>

          <button
            onClick={refreshOrders}
            aria-label="Refresh kitchen orders feed"
            className="h-11 w-11 rounded-xl border border-stone-800 bg-stone-800 hover:bg-stone-750 text-stone-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-amber-500"
            title="Manual Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Kitchen Order Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const tableNum = order.tables?.table_number || '?';
            const shortId = order.id.slice(0, 6).toUpperCase();
            const ageText = getOrderAgeText(order.created_at);
            const isUpdating = updatingId === order.id;

            const isPending = order.status === 'PENDING';
            const isAccepted = order.status === 'ACCEPTED';
            const isPreparing = order.status === 'PREPARING';
            const isReady = order.status === 'READY';
            const isServed = order.status === 'SERVED';

            return (
              <Card
                key={order.id}
                className={cn(
                  'border-2 bg-stone-900 text-stone-100 overflow-hidden flex flex-col justify-between transition-colors shadow-xl relative',
                  isPending && 'border-amber-500 bg-amber-950/20 ring-4 ring-amber-500/10',
                  isAccepted && 'border-blue-500',
                  isPreparing && 'border-purple-500',
                  isReady && 'border-emerald-500 ring-4 ring-emerald-500/10',
                  isServed && 'border-stone-800 opacity-60'
                )}
              >
                {/* Flashing Tag for Pending New Orders */}
                {isPending && (
                  <div className="bg-amber-500 text-stone-950 font-black text-xs tracking-widest uppercase text-center py-1.5 px-2 flex items-center justify-center space-x-1">
                    <Sparkles className="h-3.5 w-3.5 stroke-[3]" />
                    <span>NEW UNACCEPTED ORDER</span>
                  </div>
                )}

                {/* Card Header - Large Table & Order ID */}
                <div className="p-4 bg-stone-850/90 border-b border-stone-800 flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-black text-white tracking-tight">
                        TABLE {tableNum}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-400">
                      #{shortId} &bull; {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-right flex flex-col items-end space-y-1">
                    <Badge
                      variant="outline"
                      className={cn('text-xs font-black uppercase px-3 py-1', getOrderStatusBadgeClass(order.status))}
                    >
                      {order.status}
                    </Badge>

                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1 bg-stone-950/90 px-2.5 py-1 rounded-full border border-stone-800">
                      <Clock className="h-3.5 w-3.5" />
                      {ageText}
                    </span>
                  </div>
                </div>

                {/* Card Body - Very Large Readable Itemized Dishes */}
                <div className="p-4 flex-1 space-y-3">
                  <div className="space-y-3">
                    {order.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="pb-2.5 border-b border-stone-800/80 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-black text-lg sm:text-xl text-white leading-snug">
                            {item.item_name}
                          </span>
                          <span className="bg-amber-500 text-stone-950 font-black text-base px-3 py-1 rounded-xl ml-2 shrink-0 shadow-md">
                            ×{item.quantity}
                          </span>
                        </div>

                        {item.item_note && (
                          <p className="text-xs text-amber-300 font-bold italic mt-1 bg-amber-950/60 p-2 rounded-lg border border-amber-800/60">
                            &bull; Note: {item.item_note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Customer / Overall Order Notes */}
                  {(order.customer_name || order.order_note) && (
                    <div className="pt-2 space-y-1.5">
                      {order.customer_name && (
                        <p className="text-xs font-semibold text-stone-400">
                          Guest: <span className="text-white font-bold">{order.customer_name}</span>
                        </p>
                      )}
                      {order.order_note && (
                        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs font-semibold flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                          <div>
                            <span className="font-bold text-rose-300 block text-[10px] uppercase tracking-wider">
                              Kitchen Instructions:
                            </span>
                            <span className="text-sm font-bold text-white">{order.order_note}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action Controls Footer (Min 48px Height Tablet Touch Targets) */}
                <div className="p-3 bg-stone-950 border-t border-stone-800 space-y-2">
                  <div className="grid grid-cols-1 gap-2">
                    {isPending && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'ACCEPTED')}
                        disabled={isUpdating}
                        aria-label={`Accept Order #${shortId}`}
                        className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      >
                        {isUpdating ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4 stroke-[3]" />
                            <span>ACCEPT ORDER</span>
                          </>
                        )}
                      </button>
                    )}

                    {isAccepted && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'PREPARING')}
                        disabled={isUpdating}
                        aria-label={`Start preparing Order #${shortId}`}
                        className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        {isUpdating ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Flame className="h-4 w-4" />
                            <span>START PREPARING / COOKING</span>
                          </>
                        )}
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'READY')}
                        disabled={isUpdating}
                        aria-label={`Mark Order #${shortId} ready`}
                        className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      >
                        {isUpdating ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>MARK READY FOR SERVE</span>
                          </>
                        )}
                      </button>
                    )}

                    {isReady && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'SERVED')}
                        disabled={isUpdating}
                        aria-label={`Mark Order #${shortId} served`}
                        className="w-full h-12 rounded-xl bg-stone-700 hover:bg-stone-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-stone-400"
                      >
                        {isUpdating ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            <span>MARK SERVED TO TABLE</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Cancel Option for Non-Served Orders */}
                  {!isServed && order.status !== 'CANCELLED' && (
                    <button
                      onClick={() => {
                        if (confirm(`Cancel Order #${shortId} for Table ${tableNum}?`)) {
                          handleStatusChange(order.id, 'CANCELLED');
                        }
                      }}
                      aria-label={`Cancel Order #${shortId}`}
                      className="w-full text-center text-xs text-stone-500 hover:text-rose-400 font-semibold transition-colors py-1.5 flex items-center justify-center space-x-1"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Cancel Order</span>
                    </button>
                  )}
                </div>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full p-12 text-center text-stone-500 border border-dashed border-stone-800 rounded-2xl bg-stone-900/50 space-y-2">
            <ChefHat className="h-10 w-10 mx-auto text-stone-600" />
            <h3 className="text-base font-bold text-stone-300">
              No Kitchen Orders in this View
            </h3>
            <p className="text-xs text-stone-500">
              New customer orders submitted at dining tables will trigger realtime notifications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
