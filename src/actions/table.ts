'use server';

import { createClient } from '@/lib/supabase/server';
import { TableSchema, TableFormInput } from '@/lib/validations';
import { Table } from '@/types';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function getAllTables(): Promise<Table[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .order('table_number', { ascending: true });

  if (error || !data) {
    console.error('Error fetching tables:', error);
    return [];
  }

  return data as Table[];
}

export async function createTableAction(input: TableFormInput) {
  const validation = TableSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message };
  }

  const { table_number, qr_token, is_active } = validation.data;
  const tokenToUse =
    qr_token && qr_token.trim() !== ''
      ? qr_token.trim()
      : `qr-tbl-${table_number}-tok-${crypto.randomBytes(4).toString('hex')}`;

  const supabase = await createClient();

  // Check unique table number
  const { data: existingNum } = await supabase
    .from('tables')
    .select('id')
    .eq('table_number', table_number)
    .maybeSingle();

  if (existingNum) {
    return { success: false, error: `Table number ${table_number} already exists` };
  }

  const { data, error } = await supabase
    .from('tables')
    .insert({
      table_number,
      qr_token: tokenToUse,
      is_active,
    })
    .select('*')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/tables');
  revalidatePath('/menu');
  return { success: true, table: data as Table };
}

export async function updateTableAction(id: string, input: TableFormInput) {
  const validation = TableSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message };
  }

  const { table_number, qr_token, is_active } = validation.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from('tables')
    .update({
      table_number,
      qr_token,
      is_active,
    })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/tables');
  revalidatePath('/menu');
  return { success: true };
}

export async function toggleTableActiveAction(id: string, is_active: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('tables')
    .update({ is_active })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/tables');
  revalidatePath('/menu');
  return { success: true };
}

export async function deleteTableAction(id: string) {
  const supabase = await createClient();

  // Check if table has active orders
  const { count, error: countErr } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('table_id', id)
    .in('status', ['PENDING', 'ACCEPTED', 'PREPARING', 'READY']);

  if (countErr) {
    return { success: false, error: countErr.message };
  }

  if (count && count > 0) {
    // Soft deactivate instead of deleting to avoid breaking active kitchen orders
    await supabase.from('tables').update({ is_active: false }).eq('id', id);
    revalidatePath('/admin/tables');
    return {
      success: true,
      softDeleted: true,
      message: 'Table has active orders. Deactivated instead of deleted.',
    };
  }

  const { error } = await supabase.from('tables').delete().eq('id', id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/tables');
  return { success: true };
}
