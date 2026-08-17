# Database & Schema Guide

## Database Schema Overview
The database uses PostgreSQL managed via Supabase. It consists of 5 core tables and 1 custom RPC stored procedure.

---

## 1. Tables

### `categories`
Stores food menu categories (e.g. Starters, Main Course, Desserts, Drinks).
- `id` (UUID, Primary Key)
- `name` (TEXT, NOT NULL)
- `description` (TEXT, Nullable)
- `sort_order` (INTEGER, Default 0)
- `is_active` (BOOLEAN, Default true)
- `created_at` / `updated_at` (TIMESTAMPTZ)

### `menu_items`
Stores individual food dishes and beverages.
- `id` (UUID, Primary Key)
- `category_id` (UUID, Foreign Key → `categories.id`)
- `name` (TEXT, NOT NULL)
- `description` (TEXT, Nullable)
- `price` (NUMERIC(10,2), NOT NULL, Check `price >= 0`)
- `image_url` (TEXT, Nullable — Supabase Storage URL)
- `is_available` (BOOLEAN, Default true)
- `sort_order` (INTEGER, Default 0)

### `tables`
Stores dining tables and room locations.
- `id` (UUID, Primary Key)
- `table_number` (INTEGER, NOT NULL, UNIQUE)
- `qr_token` (TEXT, NOT NULL, UNIQUE — Secure stable QR token)
- `is_active` (BOOLEAN, Default true)

### `orders`
Stores customer orders placed at tables.
- `id` (UUID, Primary Key)
- `table_id` (UUID, Foreign Key → `tables.id`)
- `status` (TEXT, Enum: `PENDING`, `ACCEPTED`, `PREPARING`, `READY`, `SERVED`, `CANCELLED`)
- `total_amount` (NUMERIC(10,2), Calculated on server)
- `customer_name` (TEXT, Nullable)
- `customer_phone` (TEXT, Nullable)
- `order_note` (TEXT, Nullable)

### `order_items`
Historical item snapshot table for created orders.
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key → `orders.id` ON DELETE CASCADE)
- `menu_item_id` (UUID, Foreign Key → `menu_items.id` ON DELETE SET NULL)
- `item_name` (TEXT, NOT NULL — Snapshot of dish name at order time)
- `price` (NUMERIC(10,2), NOT NULL — Snapshot of dish price at order time)
- `quantity` (INTEGER, NOT NULL, Check `quantity > 0`)
- `item_note` (TEXT, Nullable)

---

## 2. Stored Procedure (RPC)
`public.create_customer_order` accepts order parameters, validates table status and item availability, queries authoritative prices from `menu_items`, inserts `orders` and `order_items`, and commits as a single atomic transaction.
