'use client';

import React, { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { OrderStatus } from '@/types';
import { ChefHat, CheckCircle2, UtensilsCrossed, AlertTriangle } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function GlobalOrderNotifier() {
  const { recentOrderIds } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!recentOrderIds || recentOrderIds.length === 0) return;

    const supabase = createClient();
    
    // Subscribe to all recent orders
    const channel = supabase
      .channel('global-customer-orders')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=in.(${recentOrderIds.map(id => `"${id}"`).join(',')})`,
        },
        (payload) => {
          const updated = payload.new;
          const status = updated.status as OrderStatus;
          const shortId = updated.id.slice(0, 8).toUpperCase();
          
          // Don't show toast if user is already on that specific order's tracking page
          if (pathname === `/order/${updated.id}`) return;
          
          if (status === 'PREPARING') {
            toast('Order Preparing', {
              icon: <ChefHat className="h-5 w-5 text-purple-500" />,
              description: `Kitchen started preparing Order #${shortId}.`,
              action: {
                label: 'View',
                onClick: () => router.push(`/order/${updated.id}`)
              }
            });
          } else if (status === 'READY') {
            toast('Order Ready!', {
              icon: <UtensilsCrossed className="h-5 w-5 text-amber-500" />,
              description: `Order #${shortId} is ready to be served.`,
              action: {
                label: 'View',
                onClick: () => router.push(`/order/${updated.id}`)
              }
            });
          } else if (status === 'SERVED') {
            toast('Order Served', {
              icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
              description: `Order #${shortId} has been served. Enjoy!`,
              action: {
                label: 'View',
                onClick: () => router.push(`/order/${updated.id}`)
              }
            });
          } else if (status === 'CANCELLED') {
            toast.error('Order Cancelled', {
              icon: <AlertTriangle className="h-5 w-5 text-rose-500" />,
              description: `Order #${shortId} was cancelled.`,
              action: {
                label: 'View',
                onClick: () => router.push(`/order/${updated.id}`)
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recentOrderIds, pathname, router]);

  return null;
}
