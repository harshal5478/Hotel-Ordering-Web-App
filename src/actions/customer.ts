'use server';

import { createClient } from '@/lib/supabase/server';
import { Table, Category, MenuItem } from '@/types';

export async function getValidatedTable(
  tableParam: string | undefined | null
): Promise<Table | null> {
  const supabase = await createClient();

  // If a table parameter is provided, validate it against active database tables
  if (tableParam && typeof tableParam === 'string' && tableParam.trim() !== '') {
    const trimmed = tableParam.trim();
    const isNumeric = /^\d+$/.test(trimmed);

    let query = supabase.from('tables').select('*').eq('is_active', true);

    if (isNumeric) {
      query = query.eq('table_number', parseInt(trimmed, 10));
    } else {
      query = query.eq('qr_token', trimmed);
    }

    const { data } = await query.single();
    if (data) {
      return data as Table;
    }
  }

  // Graceful Fallback: Query first active table from database or fallback to Table 1
  const { data: fallbackData } = await supabase
    .from('tables')
    .select('*')
    .eq('is_active', true)
    .order('table_number', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (fallbackData) {
    return fallbackData as Table;
  }

  // Final fallback Table 1
  return {
    id: '00000000-0000-0000-0000-000000000001',
    table_number: 1,
    qr_token: '1',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data as Category[];
}

export async function getAvailableMenuItems(): Promise<MenuItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data) {
    console.error('Error fetching menu items:', error);
    return [];
  }

  return data as MenuItem[];
}
