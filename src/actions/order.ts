'use server';

import { createClient } from '@/lib/supabase/server';
import { CreateOrderSchema, CreateOrderInputSchemaType } from '@/lib/validations';
import { Order } from '@/types';

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  totalAmount?: number;
  error?: string;
}

export async function createOrderAction(
  input: CreateOrderInputSchemaType
): Promise<CreateOrderResult> {
  // 1. Zod Schema Validation
  const validation = CreateOrderSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid order parameters',
    };
  }

  const { table_id, customer_name, customer_phone, order_note, items } = validation.data;
  const supabase = await createClient();

  try {
    // Attempt RPC call for atomic execution
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      'create_customer_order',
      {
        p_table_id: table_id,
        p_customer_name: customer_name || '',
        p_customer_phone: customer_phone || '',
        p_order_note: order_note || '',
        p_items: items,
      }
    );

    if (!rpcError && rpcResult && rpcResult.success) {
      return {
        success: true,
        orderId: rpcResult.order_id,
        totalAmount: rpcResult.total_amount,
      };
    }

    // Fallback: Direct server transaction verification if RPC is not yet created in DB
    const { data: tableData, error: tableErr } = await supabase
      .from('tables')
      .select('id')
      .eq('id', table_id)
      .eq('is_active', true)
      .single();

    if (tableErr || !tableData) {
      return {
        success: false,
        error: 'Invalid or inactive dining table configuration',
      };
    }

    // Fetch actual menu items from DB to verify price & availability
    const menuItemIds = items.map((i) => i.menu_item_id);
    const { data: dbMenuItems, error: menuErr } = await supabase
      .from('menu_items')
      .select('id, name, price, is_available')
      .in('id', menuItemIds);

    if (menuErr || !dbMenuItems || dbMenuItems.length === 0) {
      return {
        success: false,
        error: 'One or more items in your cart no longer exist',
      };
    }

    // Server-calculated total
    let calculatedTotal = 0;
    const orderItemsToInsert = [];

    for (const userItem of items) {
      const dbItem = dbMenuItems.find((m) => m.id === userItem.menu_item_id);
      if (!dbItem) {
        return {
          success: false,
          error: 'An item in your cart is no longer available',
        };
      }

      if (!dbItem.is_available) {
        return {
          success: false,
          error: `Item "${dbItem.name}" is currently sold out`,
        };
      }

      const itemTotal = dbItem.price * userItem.quantity;
      calculatedTotal += itemTotal;

      orderItemsToInsert.push({
        menu_item_id: dbItem.id,
        item_name: dbItem.name,
        quantity: userItem.quantity,
        price: dbItem.price,
        item_note: userItem.item_note || '',
      });
    }

    // Create Order
    const { data: createdOrder, error: orderErr } = await supabase
      .from('orders')
      .insert({
        table_id,
        status: 'PENDING',
        total_amount: calculatedTotal,
        customer_name: customer_name || null,
        customer_phone: customer_phone || null,
        order_note: order_note || null,
      })
      .select('id')
      .single();

    if (orderErr || !createdOrder) {
      return {
        success: false,
        error: 'Failed to record order: ' + (orderErr?.message || 'Database error'),
      };
    }

    // Create Order Items
    const itemsWithOrderId = orderItemsToInsert.map((item) => ({
      ...item,
      order_id: createdOrder.id,
    }));

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);

    if (itemsErr) {
      // Emergency cleanup if items fail
      await supabase.from('orders').delete().eq('id', createdOrder.id);
      return {
        success: false,
        error: 'Failed to record order items. Transaction rolled back.',
      };
    }

    return {
      success: true,
      orderId: createdOrder.id,
      totalAmount: calculatedTotal,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected order creation failure';
    return {
      success: false,
      error: message,
    };
  }
}

export async function getOrderDetails(orderId: string): Promise<Order | null> {
  if (!orderId || typeof orderId !== 'string') return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      tables (*),
      order_items (*)
    `)
    .eq('id', orderId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Order;
}
