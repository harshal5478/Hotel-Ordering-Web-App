'use server';

import { createClient } from '@/lib/supabase/server';
import { OrderStatus } from '@/types';

export interface DailyDataPoint {
  date: string;
  ordersCount: number;
  revenue: number;
}

export interface PopularItem {
  itemName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface HotelAnalyticsData {
  period: 'today' | 'yesterday' | '7days' | '30days';
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  statusCounts: Record<OrderStatus, number>;
  dailyTrends: DailyDataPoint[];
  popularItems: PopularItem[];
}

export async function getHotelAnalytics(
  period: 'today' | 'yesterday' | '7days' | '30days' = 'today'
): Promise<HotelAnalyticsData> {
  const supabase = await createClient();

  // Consistent Date Boundaries Calculation
  const now = new Date();
  const startDate = new Date();
  const endDate = new Date();

  if (period === 'today') {
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  } else if (period === 'yesterday') {
    startDate.setDate(now.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);

    endDate.setDate(now.getDate() - 1);
    endDate.setHours(23, 59, 59, 999);
  } else if (period === '7days') {
    startDate.setDate(now.getDate() - 7);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  } else if (period === '30days') {
    startDate.setDate(now.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  }

  // 1. Query Orders in Date Range
  const { data: periodOrders, error: ordersErr } = await supabase
    .from('orders')
    .select('id, status, total_amount, created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (ordersErr || !periodOrders) {
    console.error('Error fetching analytics orders:', ordersErr);
    return {
      period,
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      statusCounts: {
        PENDING: 0,
        ACCEPTED: 0,
        PREPARING: 0,
        READY: 0,
        SERVED: 0,
        CANCELLED: 0,
      },
      dailyTrends: [],
      popularItems: [],
    };
  }

  // 2. Metrics Calculation
  const totalOrders = periodOrders.length;
  const nonCancelledOrders = periodOrders.filter((o) => o.status !== 'CANCELLED');
  const totalRevenue = nonCancelledOrders.reduce(
    (sum, o) => sum + (Number(o.total_amount) || 0),
    0
  );
  const averageOrderValue =
    nonCancelledOrders.length > 0 ? totalRevenue / nonCancelledOrders.length : 0;

  // 3. Status Counts Breakdown
  const statusCounts: Record<OrderStatus, number> = {
    PENDING: 0,
    ACCEPTED: 0,
    PREPARING: 0,
    READY: 0,
    SERVED: 0,
    CANCELLED: 0,
  };

  periodOrders.forEach((o) => {
    const st = o.status as OrderStatus;
    if (statusCounts[st] !== undefined) {
      statusCounts[st] += 1;
    }
  });

  // 4. Daily Trends Grouping (for 7days and 30days)
  const dailyMap = new Map<string, { ordersCount: number; revenue: number }>();

  periodOrders.forEach((o) => {
    const dateStr = new Date(o.created_at).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });

    const current = dailyMap.get(dateStr) || { ordersCount: 0, revenue: 0 };
    current.ordersCount += 1;
    if (o.status !== 'CANCELLED') {
      current.revenue += Number(o.total_amount) || 0;
    }
    dailyMap.set(dateStr, current);
  });

  const dailyTrends: DailyDataPoint[] = Array.from(dailyMap.entries()).map(
    ([date, val]) => ({
      date,
      ordersCount: val.ordersCount,
      revenue: val.revenue,
    })
  );

  // 5. Popular Items Aggregation
  const orderIds = nonCancelledOrders.map((o) => o.id);
  let popularItems: PopularItem[] = [];

  if (orderIds.length > 0) {
    const { data: itemRows } = await supabase
      .from('order_items')
      .select('item_name, quantity, price')
      .in('order_id', orderIds);

    if (itemRows && itemRows.length > 0) {
      const itemMap = new Map<string, { quantitySold: number; totalRevenue: number }>();

      itemRows.forEach((row) => {
        const name = row.item_name || 'Unknown Item';
        const qty = Number(row.quantity) || 1;
        const rev = (Number(row.price) || 0) * qty;

        const current = itemMap.get(name) || { quantitySold: 0, totalRevenue: 0 };
        current.quantitySold += qty;
        current.totalRevenue += rev;
        itemMap.set(name, current);
      });

      popularItems = Array.from(itemMap.entries())
        .map(([itemName, val]) => ({
          itemName,
          quantitySold: val.quantitySold,
          totalRevenue: val.totalRevenue,
        }))
        .sort((a, b) => b.quantitySold - a.quantitySold)
        .slice(0, 5); // Top 5
    }
  }

  return {
    period,
    totalOrders,
    totalRevenue,
    averageOrderValue,
    statusCounts,
    dailyTrends,
    popularItems,
  };
}
