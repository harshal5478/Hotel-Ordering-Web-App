'use server';

import { createClient } from '@/lib/supabase/server';
import { Table, Category, MenuItem } from '@/types';

export async function getValidatedTable(
  tableParam: string | undefined | null
): Promise<Table | null> {
  if (!tableParam || typeof tableParam !== 'string') {
    return null;
  }

  const supabase = await createClient();

  const trimmed = tableParam.trim();
  const isNumeric = /^\d+$/.test(trimmed);

  let query = supabase.from('tables').select('*').eq('is_active', true);

  if (isNumeric) {
    query = query.eq('table_number', parseInt(trimmed, 10));
  } else {
    query = query.eq('qr_token', trimmed);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return null;
  }

  return data as Table;
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
