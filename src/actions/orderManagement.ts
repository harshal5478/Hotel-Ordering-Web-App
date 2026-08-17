'use server';

import { createClient } from '@/lib/supabase/server';
import { Order, OrderStatus } from '@/types';
import { revalidatePath } from 'next/cache';

export interface GetOrdersParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: OrderStatus | 'ALL';
  period?: 'today' | '7days' | 'all';
  tableId?: string;
}

export interface GetOrdersResult {
  orders: Order[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export async function getAdminOrders(
  params: GetOrdersParams = {}
): Promise<GetOrdersResult> {
  const page = Math.max(1, params.page || 1);
  const pageSize = params.pageSize || 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createClient();

  let query = supabase
    .from('orders')
    .select(
      `
      *,
      tables (*),
      order_items (*)
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false });

  // 1. Status Filter
  if (params.status && params.status !== 'ALL') {
    query = query.eq('status', params.status);
  }

  // 2. Table Filter
  if (params.tableId && params.tableId !== 'ALL') {
    query = query.eq('table_id', params.tableId);
  }

  // 3. Date Period Filter
  if (params.period && params.period !== 'all') {
    const now = new Date();
    if (params.period === 'today') {
      now.setHours(0, 0, 0, 0);
      query = query.gte('created_at', now.toISOString());
    } else if (params.period === '7days') {
      now.setDate(now.getDate() - 7);
      query = query.gte('created_at', now.toISOString());
    }
  }

  // 4. Search Filter (by UUID or customer details)
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim();
    query = query.or(
      `id.ilike.%${term}%,customer_name.ilike.%${term}%,customer_phone.ilike.%${term}%`
    );
  }

  // Pagination bounds
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error || !data) {
    console.error('Error fetching admin orders:', error);
    return {
      orders: [],
      totalCount: 0,
      totalPages: 1,
      currentPage: 1,
    };
  }

  const totalCount = count || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return {
    orders: data as Order[],
    totalCount,
    totalPages,
    currentPage: page,
  };
}

export async function updateAdminOrderStatus(
  orderId: string,
  newStatus: OrderStatus
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status in admin:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
  revalidatePath('/kitchen');
  revalidatePath(`/order/${orderId}`);

  return { success: true };
}
