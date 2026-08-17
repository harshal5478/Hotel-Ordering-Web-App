'use server';

import { createClient } from '@/lib/supabase/server';
import { CategorySchema, MenuItemSchema, CategoryFormInput, MenuItemFormInput } from '@/lib/validations';
import { Category, MenuItem } from '@/types';
import { revalidatePath } from 'next/cache';

// ==========================================
// CATEGORY SERVER ACTIONS
// ==========================================

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error || !data) {
    console.error('Error fetching admin categories:', error);
    return [];
  }

  return data as Category[];
}

export async function createCategoryAction(input: CategoryFormInput) {
  const validation = CategorySchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .insert(validation.data)
    .select('*')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/menu');
  return { success: true, category: data };
}

export async function updateCategoryAction(id: string, input: CategoryFormInput) {
  const validation = CategorySchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('categories')
    .update(validation.data)
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/menu');
  return { success: true };
}

export async function toggleCategoryActiveAction(id: string, is_active: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('categories')
    .update({ is_active })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/menu');
  return { success: true };
}

export async function deleteCategoryAction(id: string) {
  const supabase = await createClient();

  // Check if category has menu items
  const { count, error: countErr } = await supabase
    .from('menu_items')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);

  if (countErr) {
    return { success: false, error: countErr.message };
  }

  if (count && count > 0) {
    // Soft deactivate instead of deleting to prevent orphan menu items
    await supabase.from('categories').update({ is_active: false }).eq('id', id);
    revalidatePath('/admin/categories');
    revalidatePath('/menu');
    return {
      success: true,
      softDeleted: true,
      message: 'Category has active dishes linked. Deactivated instead of deleted.',
    };
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/menu');
  return { success: true };
}

// ==========================================
// MENU ITEM SERVER ACTIONS
// ==========================================

export async function getAllMenuItems(): Promise<(MenuItem & { category_name?: string })[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      categories (name)
    `)
    .order('sort_order', { ascending: true });

  if (error || !data) {
    console.error('Error fetching admin menu items:', error);
    return [];
  }

  return data.map((item) => ({
    ...item,
    category_name: (item.categories as unknown as { name: string })?.name || 'Uncategorized',
  })) as (MenuItem & { category_name?: string })[];
}

export async function createMenuItemAction(input: MenuItemFormInput) {
  const validation = MenuItemSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('menu_items')
    .insert(validation.data)
    .select('*')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/menu');
  revalidatePath('/menu');
  return { success: true, menuItem: data };
}

export async function updateMenuItemAction(id: string, input: MenuItemFormInput) {
  const validation = MenuItemSchema.safeParse(input);
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0]?.message };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('menu_items')
    .update(validation.data)
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/menu');
  revalidatePath('/menu');
  return { success: true };
}

export async function toggleMenuItemAvailabilityAction(id: string, is_available: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('menu_items')
    .update({ is_available })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/menu');
  revalidatePath('/menu');
  return { success: true };
}

export async function deleteMenuItemAction(id: string) {
  const supabase = await createClient();

  // Check if item has historical orders in order_items
  const { count, error: countErr } = await supabase
    .from('order_items')
    .select('id', { count: 'exact', head: true })
    .eq('menu_item_id', id);

  if (countErr) {
    return { success: false, error: countErr.message };
  }

  // If item has historical orders, soft deactivate to preserve order history!
  if (count && count > 0) {
    await supabase.from('menu_items').update({ is_available: false }).eq('id', id);
    revalidatePath('/admin/menu');
    revalidatePath('/menu');
    return {
      success: true,
      softDeleted: true,
      message: 'Item has historical order records. Marked as Unavailable to protect historical data integrity.',
    };
  }

  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/menu');
  revalidatePath('/menu');
  return { success: true };
}

// ==========================================
// SUPABASE STORAGE IMAGE UPLOAD ACTION
// ==========================================

export async function uploadMenuImageAction(formData: FormData) {
  const file = formData.get('file') as File | null;

  if (!file || file.size === 0) {
    return { success: false, error: 'No image file provided' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { success: false, error: 'Image size exceeds maximum limit of 5MB' };
  }

  const supabase = await createClient();
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `menu_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadErr } = await supabase.storage
    .from('menu-images')
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadErr) {
    console.error('Storage Upload Error:', uploadErr);
    return { success: false, error: uploadErr.message };
  }

  const { data: publicUrlData } = supabase.storage
    .from('menu-images')
    .getPublicUrl(fileName);

  return {
    success: true,
    imageUrl: publicUrlData.publicUrl,
  };
}
