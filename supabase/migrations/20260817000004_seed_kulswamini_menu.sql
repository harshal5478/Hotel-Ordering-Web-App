-- Seed Official Shree Kulswamini Hotel Categories & Menu Items
-- Runs in Supabase SQL Editor to populate exact dish list and prices from menu card

-- 1. Insert Categories
INSERT INTO public.categories (id, name, description, sort_order, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Thali Specials (थाळी)', 'Authentic Maharashtrian Non-Veg & Veg Thalis with Rassa, Bhakri, Indrayani Rice & Solkadhi', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Fish Fry (मच्छी फ्राय)', 'Fresh Malvani style Fish Fry, Rava Fry, Masala Curry & Bombil Fry', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Biryani (बिर्याणी)', 'Aromatic Dum Biryani served with spicy gravy & Raita', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Specials (चिकन)', 'Spicy Chicken Fry, Handi, Sukka, Curry & Lollipop Specials', 4, true),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Specials (मटन)', 'Malvani Mutton Handi, Mutton Fry, Mutton Sukka & Mutton Masala', 5, true),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Specials (अंडा)', 'Egg Bhurji, Egg Curry, Egg Masala & Omelette', 6, true),
  ('c1000000-0000-0000-0000-000000000007', 'Veg Specials (व्हेज)', 'Paneer Masala, Kaju Curry, Shev Bhaji, Dal Tadka & Baingan Masala', 7, true),
  ('c1000000-0000-0000-0000-000000000008', 'Starters (स्टार्टर)', 'Finger Chips, Gobi 65, Gobi Manchurian, Kanda Pakoda & Papad', 8, true),
  ('c1000000-0000-0000-0000-000000000009', 'Bhakri, Roti & Rice (भाकरी / भात)', 'Hot Jowar/Bajra Bhakri, Chapati, Indrayani Rice & Jeera Rice', 9, true),
  ('c1000000-0000-0000-0000-000000000010', 'Bulk Kg Sales (किलोने विक्री)', 'Special Bulk Orders by Weight (Per Half Kg / Full Kg)', 10, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

-- 2. Insert Menu Items
INSERT INTO public.menu_items (category_id, name, description, price, image_url, is_available, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Kulswamini Special Fish Thali (Chilapi)', 'Includes: 2 Pcs Fish Masala, 2 Pcs Kadak Fry, Curry/Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati, Indrayani Rice, Solkadhi & Sukat', 300.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000001', 'Masala Fish Thali (Chilapi)', 'Includes: 4 Pcs Fish Masala Curry, Spicy Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', 220.00, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000001', 'Kadak Fish Fry Thali (Chilapi)', 'Includes: 4 Pcs Crispy Kadak Fry, Spicy Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', 220.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000001', 'Aalandi Fish Thali (Chilapi)', 'Includes: 4 Pcs Mild Aalandi Fish, Rassa, Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', 220.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000001', 'Chicken Thali', 'Includes: Chicken Fry, Chicken Rassa, Soup, Indrayani Rice, 2 Bhakri / 2 Chapati, 1 Boiled Egg & Solkadhi', 230.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000001', 'Chicken Rassa Thali', 'Includes: Chicken Rassa, Aalandi Soup, Indrayani Rice, Bhakri/Chapati & Solkadhi', 170.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', true, 6),
  ('c1000000-0000-0000-0000-000000000001', 'Mutton Thali', 'Includes: Mutton Fry, Spicy Mutton Rassa, Aalandi Soup, Indrayani Rice, 1 Boiled Egg, 2 Bhakri / 3 Chapati & Solkadhi', 300.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 7),
  ('c1000000-0000-0000-0000-000000000001', 'Veg Thali', 'Includes: 2 Veg Sabzi, 3 Chapati, Jeera Rice, Roasted Papad & 1 Sweet', 150.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 8),
  ('c1000000-0000-0000-0000-000000000001', 'Egg Thali', 'Includes: 2 Boiled Eggs, Egg Curry/Rassa, 3 Chapati, Jeera Rice & 2 Bhakri', 150.00, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop', true, 9),

  ('c1000000-0000-0000-0000-000000000002', 'Dum Fish (दम मच्छी)', 'Steamed & shallow fried spiced whole fish in special masala', 150.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000002', 'Fry Fish (फ्राय मच्छी)', 'Traditional Tawa fried crispy fish with red chili masala marinade', 150.00, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000002', 'Bangda Tava Fish (बांगडा तवा मच्छी)', 'Fresh Mackerel marinated in Kokum & Konkani spices, tava fried', 160.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000002', 'Bangda Rava Fish (बांगडा रवा मच्छी)', 'Mackerel coated in semolina (Rava) for an extra crunchy texture', 160.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000002', 'Tomato Fish (टमाटा मच्छी)', 'Tangy fresh fish curry cooked in rich tomato and garlic gravy', 200.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000002', 'Fish Masala (मच्छी मसाला)', 'Classic spicy Malvani fish curry cooked with freshly ground spices', 120.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 6),
  ('c1000000-0000-0000-0000-000000000002', 'Bombil Fry (बॉबील फ्राय)', 'Golden crispy rava fried Bombay Duck fish - crisp outside, tender inside', 180.00, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop', true, 7),

  ('c1000000-0000-0000-0000-000000000003', 'Chicken Biryani Dum - Full', 'Aromatic basmati rice cooked on dum with marinated tender chicken pieces', 210.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000003', 'Chicken Biryani Dum - Half', 'Half portion aromatic chicken dum biryani', 140.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000003', 'Mutton Biryani Dum - Full', 'Rich & flavorful dum biryani cooked with succulent goat meat mutton pieces', 300.00, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000003', 'Mutton Biryani Dum - Half', 'Half portion rich mutton dum biryani', 180.00, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000003', 'Egg Biryani - Full', 'Aromatic basmati rice cooked with boiled eggs and biryani spices', 210.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000003', 'Egg Biryani - Half', 'Half portion egg biryani', 140.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop', true, 6),

  ('c1000000-0000-0000-0000-000000000004', 'Chicken 65 (5 Pcs)', 'Deep fried crispy chicken bites tossed in spicy curry leaf tempered gravy', 180.00, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Fry (चिकन फ्राय)', 'Spicy dry fried chicken tossed with caramelized onions and Maharashtrian spices', 150.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Chili (6 Pcs)', 'Indo-Chinese style crispy fried chicken tossed in chili sauce', 180.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Chili (10 Pcs)', 'Large portion Indo-Chinese chili chicken', 240.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Sukka (चिकन सुकी)', 'Semi-dry roasted chicken dish with toasted coconut & Malvani spices', 120.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Lollipop (4 Pcs)', 'Crispy fried chicken wings lollipop', 120.00, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop', true, 6),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Lollipop (8 Pcs)', '8 Pcs crispy fried chicken lollipop', 210.00, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop', true, 7),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Dum Murgh', 'Whole marinated chicken slow-cooked on dum in rich gravy', 600.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', true, 8),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Masala', 'Spicy chicken gravy cooked in onion and tomato masala', 130.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', true, 9),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Handi - Full', 'Rich Handi chicken gravy cooked in earthen pot (Serves 3-4)', 700.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', true, 10),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Handi - Half', 'Half portion rich Handi chicken gravy (Serves 2)', 400.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', true, 11),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Lollipop Masala (4 Pcs)', 'Chicken lollipops tossed in spicy gravy', 130.00, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop', true, 12),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Lollipop Masala (8 Pcs)', '8 Pcs chicken lollipops tossed in spicy gravy', 240.00, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop', true, 13),
  ('c1000000-0000-0000-0000-000000000004', 'Chicken Soup (चिकन सूप)', 'Hot spicy clear chicken broth soup', 50.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop', true, 14),

  ('c1000000-0000-0000-0000-000000000005', 'Mutton Fry (मटन फ्राय)', 'Tender goat meat dry fried in spicy Konkani black masala', 270.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Masala (मटन मसाला)', 'Mutton pieces simmered in spicy onion, ginger, garlic & coconut gravy', 270.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Sukka (मटन सुकी)', 'Semi-dry roasted mutton dish cooked with toasted coconut & spices', 280.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Handi Malvani - Full', 'Traditional Malvani style earthen pot mutton curry (Serves 3-4)', 900.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Handi Malvani - Half', 'Half portion Malvani style mutton handi (Serves 2)', 500.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000005', 'Mutton Soup (मटन सूप)', 'Hot spicy clear mutton broth aalandi soup', 90.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop', true, 6),

  ('c1000000-0000-0000-0000-000000000006', 'Boiled Egg Plate (बॉईल प्लेट)', 'Plain hard boiled egg plate', 40.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Bhurji - Full (अंडा भुर्जी)', 'Scrambled eggs cooked with green chilies, onions & spices', 110.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Bhurji - Half', 'Half portion scrambled egg bhurji', 60.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000006', 'Boiled Bhurji - Full (बॉईल भुर्जी)', 'Scrambled boiled eggs cooked with onions & masala', 100.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000006', 'Boiled Bhurji - Half', 'Half portion boiled bhurji', 60.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Omelette (अंडा आमलेट)', 'Classic spiced double egg omelette', 60.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', true, 6),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Masala (अंडा मसाला)', 'Boiled eggs cooked in rich spicy onion tomato gravy', 140.00, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop', true, 7),
  ('c1000000-0000-0000-0000-000000000006', 'Egg Curry (अंडा करी)', 'Hard boiled eggs simmered in spicy Maharashtrian curry gravy', 110.00, 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop', true, 8),

  ('c1000000-0000-0000-0000-000000000007', 'Paneer Masala (पनीर मसाला)', 'Cottage cheese cubes cooked in rich onion tomato gravy', 200.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000007', 'Kaju Curry (काजू करी)', 'Whole cashews simmered in rich creamy butter masala gravy', 200.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000007', 'Shev Bhaji (शेव भाजी)', 'Crispy spicy fried gram flour noodle gravy', 150.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000007', 'Sheng Bhaji (शेंग भाजी)', 'Delicious roasted peanut and garlic spicy gravy', 150.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000007', 'Dal Tadka (डाळ तडका)', 'Yellow lentils tempered with ghee, cumin seeds, garlic & red chilis', 150.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000007', 'Dal Fry (डाळ फ्राय)', 'Yellow dal tempered with onions, tomatoes and garlic', 120.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 6),
  ('c1000000-0000-0000-0000-000000000007', 'Baingan Masala (बैंगन मसाला)', 'Roasted stuffed eggplant cooked in Maharashtrian peanut garlic gravy', 150.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 7),

  ('c1000000-0000-0000-0000-000000000008', 'Finger Chips (फिंगर चिप्स)', 'Crispy fried potato french fries', 90.00, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000008', 'Gobi 65 (गोबी 65)', 'Deep fried crispy cauliflower florets in 65 spicy marinade', 80.00, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000008', 'Gobi Manchurian (गोबी मंचुरियन)', 'Crispy cauliflower tossed in spicy soy garlic Manchurian sauce', 100.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000008', 'Kanda Pakoda (कांदा पकोडा)', 'Crispy golden fried onion fritters', 60.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000008', 'Masala Papad (मसाला पापड)', 'Roasted papad topped with chopped onions, tomatoes & chaat masala', 50.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000008', 'Roasted Papad (रोस्टेड पापड)', 'Plain crisp charcoal roasted lentil papad', 30.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', true, 6),

  ('c1000000-0000-0000-0000-000000000009', 'Wheat Chapati (चपाती)', 'Soft whole wheat thin chapati roti', 20.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000009', 'Jowar / Bajra Bhakri (भाकरी)', 'Freshly hand-pattered hot flatbread made from Jowar or Bajra millet', 25.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000009', 'Jeera Rice - Full (जिरा राईस)', 'Steamed basmati rice tempered with ghee & cumin seeds', 140.00, 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000009', 'Jeera Rice - Half', 'Half portion Jeera rice', 80.00, 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000009', 'Indrayani Rice - Full (इंद्रायणी राईस)', 'Fragrant sticky aromatic Indrayani rice, perfect with rassa', 120.00, 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000009', 'Indrayani Rice - Half', 'Half portion Indrayani sticky rice', 70.00, 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop', true, 6),

  ('c1000000-0000-0000-0000-000000000010', 'Mutton Per Kg (मटन १ किलो)', 'Bulk Mutton cooked dish (1 Full Kg)', 500.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 1),
  ('c1000000-0000-0000-0000-000000000010', 'Mutton Per Half Kg (मटन अर्धा किलो)', 'Bulk Mutton cooked dish (Half Kg)', 300.00, 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', true, 2),
  ('c1000000-0000-0000-0000-000000000010', 'Chicken Per Kg (चिकन १ किलो)', 'Bulk Chicken cooked dish (1 Full Kg)', 400.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 3),
  ('c1000000-0000-0000-0000-000000000010', 'Chicken Per Half Kg (चिकन अर्धा किलो)', 'Bulk Chicken cooked dish (Half Kg)', 250.00, 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', true, 4),
  ('c1000000-0000-0000-0000-000000000010', 'Fish Per Kg (मासे १ किलो)', 'Bulk Fish cooked dish (1 Full Kg)', 400.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', true, 5),
  ('c1000000-0000-0000-0000-000000000010', 'Fish Per Half Kg (मासे अर्धा किलो)', 'Bulk Fish cooked dish (Half Kg)', 250.00, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', true, 6);
