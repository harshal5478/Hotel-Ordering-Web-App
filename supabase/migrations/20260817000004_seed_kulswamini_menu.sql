-- ====================================================================
-- SHREE KULSWAMINI HOTEL - OFFICIAL MENU SEED MIGRATION
-- "Swad Jo Lakshat Rahil..." (Taste You Will Remember...)
-- Fish, Chicken, Mutton, Egg, Veg, Thali, Biryani & Roti/Rice Specials
-- ====================================================================

-- Clear existing sample menu items & categories to avoid duplicate conflicts
TRUNCATE TABLE public.order_items CASCADE;
TRUNCATE TABLE public.orders CASCADE;
TRUNCATE TABLE public.menu_items CASCADE;
TRUNCATE TABLE public.categories CASCADE;

-- 1. Insert Official Hotel Categories
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
  ('c1000000-0000-0000-0000-000000000010', 'Bulk Kg Orders (किलोने विक्री)', 'Special Bulk Orders by Weight (Per Half Kg / Full Kg)', 10, true);

-- 2. Insert Official Menu Items with Real Prices & High Quality Images

-- THALI SPECIALS
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_available, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Kulswamini Special Fish Thali (Chilapi)', 'Includes: 2 Pcs Fish Masala, 2 Pcs Kadak Fry, Curry/Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati, Indrayani Rice, Solkadhi & Sukat', 300.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000001', 'Special Chicken Thali', 'Includes: Chicken Fry, Chicken Rassa, Soup, Indrayani Rice, 2 Bhakri / 2 Chapati, 1 Boiled Egg & Solkadhi', 230.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000001', 'Special Mutton Thali', 'Includes: Mutton Fry, Spicy Mutton Rassa, Aalandi Soup, Indrayani Rice, 1 Boiled Egg, 2 Bhakri / 3 Chapati & Solkadhi', 300.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000001', 'Masala Fish Thali (Chilapi)', 'Includes: 4 Pcs Fish Masala Curry, Spicy Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', 220.00, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000001', 'Kadak Fish Fry Thali (Chilapi)', 'Includes: 4 Pcs Crispy Kadak Fry, Spicy Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', 220.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000001', 'Aalandi Fish Thali (Chilapi)', 'Includes: 4 Pcs Mild Aalandi Fish, Rassa, Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', 220.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 6),
  ('c1000000-0000-0000-0000-000000000001', 'Special Egg Thali', 'Includes: 2 Boiled Eggs, Egg Curry/Rassa, 3 Chapati, Jeera Rice & 2 Bhakri', 150.00, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop', true, 7),
  ('c1000000-0000-0000-0000-000000000001', 'Pure Veg Thali', 'Includes: 2 Veg Sabzi, 3 Chapati, Jeera Rice, Roasted Papad & 1 Sweet', 150.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 8);

-- FISH SPECIALS
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_available, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000002', 'Dum Fish Fry (दम मच्छी)', 'Steamed & shallow fried spiced whole fish in special masala', 150.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000002', 'Crispy Fish Fry (फ्राय मच्छी)', 'Traditional Tawa fried crispy fish with red chili masala marinade', 150.00, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000002', 'Bangda Tava Fish (बांगडा तवा)', 'Fresh Mackerel marinated in Kokum & Konkani spices, tava fried', 160.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000002', 'Bangda Rava Fish (बांगडा रवा)', 'Mackerel coated in semolina (Rava) for an extra crunchy texture', 160.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000002', 'Tomato Fish Curry (टमाटा मच्छी)', 'Tangy fresh fish curry cooked in rich tomato and garlic gravy', 200.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000002', 'Fish Masala Gravy (मच्छी मसाला)', 'Classic spicy Malvani fish curry cooked with freshly ground spices', 120.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 6),
  ('c1000000-0000-0000-0000-000000000002', 'Bombil Fry (बॉबील फ्राय)', 'Golden crispy rava fried Bombay Duck fish - crisp outside, tender inside', 180.00, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop', true, 7);

-- BIRYANI SPECIALS
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_available, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000003', 'Chicken Dum Biryani - Full', 'Aromatic basmati rice cooked on dum with marinated tender chicken pieces & spices', 210.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000003', 'Chicken Dum Biryani - Half', 'Half portion aromatic chicken dum biryani', 140.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000003', 'Mutton Dum Biryani - Full', 'Rich & flavorful dum biryani cooked with succulent goat meat mutton pieces', 300.00, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000003', 'Mutton Dum Biryani - Half', 'Half portion rich mutton dum biryani', 180.00, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000003', 'Egg Biryani - Full', 'Flavorful biryani cooked with boiled eggs and saffron basmati rice', 210.00, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000003', 'Egg Biryani - Half', 'Half portion egg biryani', 140.00, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop', true, 6);

-- CHICKEN MAIN COURSE
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_available, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Fry (चिकन फ्राय)', 'Spicy dry fried chicken tossed with caramelized onions and Maharashtrian spices', 150.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken 65 (5 Pcs)', 'Deep fried crispy chicken bites tossed in spicy yogurt & curry leaf tempered gravy', 180.00, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Sukka (चिकन सुकी)', 'Semi-dry roasted chicken dish with toasted coconut & Malvani spices', 120.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Masala Gravy', 'Classic chicken curry in thick onion tomato masala gravy', 130.00, 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Handi - Full', 'Rich Handi chicken gravy cooked in earthen pot with roasted spices (Serves 3-4)', 700.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Handi - Half', 'Half portion rich Handi chicken gravy (Serves 2)', 400.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', true, 6),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Dum Murgh Whole', 'Whole chicken slow cooked on dum in rich spicy aromatic gravy', 600.00, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop', true, 7),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Lollipop (8 Pcs)', 'Crispy fried chicken drumettes served with spicy sauce', 210.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 8),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Lollipop (4 Pcs)', 'Half portion crispy chicken lollipops', 120.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 9),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Rassa / Soup', 'Aromatic Maharashtrian hot chicken broth soup', 50.00, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop', true, 10);

-- MUTTON MAIN COURSE
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_available, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Fry (मटन फ्राय)', 'Tender goat meat dry fried in spicy Konkani black masala', 270.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Masala Gravy', 'Mutton pieces simmered in spicy onion, ginger, garlic & coconut gravy', 270.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Sukka (मटन सुकी)', 'Semi-dry roasted mutton tossed with dry coconut flakes & roasted spices', 280.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Handi Malvani - Full', 'Traditional Malvani style earthen pot mutton curry (Serves 3-4)', 900.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Handi Malvani - Half', 'Half portion Malvani style mutton handi (Serves 2)', 500.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Soup / Aalandi Rassa', 'Hot mutton bone broth rassa soup filled with rich flavors', 90.00, 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop', true, 6);

-- EGG SPECIALS
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_available, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000006', 'Egg Bhurji - Full (अंडा भुर्जी)', 'Scrambled eggs cooked with green chilies, onions, tomatoes & coriander', 110.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Bhurji - Half', 'Half portion scrambled egg bhurji', 60.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000006', 'Boiled Egg Bhurji - Full', 'Shredded boiled eggs cooked in spicy bhurji masala', 100.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Curry (अंडा करी)', 'Hard boiled eggs simmered in spicy Maharashtrian curry gravy', 110.00, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Masala (अंडा मसाला)', 'Thick gravy egg masala cooked with fresh spices', 140.00, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Omelette (अंडा आमलेट)', 'Pan fried double egg omelette with green chili & onion', 60.00, 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&auto=format&fit=crop', true, 6),
  ('c1000000-0000-0000-0000-000000000006', 'Boiled Egg Plate (बॉईल प्लेट)', 'Plate of 2 plain hard boiled eggs served with salt & black pepper', 40.00, 'https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?w=600&auto=format&fit=crop', true, 7);

-- VEG DISHES
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_available, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000007', 'Paneer Masala (पनीर मसाला)', 'Cottage cheese cubes cooked in rich onion tomato gravy', 200.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000007', 'Kaju Curry (काजू करी)', 'Whole cashews simmered in rich creamy butter masala gravy', 200.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000007', 'Shev Bhaji (शेव भाजी)', 'Khandeshi special spicy curry topped with crispy gram flour Shev', 150.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000007', 'Sheng Bhaji (शेंग भाजी)', 'Roasted peanut curry cooked in Maharashtrian spiced gravy', 150.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000007', 'Dal Tadka (डाळ तडका)', 'Yellow lentils tempered with ghee, cumin seeds, garlic & red chilis', 150.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000007', 'Dal Fry (डाळ फ्राय)', 'Creamy yellow lentils fried with onions & tomatoes', 120.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 6),
  ('c1000000-0000-0000-0000-000000000007', 'Baingan Masala (बैंगन मसाला)', 'Baby eggplants stuffed with peanut coconut masala', 150.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 7);

-- STARTERS
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_available, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000008', 'Gobi Manchurian (गोबी मंचुरियन)', 'Crispy fried cauliflower florets tossed in tangy Indo-Chinese Manchurian sauce', 100.00, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000008', 'Finger Chips (फिंगर चिप्स)', 'Golden salted potato french fries served with ketchup', 90.00, 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000008', 'Gobi 65 (गोबी 65)', 'Spicy fried cauliflower bites seasoned with curry leaves', 80.00, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000008', 'Kanda Pakoda (कांदा पकोडा)', 'Crispy onion fritters fried with gram flour & green chili', 60.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000008', 'Masala Papad (मसाला पापड)', 'Roasted crispy papad topped with chopped onions, tomatoes & chaat masala', 50.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000008', 'Roasted Papad (रोस्टेड पापड)', 'Plain fire roasted crunchy lentil papad', 30.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop', true, 6);

-- ROTI, BHAKRI & RICE
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_available, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000009', 'Jowar / Bajra Bhakri (भाकरी)', 'Freshly hand-pattered hot flatbread made from Jowar or Bajra millet', 25.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000009', 'Wheat Chapati (चपाती)', 'Soft whole wheat thin chapati roti', 20.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000009', 'Indrayani Rice - Full (इंद्रायणी राईस)', 'Fragrant sticky aromatic Indrayani rice, perfect with rassa', 120.00, 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000009', 'Indrayani Rice - Half', 'Half portion Indrayani rice', 70.00, 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000009', 'Jeera Rice - Full (जिरा राईस)', 'Steamed basmati rice tempered with ghee & cumin seeds', 140.00, 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000009', 'Jeera Rice - Half', 'Half portion Jeera rice', 80.00, 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop', true, 6);

-- BULK KG ORDERS
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_available, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000010', 'Mutton Curry / Fry - 1 Kg', 'Full 1 Kg quantity order of special Malvani Mutton Fry / Curry', 500.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000010', 'Mutton Curry / Fry - Half Kg', 'Half 500g quantity order of special Mutton Fry / Curry', 300.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000010', 'Chicken Curry / Fry - 1 Kg', 'Full 1 Kg quantity order of special Chicken Fry / Curry', 400.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000010', 'Chicken Curry / Fry - Half Kg', 'Half 500g quantity order of special Chicken Fry / Curry', 250.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000010', 'Fish Fry (Chilapi) - 1 Kg', 'Full 1 Kg quantity order of freshly fried Fish', 400.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000010', 'Fish Fry (Chilapi) - Half Kg', 'Half 500g quantity order of freshly fried Fish', 250.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', true, 6);
