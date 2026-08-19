-- ====================================================================
-- SHREE KULSWAMINI HOTEL - MASTER DATABASE RE-INITIALIZATION SCRIPT
-- RUN THIS SINGLE QUERY IN SUPABASE SQL EDITOR TO DEPLOY ALL TABLES & MENU
-- ====================================================================

-- 0. Clean Up Existing Schema Data
TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.orders CASCADE;
TRUNCATE TABLE public.menu_items CASCADE;
TRUNCATE TABLE public.categories CASCADE;
TRUNCATE TABLE public.tables CASCADE;

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Core Tables Definition

-- A. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- B. Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- C. Dining Tables Management
CREATE TABLE IF NOT EXISTS public.tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_number INT UNIQUE NOT NULL CHECK (table_number > 0),
  qr_token TEXT UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- D. Customer Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE RESTRICT,
  order_number INT GENERATED ALWAYS AS IDENTITY,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED')) DEFAULT 'PENDING',
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  customer_name TEXT,
  customer_phone TEXT,
  order_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- E. Order Line Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE RESTRICT,
  item_name TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Automatic updated_at Trigger Setup
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_tables_updated_at ON public.tables;
CREATE TRIGGER update_tables_updated_at
  BEFORE UPDATE ON public.tables
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. High-Performance Indexing
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON public.menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_tables_table_number ON public.tables(table_number);
CREATE INDEX IF NOT EXISTS idx_tables_qr_token ON public.tables(qr_token);
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON public.orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 5. Security & Row Level Security (RLS) Policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public can view available menu items" ON public.menu_items;
CREATE POLICY "Public can view available menu items" ON public.menu_items FOR SELECT USING (is_available = true);

DROP POLICY IF EXISTS "Public can view active tables" ON public.tables;
CREATE POLICY "Public can view active tables" ON public.tables FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Customers can create orders" ON public.orders;
CREATE POLICY "Customers can create orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Customers can view their created order" ON public.orders;
CREATE POLICY "Customers can view their created order" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Customers can insert order items" ON public.order_items;
CREATE POLICY "Customers can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Customers can view order items" ON public.order_items;
CREATE POLICY "Customers can view order items" ON public.order_items FOR SELECT USING (true);

-- Authenticated Staff Full Access Policies
DROP POLICY IF EXISTS "Staff full access to categories" ON public.categories;
CREATE POLICY "Staff full access to categories" ON public.categories FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Staff full access to menu_items" ON public.menu_items;
CREATE POLICY "Staff full access to menu_items" ON public.menu_items FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Staff full access to tables" ON public.tables;
CREATE POLICY "Staff full access to tables" ON public.tables FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Staff full access to orders" ON public.orders;
CREATE POLICY "Staff full access to orders" ON public.orders FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Staff full access to order_items" ON public.order_items;
CREATE POLICY "Staff full access to order_items" ON public.order_items FOR ALL TO authenticated USING (true);

-- 6. Initial Dining Tables Setup
INSERT INTO public.tables (table_number, qr_token, is_active) VALUES
(1, '1', true),
(2, '2', true),
(3, '3', true),
(4, '4', true),
(5, '5', true),
(6, '6', true),
(7, '7', true),
(8, '8', true),
(9, '9', true),
(10, '10', true),
(11, '11', true),
(12, '12', true)
ON CONFLICT (table_number) DO NOTHING;

-- 7. Seed Official Shree Kulswamini Hotel Categories
INSERT INTO public.categories (id, name, description, sort_order, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Thali Specials (थाळी)', 'Authentic Maharashtrian Fish, Chicken, Mutton, Veg & Egg Thalis with Rassa, Bhakri/Chapati & Rice', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Fish Fry & Curry (मच्छी)', 'Fresh Malvani style Fish Fry, Rava Fry, Bangda, Tomato Fish & Bombil Fry', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Biryani Specials (बिर्याणी)', 'Aromatic Dum Biryani served with spicy gravy & Raita', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Main Course (चिकन)', 'Spicy Chicken Fry, Handi, Sukka, Curry, Lollipop & Soup Specials', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Main Course (मटन)', 'Malvani Mutton Handi, Mutton Fry, Mutton Sukka, Masala & Soup', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Specials (अंडा)', 'Boiled Plate, Egg Bhurji, Boiled Bhurji, Omelette, Masala & Curry', 6, true),
  ('c1000000-0000-0000-0000-000000000007', 'Veg Dishes (व्हेज)', 'Paneer Masala, Kaju Curry, Shev Bhaji, Sheng Bhaji, Dal Tadka, Dal Fry & Baingan Masala', 7, true),
  ('c1000000-0000-0000-0000-000000000008', 'Starters (स्टार्टर)', 'Finger Chips, Gobi 65, Gobi Manchurian, Kanda Pakoda, Masala Papad & Roasted Papad', 8, true),
  ('c1000000-0000-0000-0000-000000000009', 'Roti, Bhakri & Rice (रोटी / भात)', 'Hot Jowar/Bajra Bhakri, Chapati, Indrayani Rice & Jeera Rice', 9, true),
  ('c1000000-0000-0000-0000-000000000010', 'Bulk Kg Orders (किलोने विक्री)', 'Special Bulk Orders by Weight (Half Kg / Full Kg)', 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

-- 8. Seed Official Shree Kulswamini Hotel Menu Items (53 Items mapped to /images/dishes/dish_X.jpeg)
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_available, sort_order) VALUES
  -- 1. THALI SPECIALS
  ('c1000000-0000-0000-0000-000000000001', 'Kulswamini Special Fish Thali (Chilapi)', 'Includes: 2 Pcs Fish Masala, 2 Pcs Kadak Fry, Curry/Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati, Indrayani Rice, Solkadhi & Sukat', 300.00, '/images/dishes/dish_1.jpeg', true, 1),
  ('c1000000-0000-0000-0000-000000000001', 'Masala Fish Thali (Chilapi)', 'Includes: 4 Pcs Fish Masala Curry, Spicy Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', 220.00, '/images/dishes/dish_2.jpeg', true, 2),
  ('c1000000-0000-0000-0000-000000000001', 'Kadak Fish Fry Thali (Chilapi)', 'Includes: 4 Pcs Crispy Kadak Fry, Spicy Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', 220.00, '/images/dishes/dish_3.jpeg', true, 3),
  ('c1000000-0000-0000-0000-000000000001', 'Aalandi Fish Thali (Chilapi)', 'Includes: 4 Pcs Mild Aalandi Fish, Rassa, Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', 220.00, '/images/dishes/dish_4.jpeg', true, 4),
  ('c1000000-0000-0000-0000-000000000001', 'Special Chicken Thali', 'Includes: Chicken Fry, Chicken Rassa, Soup, Indrayani Rice, 2 Bhakri / 2 Chapati, 1 Boiled Egg & Solkadhi', 230.00, '/images/dishes/dish_5.jpeg', true, 5),
  ('c1000000-0000-0000-0000-000000000001', 'Special Mutton Thali', 'Includes: Mutton Fry, Spicy Mutton Rassa, Aalandi Soup, Indrayani Rice, 1 Boiled Egg, 2 Bhakri / 3 Chapati & Solkadhi', 300.00, '/images/dishes/dish_6.jpeg', true, 6),
  ('c1000000-0000-0000-0000-000000000001', 'Pure Veg Thali', 'Includes: 2 Veg Sabzi, 3 Chapati, Jeera Rice, Roasted Papad & 1 Sweet', 150.00, '/images/dishes/dish_7.jpeg', true, 7),
  ('c1000000-0000-0000-0000-000000000001', 'Special Egg Thali', 'Includes: 2 Boiled Eggs, Egg Curry/Rassa, 3 Chapati, Jeera Rice & 2 Bhakri', 150.00, '/images/dishes/dish_8.jpeg', true, 8),
  ('c1000000-0000-0000-0000-000000000001', 'Chicken Rassa Thali', 'Includes: Chicken Rassa Gravy, Soup, Indrayani Rice, 2 Bhakri / 3 Chapati', 170.00, '/images/dishes/dish_22.jpeg', true, 9),

  -- 2. FISH FRY & CURRY
  ('c1000000-0000-0000-0000-000000000002', 'Dum Fish Fry (दम मच्छी)', 'Steamed & shallow fried spiced whole fish in special masala', 150.00, '/images/dishes/dish_9.jpeg', true, 1),
  ('c1000000-0000-0000-0000-000000000002', 'Crispy Fish Fry (फ्राय मच्छी)', 'Traditional Tawa fried crispy fish with red chili masala marinade', 150.00, '/images/dishes/dish_10.jpeg', true, 2),
  ('c1000000-0000-0000-0000-000000000002', 'Bangda Tava Fish (बांगडा तवा)', 'Fresh Mackerel marinated in Kokum & Konkani spices, tava fried', 160.00, '/images/dishes/dish_11.jpeg', true, 3),
  ('c1000000-0000-0000-0000-000000000002', 'Bangda Rava Fish (बांगडा रवा)', 'Mackerel coated in semolina (Rava) for an extra crunchy texture', 160.00, '/images/dishes/dish_12.jpeg', true, 4),
  ('c1000000-0000-0000-0000-000000000002', 'Tomato Fish Curry (टमाटा मच्छी)', 'Tangy fresh fish curry cooked in rich tomato and garlic gravy', 200.00, '/images/dishes/dish_13.jpeg', true, 5),
  ('c1000000-0000-0000-0000-000000000002', 'Fish Masala Gravy (मच्छी मसाला)', 'Classic spicy Malvani fish curry cooked with freshly ground spices', 120.00, '/images/dishes/dish_14.jpeg', true, 6),
  ('c1000000-0000-0000-0000-000000000002', 'Bombil Fry (बॉबील फ्राय)', 'Golden crispy rava fried Bombay Duck fish - crisp outside, tender inside', 180.00, '/images/dishes/dish_15.jpeg', true, 7),

  -- 3. BIRYANI SPECIALS
  ('c1000000-0000-0000-0000-000000000003', 'Chicken Dum Biryani - Full', 'Aromatic basmati rice cooked on dum with marinated tender chicken pieces', 210.00, '/images/dishes/dish_16.jpeg', true, 1),
  ('c1000000-0000-0000-0000-000000000003', 'Chicken Dum Biryani - Half', 'Half portion aromatic chicken dum biryani', 140.00, '/images/dishes/dish_17.jpeg', true, 2),
  ('c1000000-0000-0000-0000-000000000003', 'Mutton Dum Biryani - Full', 'Rich & flavorful dum biryani cooked with succulent mutton pieces', 300.00, '/images/dishes/dish_18.jpeg', true, 3),
  ('c1000000-0000-0000-0000-000000000003', 'Mutton Dum Biryani - Half', 'Half portion rich mutton dum biryani', 180.00, '/images/dishes/dish_19.jpeg', true, 4),
  ('c1000000-0000-0000-0000-000000000003', 'Egg Biryani - Full', 'Delicious dum biryani cooked with spicy boiled eggs', 210.00, '/images/dishes/dish_20.jpeg', true, 5),
  ('c1000000-0000-0000-0000-000000000003', 'Egg Biryani - Half', 'Half portion spicy egg dum biryani', 140.00, '/images/dishes/dish_21.jpeg', true, 6),

  -- 4. CHICKEN MAIN COURSE
  ('c1000000-0000-0000-0000-000000000004', 'Chicken 65 (5 Pcs)', 'Deep fried crispy chicken bites tossed in spicy curry leaf tempered gravy', 180.00, '/images/dishes/dish_23.jpeg', true, 1),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Fry (चिकन फ्राय)', 'Spicy dry fried chicken tossed with caramelized onions and Maharashtrian spices', 150.00, '/images/dishes/dish_24.jpeg', true, 2),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Chilli (6 Pcs)', 'Indo-Chinese style crispy fried chicken tossed in chili garlic sauce', 180.00, '/images/dishes/dish_25.jpeg', true, 3),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Chilli (10 Pcs)', 'Large portion Indo-Chinese style chicken chili', 240.00, '/images/dishes/dish_26.jpeg', true, 4),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Sukka (चिकन सुकी)', 'Semi-dry roasted chicken dish with toasted coconut & Malvani spices', 120.00, '/images/dishes/dish_27.jpeg', true, 5),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Lollipop (4 Pcs)', 'Crispy fried chicken winglets served with spicy Schezwan dip', 120.00, '/images/dishes/dish_28.jpeg', true, 6),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Lollipop (8 Pcs)', 'Large portion crispy chicken lollipops (8 Pcs)', 210.00, '/images/dishes/dish_29.jpeg', true, 7),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Dum Murga', 'Whole slow cooked chicken simmered on dum in rich royal spices', 600.00, '/images/dishes/dish_30.jpeg', true, 8),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Masala', 'Tender chicken pieces simmered in spicy onion-tomato gravy', 130.00, '/images/dishes/dish_31.jpeg', true, 9),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Handi - Full', 'Rich Handi chicken gravy cooked in earthen pot with roasted spices (Serves 3-4)', 700.00, '/images/dishes/dish_32.jpeg', true, 10),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Handi - Half', 'Half portion rich Handi chicken gravy (Serves 2)', 400.00, '/images/dishes/dish_33.jpeg', true, 11),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Lollipop Masala (4 Pcs)', 'Chicken lollipops tossed in rich spicy masala gravy (4 Pcs)', 130.00, '/images/dishes/dish_34.jpeg', true, 12),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Lollipop Masala (8 Pcs)', 'Chicken lollipops tossed in rich spicy masala gravy (8 Pcs)', 240.00, '/images/dishes/dish_35.jpeg', true, 13),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Soup', 'Hot & healthy chicken clear soup infused with ginger & pepper', 50.00, '/images/dishes/dish_36.jpeg', true, 14),

  -- 5. MUTTON MAIN COURSE
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Fry (मटन फ्राय)', 'Tender goat meat dry fried in spicy Konkani black masala', 270.00, '/images/dishes/dish_37.jpeg', true, 1),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Masala Gravy', 'Mutton pieces simmered in spicy onion, ginger, garlic & coconut gravy', 270.00, '/images/dishes/dish_38.jpeg', true, 2),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Sukki (मटन सुकी)', 'Roasted mutton dish cooked with dried coconut and aromatic spices', 280.00, '/images/dishes/dish_39.jpeg', true, 3),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Handi Malvani - Full', 'Traditional Malvani style earthen pot mutton curry (Serves 3-4)', 900.00, '/images/dishes/dish_40.jpeg', true, 4),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Handi Malvani - Half', 'Half portion Malvani style mutton handi (Serves 2)', 500.00, '/images/dishes/dish_41.jpeg', true, 5),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Soup', 'Nourishing spicy mutton bone broth soup', 90.00, '/images/dishes/dish_42.jpeg', true, 6),

  -- 6. EGG SPECIALS
  ('c1000000-0000-0000-0000-000000000006', 'Boiled Egg Plate', 'Two boiled eggs sprinkled with chat masala & pepper', 40.00, '/images/dishes/dish_43.jpeg', true, 1),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Bhurji (Full)', 'Scrambled eggs cooked with green chilies, onions, tomatoes & coriander', 110.00, '/images/dishes/dish_44.jpeg', true, 2),
  ('c1000000-0000-0000-0000-000000000006', 'Boiled Bhurji (Full)', 'Chopped boiled eggs tossed in spicy onion tomato masala', 100.00, '/images/dishes/dish_45.jpeg', true, 3),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Omelette', 'Double egg fluffy fried omelette with onions & green chilies', 60.00, '/images/dishes/dish_46.jpeg', true, 4),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Masala', 'Boiled eggs cooked in rich thick spicy gravy', 140.00, '/images/dishes/dish_47.jpeg', true, 5),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Curry (अंडा करी)', 'Hard boiled eggs simmered in spicy Maharashtrian curry gravy', 110.00, '/images/dishes/dish_48.jpeg', true, 6),

  -- 7. VEG DISHES
  ('c1000000-0000-0000-0000-000000000007', 'Paneer Masala (पनीर मसाला)', 'Cottage cheese cubes cooked in rich onion tomato gravy', 200.00, '/images/dishes/dish_49.jpeg', true, 1),
  ('c1000000-0000-0000-0000-000000000007', 'Kaju Curry (काजू करी)', 'Whole cashews simmered in rich creamy butter masala gravy', 200.00, '/images/dishes/dish_50.jpeg', true, 2),
  ('c1000000-0000-0000-0000-000000000007', 'Shev Bhaji (शेव भाजी)', 'Crispy spicy fried gram flour noodles in spicy curry gravy', 150.00, '/images/dishes/dish_51.jpeg', true, 3),
  ('c1000000-0000-0000-0000-000000000007', 'Sheng Bhaji (शेंग भाजी)', 'Peanut & spices curry gravy Maharashtrian specialty', 150.00, '/images/dishes/dish_51.jpeg', true, 4),
  ('c1000000-0000-0000-0000-000000000007', 'Dal Tadka (डाळ तडका)', 'Yellow lentils tempered with ghee, cumin seeds, garlic & red chilis', 150.00, '/images/dishes/dish_52.jpeg', true, 5),
  ('c1000000-0000-0000-0000-000000000007', 'Dal Fry (डाळ फ्राय)', 'Flavorful yellow dal fry tempered with butter and green chilies', 120.00, '/images/dishes/dish_52.jpeg', true, 6),
  ('c1000000-0000-0000-0000-000000000007', 'Baingan Masala (बैंगन मसाला)', 'Spicy roasted stuffed eggplant curry', 150.00, '/images/dishes/dish_49.jpeg', true, 7),

  -- 8. STARTERS
  ('c1000000-0000-0000-0000-000000000008', 'Finger Chips (फिंगर चिप्स)', 'Golden crispy fried potato french fries', 90.00, '/images/dishes/dish_23.jpeg', true, 1),
  ('c1000000-0000-0000-0000-000000000008', 'Gobi 65 (गोबी 65)', 'Crispy battered cauliflower florets tossed in spicy 65 masala', 80.00, '/images/dishes/dish_23.jpeg', true, 2),
  ('c1000000-0000-0000-0000-000000000008', 'Gobi Manchurian (गोबी मंचुरियन)', 'Indo-Chinese style crispy cauliflower tossed in tangy soy garlic sauce', 100.00, '/images/dishes/dish_25.jpeg', true, 3),
  ('c1000000-0000-0000-0000-000000000008', 'Kanda Pakoda (कांदा पकोडा)', 'Crispy fried onion fritters seasoned with carom seeds & chilies', 60.00, '/images/dishes/dish_51.jpeg', true, 4),
  ('c1000000-0000-0000-0000-000000000008', 'Masala Papad (मसाला पापड)', 'Roasted papad topped with chopped onions, tomatoes, coriander & spices', 50.00, '/images/dishes/dish_53.jpeg', true, 5),
  ('c1000000-0000-0000-0000-000000000008', 'Roasted Papad (रोस्टेड पापड)', 'Crispy charcoal roasted papad disc', 30.00, '/images/dishes/dish_53.jpeg', true, 6),

  -- 9. ROTI, BHAKRI & RICE
  ('c1000000-0000-0000-0000-000000000009', 'Jowar / Bajra Bhakri (भाकरी)', 'Freshly hand-pattered hot flatbread made from Jowar or Bajra millet', 25.00, '/images/dishes/dish_53.jpeg', true, 1),
  ('c1000000-0000-0000-0000-000000000009', 'Wheat Chapati (चपाती)', 'Soft whole wheat thin chapati roti', 20.00, '/images/dishes/dish_53.jpeg', true, 2),
  ('c1000000-0000-0000-0000-000000000009', 'Indrayani Rice - Full (इंद्रायणी राईस)', 'Fragrant sticky aromatic Indrayani rice, perfect with rassa', 120.00, '/images/dishes/dish_7.jpeg', true, 3),
  ('c1000000-0000-0000-0000-000000000009', 'Indrayani Rice - Half', 'Half portion fragrant Indrayani rice', 70.00, '/images/dishes/dish_7.jpeg', true, 4),
  ('c1000000-0000-0000-0000-000000000009', 'Jeera Rice - Full (जिरा राईस)', 'Steamed basmati rice tempered with ghee & cumin seeds', 140.00, '/images/dishes/dish_7.jpeg', true, 5),
  ('c1000000-0000-0000-0000-000000000009', 'Jeera Rice - Half', 'Half portion steamed jeera rice', 80.00, '/images/dishes/dish_7.jpeg', true, 6),

  -- 10. BULK KG ORDERS
  ('c1000000-0000-0000-0000-000000000010', 'Mutton (मटन) - 1 Kg', 'Freshly cooked bulk Mutton fry/curry (1 Full Kg)', 900.00, '/images/dishes/dish_40.jpeg', true, 1),
  ('c1000000-0000-0000-0000-000000000010', 'Mutton (मटन) - Half Kg', 'Freshly cooked bulk Mutton fry/curry (500g Half Kg)', 500.00, '/images/dishes/dish_41.jpeg', true, 2),
  ('c1000000-0000-0000-0000-000000000010', 'Chicken (चिकन) - 1 Kg', 'Freshly cooked bulk Chicken fry/curry (1 Full Kg)', 400.00, '/images/dishes/dish_32.jpeg', true, 3),
  ('c1000000-0000-0000-0000-000000000010', 'Chicken (चिकन) - Half Kg', 'Freshly cooked bulk Chicken fry/curry (500g Half Kg)', 250.00, '/images/dishes/dish_33.jpeg', true, 4),
  ('c1000000-0000-0000-0000-000000000010', 'Fish (मासे) - 1 Kg', 'Freshly prepared bulk Fish fry/curry (1 Full Kg)', 400.00, '/images/dishes/dish_1.jpeg', true, 5),
  ('c1000000-0000-0000-0000-000000000010', 'Fish (मासे) - Half Kg', 'Freshly prepared bulk Fish fry/curry (500g Half Kg)', 250.00, '/images/dishes/dish_2.jpeg', true, 6);

-- 9. Atomic Order Creation RPC Function
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
      RAISE EXCEPTION 'Menu item not found: %', (v_item->>'menu_item_id');
    END IF;

    IF NOT v_menu_item.is_available THEN
      RAISE EXCEPTION 'Menu item is currently unavailable: %', v_menu_item.name;
    END IF;

    v_total_amount := v_total_amount + (v_menu_item.price * (v_item->>'quantity')::INT);
  END LOOP;

  -- 4. Create Order Record
  INSERT INTO public.orders (
    table_id,
    customer_name,
    customer_phone,
    order_note,
    total_amount,
    status
  ) VALUES (
    p_table_id,
    p_customer_name,
    p_customer_phone,
    p_order_note,
    v_total_amount,
    'PENDING'
  ) RETURNING id INTO v_order_id;

  -- 5. Create Line Items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT * INTO v_menu_item 
    FROM public.menu_items 
    WHERE id = (v_item->>'menu_item_id')::UUID;

    INSERT INTO public.order_items (
      order_id,
      menu_item_id,
      item_name,
      unit_price,
      quantity,
      subtotal
    ) VALUES (
      v_order_id,
      v_menu_item.id,
      v_menu_item.name,
      v_menu_item.price,
      (v_item->>'quantity')::INT,
      v_menu_item.price * (v_item->>'quantity')::INT
    );
  END LOOP;

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'total_amount', v_total_amount,
    'status', 'PENDING'
  );
END;
$$;
