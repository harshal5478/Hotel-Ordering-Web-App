export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'SERVED'
  | 'CANCELLED';

export type UserRole = 'admin' | 'staff' | 'kitchen';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Table {
  id: string;
  table_number: number;
  qr_token: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Alias for backward compatibility
export type RestaurantTable = Table;

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  quantity: number;
  price: number;
  item_note: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  table_id: string;
  status: OrderStatus;
  total_amount: number;
  customer_name: string | null;
  customer_phone: string | null;
  order_note: string | null;
  created_at: string;
  updated_at: string;
  tables?: Table | null;
  order_items?: OrderItem[];
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  item_note: string;
}

export interface CreateOrderInput {
  table_id: string;
  customer_name?: string;
  customer_phone?: string;
  order_note?: string;
  items: {
    menu_item_id: string;
    quantity: number;
    item_note?: string;
  }[];
}
