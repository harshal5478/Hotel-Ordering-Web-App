import { z } from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  description: z.string().max(500).optional().nullable(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type CategoryFormInput = z.infer<typeof CategorySchema>;

export const MenuItemSchema = z.object({
  category_id: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, 'Please select a valid category'),
  name: z.string().min(1, 'Item name is required').max(150),
  description: z.string().max(500).optional().nullable(),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  image_url: z.string().optional().nullable(),
  is_available: z.boolean().default(true),
  sort_order: z.number().int().min(0).default(0),
});

export type MenuItemFormInput = z.infer<typeof MenuItemSchema>;

export const TableSchema = z.object({
  table_number: z.number().int().min(1, 'Table number must be positive'),
  qr_token: z.string().min(3, 'QR Token is required'),
  is_active: z.boolean().default(true),
});

export type TableFormInput = z.infer<typeof TableSchema>;

export const OrderItemInputSchema = z.object({
  menu_item_id: z.string().uuid(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  item_note: z.string().max(200).optional().nullable(),
});

export const CreateOrderSchema = z.object({
  table_id: z.string().uuid('Invalid table configuration'),
  customer_name: z.string().max(100).optional().nullable(),
  customer_phone: z.string().max(20).optional().nullable(),
  order_note: z.string().max(500).optional().nullable(),
  items: z.array(OrderItemInputSchema).min(1, 'Order must contain at least one item'),
});

export type CreateOrderInputSchemaType = z.infer<typeof CreateOrderSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormInput = z.infer<typeof LoginSchema>;
