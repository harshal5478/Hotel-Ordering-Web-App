'use server';

import { createClient } from '@/lib/supabase/server';
import { Order } from '@/types';

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
}

export async function getDashboardStats(
  period: 'today' | '7days' | 'all' = 'today'
): Promise<DashboardStats> {
  const supabase = await createClient();

  let dateFilter: string | null = null;
  const now = new Date();

  if (period === 'today') {
    now.setHours(0, 0, 0, 0);
    dateFilter = now.toISOString();
  } else if (period === '7days') {
    now.setDate(now.getDate() - 7);
    dateFilter = now.toISOString();
  }

  // 1. Fetch Orders for the period
  let query = supabase.from('orders').select('status, total_amount, created_at');
  if (dateFilter) {
    query = query.gte('created_at', dateFilter);
  }

  const { data: periodOrders, error: periodErr } = await query;

  if (periodErr || !periodOrders) {
    console.error('Error fetching dashboard stats:', periodErr);
    return {
      todayOrders: 0,
      todayRevenue: 0,
      pendingOrders: 0,
      preparingOrders: 0,
      readyOrders: 0,
    };
  }

  const totalOrdersCount = periodOrders.length;

  const totalRevenueSum = periodOrders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  // 2. Fetch live active statuses (PENDING, PREPARING, READY) across all active orders
  const { data: activeOrders } = await supabase
    .from('orders')
    .select('status')
    .in('status', ['PENDING', 'PREPARING', 'READY']);

  const pendingCount = activeOrders?.filter((o) => o.status === 'PENDING').length || 0;
  const preparingCount = activeOrders?.filter((o) => o.status === 'PREPARING').length || 0;
  const readyCount = activeOrders?.filter((o) => o.status === 'READY').length || 0;

  return {
    todayOrders: totalOrdersCount,
    todayRevenue: totalRevenueSum,
    pendingOrders: pendingCount,
    preparingOrders: preparingCount,
    readyOrders: readyCount,
  };
}

export async function getRecentOrders(limit = 10): Promise<Order[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      tables (*)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error('Error fetching recent orders:', error);
    return [];
  }

  return data as Order[];
}
