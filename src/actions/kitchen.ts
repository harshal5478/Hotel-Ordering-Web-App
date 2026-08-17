'use server';

import { createClient } from '@/lib/supabase/server';
import { Order, OrderStatus } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getKitchenOrders(): Promise<Order[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      tables (*),
      order_items (*)
    `)
    .order('created_at', { ascending: true });

  if (error || !data) {
    console.error('Error fetching kitchen orders:', error);
    return [];
  }

  return data as Order[];
}

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus
) {
  if (!orderId || !newStatus) {
    return { success: false, error: 'Invalid order or status parameter' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/kitchen');
  revalidatePath('/admin/orders');
  revalidatePath('/admin');
  revalidatePath(`/order/${orderId}`);

  return { success: true, newStatus };
}
