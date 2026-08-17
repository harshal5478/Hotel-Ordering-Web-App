-- Phase 2 Complete Database Migration for Single-Hotel QR Food Ordering System

-- Drop existing tables cleanly if upgrading from preliminary draft
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.menu_items CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.tables CASCADE;
DROP TABLE IF EXISTS public.restaurant_tables CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Create Tables

-- Categories Table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Menu Items Table
CREATE TABLE public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tables Table (Dining & Room QR Locations)
CREATE TABLE public.tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_number INT NOT NULL UNIQUE,
    qr_token TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders Table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'SERVED', 'CANCELLED')),
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    customer_name TEXT,
    customer_phone TEXT,
    order_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Items Table (Historical Snapshot)
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
    item_name TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    item_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Staff Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'kitchen')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes for Optimized Query Performance
CREATE INDEX idx_categories_active_order ON public.categories(is_active, sort_order);
CREATE INDEX idx_menu_items_category ON public.menu_items(category_id, is_available, sort_order);
CREATE INDEX idx_tables_number ON public.tables(table_number);
CREATE INDEX idx_tables_qr_token ON public.tables(qr_token);
CREATE INDEX idx_orders_table_id ON public.orders(table_id);
CREATE INDEX idx_orders_status_created ON public.orders(status, created_at DESC);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON public.order_items(menu_item_id);

-- 3. Automatic updated_at Trigger Setup
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_tables_updated_at
    BEFORE UPDATE ON public.tables
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatic Profile Creation on Supabase Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Hotel Staff'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Row Level Security (RLS) Policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public (Customer) RLS Policies
CREATE POLICY "Public read active categories"
    ON public.categories FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Public read available menu items"
    ON public.menu_items FOR SELECT
    USING (is_available = TRUE);

CREATE POLICY "Public read active tables"
    ON public.tables FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Public create orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public read orders"
    ON public.orders FOR SELECT
    USING (true);

CREATE POLICY "Public create order items"
    ON public.order_items FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public read order items"
    ON public.order_items FOR SELECT
    USING (true);

-- Authenticated Staff RLS Policies (Full Control)
CREATE POLICY "Staff full access categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Staff full access menu items"
    ON public.menu_items FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Staff full access tables"
    ON public.tables FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Staff full access orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Staff full access order items"
    ON public.order_items FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Staff read profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Staff update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- 5. Supabase Realtime Setup
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.orders, public.order_items, public.tables, public.menu_items;
COMMIT;

-- 6. Initial Development Seed Data
INSERT INTO public.tables (table_number, qr_token, is_active) VALUES
(1, 'qr-table-1-tok-84920', true),
(2, 'qr-table-2-tok-59281', true),
(3, 'qr-table-3-tok-10482', true),
(4, 'qr-table-4-tok-73910', true),
(5, 'qr-table-5-tok-48201', true),
(6, 'qr-table-6-tok-91823', true)
ON CONFLICT (table_number) DO NOTHING;

-- Seed Categories
INSERT INTO public.categories (id, name, description, sort_order, is_active) VALUES
('c0000000-0000-0000-0000-000000000001', 'Starters & Appetizers', 'Delicious small bites and hot starters to begin your dining experience.', 1, true),
('c0000000-0000-0000-0000-000000000002', 'Main Course', 'Chef recommended curries, risottos, thalis, and grilled specialties.', 2, true),
('c0000000-0000-0000-0000-000000000003', 'Desserts', 'Decadent cakes, traditional sweets, and artisanal sorbets.', 3, true),
('c0000000-0000-0000-0000-000000000004', 'Beverages & Mocktails', 'Fresh juices, iced infusions, coffees, and signature mocktails.', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Menu Items
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_available, sort_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'Paneer Tikka Angara', 'Cottage cheese marinated in spicy smoked yogurt & roasted in traditional charcoal tandoor.', 420.00, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80', true, 1),
('c0000000-0000-0000-0000-000000000001', 'Crispy Truffle Fries', 'Hand-cut golden potato fries tossed in aromatic white truffle oil & aged parmesan.', 320.00, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80', true, 2),
('c0000000-0000-0000-0000-000000000002', 'Wild Truffle Mushroom Risotto', 'Creamy Italian arborio rice infused with wild forest mushrooms & truffle glaze.', 580.00, 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600&auto=format&fit=crop&q=80', true, 1),
('c0000000-0000-0000-0000-000000000002', 'Grand Royal Dal Makhani', 'Overnight slow-cooked black lentils simmered with white butter & fresh cream.', 490.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80', true, 2),
('c0000000-0000-0000-0000-000000000003', 'Classic Molten Chocolate Lava Cake', 'Warm dark chocolate cake with a molten chocolate center served with vanilla bean ice cream.', 340.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80', true, 1),
('c0000000-0000-0000-0000-000000000004', 'Passion Fruit & Mint Cooler', 'Refreshing crushed passion fruit nectar with fresh mint leaves and soda.', 240.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80', true, 1);
