-- Single-Hotel QR Food Ordering System Database Schema

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

-- Seed Official Shree Kulswamini Hotel Categories
INSERT INTO public.categories (id, name, description, sort_order, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Thali Specials (थाळी)', 'Authentic Maharashtrian Non-Veg & Veg Thalis with Rassa, Bhakri, Indrayani Rice & Solkadhi', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Fish Specials (मच्छी)', 'Fresh Malvani style Fish Fry, Rava Fry, Masala Curry & Bombil Fry', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Biryani Specials (बिर्याणी)', 'Aromatic Dum Biryani served with spicy gravy & Raita', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Main Course (चिकन)', 'Spicy Chicken Fry, Handi, Sukka, Curry & Lollipop Specials', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Main Course (मटन)', 'Malvani Mutton Handi, Mutton Fry, Mutton Sukka & Mutton Masala', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Specials (अंडा)', 'Egg Bhurji, Egg Curry, Egg Masala & Omelette', 6, true),
  ('c1000000-0000-0000-0000-000000000007', 'Veg Dishes (व्हेज)', 'Paneer Masala, Kaju Curry, Shev Bhaji, Dal Tadka & Baingan Masala', 7, true),
  ('c1000000-0000-0000-0000-000000000008', 'Starters (स्टार्टर)', 'Finger Chips, Gobi 65, Gobi Manchurian, Kanda Pakoda & Papad', 8, true),
  ('c1000000-0000-0000-0000-000000000009', 'Roti, Bhakri & Rice (रोटी / भात)', 'Hot Jowar/Bajra Bhakri, Chapati, Indrayani Rice & Jeera Rice', 9, true),
  ('c1000000-0000-0000-0000-000000000010', 'Bulk Kg Orders (किलोने विक्री)', 'Special Bulk Orders by Weight (Per Half Kg / Full Kg)', 10, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Official Shree Kulswamini Hotel Menu Items
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_available, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Kulswamini Special Fish Thali (Chilapi)', 'Includes: 2 Pcs Fish Masala, 2 Pcs Kadak Fry, Curry/Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati, Indrayani Rice, Solkadhi & Sukat', 300.00, '/images/dishes/fish_thali.jpg', true, 1),
  ('c1000000-0000-0000-0000-000000000001', 'Special Chicken Thali', 'Includes: Chicken Fry, Chicken Rassa, Soup, Indrayani Rice, 2 Bhakri / 2 Chapati, 1 Boiled Egg & Solkadhi', 230.00, '/images/dishes/chicken_thali.jpg', true, 2),
  ('c1000000-0000-0000-0000-000000000001', 'Special Mutton Thali', 'Includes: Mutton Fry, Spicy Mutton Rassa, Aalandi Soup, Indrayani Rice, 1 Boiled Egg, 2 Bhakri / 3 Chapati & Solkadhi', 300.00, '/images/dishes/mutton_thali.jpg', true, 3),
  ('c1000000-0000-0000-0000-000000000001', 'Masala Fish Thali (Chilapi)', 'Includes: 4 Pcs Fish Masala Curry, Spicy Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', 220.00, '/images/dishes/fish_thali.jpg', true, 4),
  ('c1000000-0000-0000-0000-000000000001', 'Kadak Fish Fry Thali (Chilapi)', 'Includes: 4 Pcs Crispy Kadak Fry, Spicy Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', 220.00, '/images/dishes/fish_thali.jpg', true, 5),
  ('c1000000-0000-0000-0000-000000000001', 'Aalandi Fish Thali (Chilapi)', 'Includes: 4 Pcs Mild Aalandi Fish, Rassa, Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', 220.00, '/images/dishes/fish_thali.jpg', true, 6),
  ('c1000000-0000-0000-0000-000000000001', 'Special Egg Thali', 'Includes: 2 Boiled Eggs, Egg Curry/Rassa, 3 Chapati, Jeera Rice & 2 Bhakri', 150.00, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop', true, 7),
  ('c1000000-0000-0000-0000-000000000001', 'Pure Veg Thali', 'Includes: 2 Veg Sabzi, 3 Chapati, Jeera Rice, Roasted Papad & 1 Sweet', 150.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 8),
  ('c1000000-0000-0000-0000-000000000002', 'Dum Fish Fry (दम मच्छी)', 'Steamed & shallow fried spiced whole fish in special masala', 150.00, '/images/dishes/fish_thali.jpg', true, 1),
  ('c1000000-0000-0000-0000-000000000002', 'Crispy Fish Fry (फ्राय मच्छी)', 'Traditional Tawa fried crispy fish with red chili masala marinade', 150.00, '/images/dishes/fish_thali.jpg', true, 2),
  ('c1000000-0000-0000-0000-000000000002', 'Bangda Tava Fish (बांगडा तवा)', 'Fresh Mackerel marinated in Kokum & Konkani spices, tava fried', 160.00, '/images/dishes/fish_thali.jpg', true, 3),
  ('c1000000-0000-0000-0000-000000000002', 'Bangda Rava Fish (बांगडा रवा)', 'Mackerel coated in semolina (Rava) for an extra crunchy texture', 160.00, '/images/dishes/bombil_fry.jpg', true, 4),
  ('c1000000-0000-0000-0000-000000000002', 'Tomato Fish Curry (टमाटा मच्छी)', 'Tangy fresh fish curry cooked in rich tomato and garlic gravy', 200.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000002', 'Fish Masala Gravy (मच्छी मसाला)', 'Classic spicy Malvani fish curry cooked with freshly ground spices', 120.00, '/images/dishes/fish_thali.jpg', true, 6),
  ('c1000000-0000-0000-0000-000000000002', 'Bombil Fry (बॉबील फ्राय)', 'Golden crispy rava fried Bombay Duck fish - crisp outside, tender inside', 180.00, '/images/dishes/bombil_fry.jpg', true, 7),
  ('c1000000-0000-0000-0000-000000000003', 'Chicken Dum Biryani - Full', 'Aromatic basmati rice cooked on dum with marinated tender chicken pieces & spices', 210.00, '/images/dishes/dum_biryani.jpg', true, 1),
  ('c1000000-0000-0000-0000-000000000003', 'Chicken Dum Biryani - Half', 'Half portion aromatic chicken dum biryani', 140.00, '/images/dishes/dum_biryani.jpg', true, 2),
  ('c1000000-0000-0000-0000-000000000003', 'Mutton Dum Biryani - Full', 'Rich & flavorful dum biryani cooked with succulent goat meat mutton pieces', 300.00, '/images/dishes/dum_biryani.jpg', true, 3),
  ('c1000000-0000-0000-0000-000000000003', 'Mutton Dum Biryani - Half', 'Half portion rich mutton dum biryani', 180.00, '/images/dishes/dum_biryani.jpg', true, 4),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Fry (चिकन फ्राय)', 'Spicy dry fried chicken tossed with caramelized onions and Maharashtrian spices', 150.00, '/images/dishes/chicken_thali.jpg', true, 1),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken 65 (5 Pcs)', 'Deep fried crispy chicken bites tossed in spicy yogurt & curry leaf tempered gravy', 180.00, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Sukka (चिकन सुकी)', 'Semi-dry roasted chicken dish with toasted coconut & Malvani spices', 120.00, '/images/dishes/chicken_thali.jpg', true, 3),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Handi - Full', 'Rich Handi chicken gravy cooked in earthen pot with roasted spices (Serves 3-4)', 700.00, '/images/dishes/chicken_thali.jpg', true, 4),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Handi - Half', 'Half portion rich Handi chicken gravy (Serves 2)', 400.00, '/images/dishes/chicken_thali.jpg', true, 5),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Fry (मटन फ्राय)', 'Tender goat meat dry fried in spicy Konkani black masala', 270.00, '/images/dishes/mutton_thali.jpg', true, 1),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Masala Gravy', 'Mutton pieces simmered in spicy onion, ginger, garlic & coconut gravy', 270.00, '/images/dishes/mutton_thali.jpg', true, 2),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Handi Malvani - Full', 'Traditional Malvani style earthen pot mutton curry (Serves 3-4)', 900.00, '/images/dishes/mutton_thali.jpg', true, 3),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Handi Malvani - Half', 'Half portion Malvani style mutton handi (Serves 2)', 500.00, '/images/dishes/mutton_thali.jpg', true, 4),
  ('c1000000-0000-0000-0000-000000000007', 'Paneer Masala (पनीर मसाला)', 'Cottage cheese cubes cooked in rich onion tomato gravy', 200.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000007', 'Kaju Curry (काजू करी)', 'Whole cashews simmered in rich creamy butter masala gravy', 200.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000007', 'Dal Tadka (डाळ तडका)', 'Yellow lentils tempered with ghee, cumin seeds, garlic & red chilis', 150.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000009', 'Jowar / Bajra Bhakri (भाकरी)', 'Freshly hand-pattered hot flatbread made from Jowar or Bajra millet', 25.00, '/images/dishes/fish_thali.jpg', true, 1),
  ('c1000000-0000-0000-0000-000000000009', 'Wheat Chapati (चपाती)', 'Soft whole wheat thin chapati roti', 20.00, '/images/dishes/chicken_thali.jpg', true, 2),
  ('c1000000-0000-0000-0000-000000000009', 'Indrayani Rice - Full (इंद्रायणी राईस)', 'Fragrant sticky aromatic Indrayani rice, perfect with rassa', 120.00, 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000009', 'Jeera Rice - Full (जिरा राईस)', 'Steamed basmati rice tempered with ghee & cumin seeds', 140.00, 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop', true, 4);

-- 7. Atomic Order Creation RPC Function
CREATE OR REPLACE FUNCTION public.create_customer_order(
  p_table_id UUID,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_order_note TEXT,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item JSONB;
  v_menu_item RECORD;
  v_total_amount NUMERIC(10,2) := 0;
  v_order_id UUID;
BEGIN
  -- 1. Validate Table existence & active status
  IF NOT EXISTS (SELECT 1 FROM public.tables WHERE id = p_table_id AND is_active = true) THEN
    RAISE EXCEPTION 'Invalid or inactive table configuration';
  END IF;

  -- 2. Validate items array
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Order must contain at least one item';
  END IF;

  -- 3. Calculate subtotal & verify availability on the server
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT * INTO v_menu_item 
    FROM public.menu_items 
    WHERE id = (v_item->>'menu_item_id')::UUID;

    IF v_menu_item IS NULL THEN
      RAISE EXCEPTION 'One or more items in your cart no longer exist';
    END IF;

    IF NOT v_menu_item.is_available THEN
      RAISE EXCEPTION 'Item "%" is currently sold out or unavailable', v_menu_item.name;
    END IF;

    IF (v_item->>'quantity')::INT <= 0 THEN
      RAISE EXCEPTION 'Item quantity must be greater than zero';
    END IF;

    v_total_amount := v_total_amount + (v_menu_item.price * (v_item->>'quantity')::INT);
  END LOOP;

  -- 4. Create Order record
  INSERT INTO public.orders (
    table_id,
    status,
    total_amount,
    customer_name,
    customer_phone,
    order_note
  )
  VALUES (
    p_table_id,
    'PENDING',
    v_total_amount,
    NULLIF(TRIM(p_customer_name), ''),
    NULLIF(TRIM(p_customer_phone), ''),
    NULLIF(TRIM(p_order_note), '')
  )
  RETURNING id INTO v_order_id;

  -- 5. Create Order Items (snapshotting current item_name and price)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT * INTO v_menu_item 
    FROM public.menu_items 
    WHERE id = (v_item->>'menu_item_id')::UUID;

    INSERT INTO public.order_items (
      order_id,
      menu_item_id,
      item_name,
      quantity,
      price,
      item_note
    )
    VALUES (
      v_order_id,
      v_menu_item.id,
      v_menu_item.name,
      (v_item->>'quantity')::INT,
      v_menu_item.price,
      NULLIF(TRIM(v_item->>'item_note'), '')
    );
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'total_amount', v_total_amount
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_customer_order(UUID, TEXT, TEXT, TEXT, JSONB) TO anon, authenticated;

-- 8. Storage Setup for Menu Images Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menu-images',
  'menu-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/avif'];

CREATE POLICY "Public read access for menu images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

CREATE POLICY "Staff upload access for menu images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Staff update access for menu images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'menu-images')
  WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Staff delete access for menu images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'menu-images');


