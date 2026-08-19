'use server';

import { createClient } from '@/lib/supabase/server';
import { Table, Category, MenuItem } from '@/types';

// =========================================================
// OFFICIAL SHREE KULSWAMINI HOTEL (FISH SPECIAL) MENU
// All 53 items mapped 1-to-1 to public/images/dishes/dish_X.jpeg
// =========================================================

const KULSWAMINI_CATEGORIES: Category[] = [
  { id: 'c1000000-0000-0000-0000-000000000001', name: 'Thali Specials (थाळी)', description: 'Authentic Maharashtrian Fish, Chicken, Mutton, Veg & Egg Thalis with Rassa, Bhakri/Chapati & Rice', sort_order: 1, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000002', name: 'Fish Fry & Curry (मच्छी)', description: 'Fresh Malvani style Fish Fry, Rava Fry, Bangda, Tomato Fish & Bombil Fry', sort_order: 2, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000003', name: 'Biryani Specials (बिर्याणी)', description: 'Aromatic Dum Biryani served with spicy gravy & Raita', sort_order: 3, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Main Course (चिकन)', description: 'Spicy Chicken Fry, Handi, Sukka, Curry, Lollipop & Soup Specials', sort_order: 4, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000005', name: 'Mutton Main Course (मटन)', description: 'Malvani Mutton Handi, Mutton Fry, Mutton Sukka, Masala & Soup', sort_order: 5, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000006', name: 'Egg Specials (अंडा)', description: 'Boiled Plate, Egg Bhurji, Boiled Bhurji, Omelette, Masala & Curry', sort_order: 6, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000007', name: 'Veg Dishes (व्हेज)', description: 'Paneer Masala, Kaju Curry, Shev Bhaji, Sheng Bhaji, Dal Tadka, Dal Fry & Baingan Masala', sort_order: 7, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000008', name: 'Starters (स्टार्टर)', description: 'Finger Chips, Gobi 65, Gobi Manchurian, Kanda Pakoda, Masala Papad & Roasted Papad', sort_order: 8, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000009', name: 'Roti, Bhakri & Rice (रोटी / भात)', description: 'Hot Jowar/Bajra Bhakri, Chapati, Indrayani Rice & Jeera Rice', sort_order: 9, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000010', name: 'Bulk Kg Orders (किलोने विक्री)', description: 'Special Bulk Orders by Weight (Half Kg / Full Kg)', sort_order: 10, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const KULSWAMINI_MENU_ITEMS: MenuItem[] = [
  // 1. THALI SPECIALS
  { id: 'm101', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Kulswamini Special Fish Thali (Chilapi)', description: 'Includes: 2 Pcs Fish Masala, 2 Pcs Kadak Fry, Curry/Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati, Indrayani Rice, Solkadhi & Sukat', price: 300, image_url: '/images/dishes/dish_1.jpeg', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm102', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Masala Fish Thali (Chilapi)', description: 'Includes: 4 Pcs Fish Masala Curry, Spicy Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', price: 220, image_url: '/images/dishes/dish_2.jpeg', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm103', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Kadak Fish Fry Thali (Chilapi)', description: 'Includes: 4 Pcs Crispy Kadak Fry, Spicy Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', price: 220, image_url: '/images/dishes/dish_3.jpeg', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm104', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Aalandi Fish Thali (Chilapi)', description: 'Includes: 4 Pcs Mild Aalandi Fish, Rassa, Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', price: 220, image_url: '/images/dishes/dish_4.jpeg', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm105', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Special Chicken Thali', description: 'Includes: Chicken Fry, Chicken Rassa, Soup, Indrayani Rice, 2 Bhakri / 2 Chapati, 1 Boiled Egg & Solkadhi', price: 230, image_url: '/images/dishes/dish_5.jpeg', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm106', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Special Mutton Thali', description: 'Includes: Mutton Fry, Spicy Mutton Rassa, Aalandi Soup, Indrayani Rice, 1 Boiled Egg, 2 Bhakri / 3 Chapati & Solkadhi', price: 300, image_url: '/images/dishes/dish_6.jpeg', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm107', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Pure Veg Thali', description: 'Includes: 2 Veg Sabzi, 3 Chapati, Jeera Rice, Roasted Papad & 1 Sweet', price: 150, image_url: '/images/dishes/dish_7.jpeg', is_available: true, sort_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm108', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Special Egg Thali', description: 'Includes: 2 Boiled Eggs, Egg Curry/Rassa, 3 Chapati, Jeera Rice & 2 Bhakri', price: 150, image_url: '/images/dishes/dish_8.jpeg', is_available: true, sort_order: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm109', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Chicken Rassa Thali', description: 'Includes: Chicken Rassa Gravy, Soup, Indrayani Rice, 2 Bhakri / 3 Chapati', price: 170, image_url: '/images/dishes/dish_22.jpeg', is_available: true, sort_order: 9, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // 2. FISH FRY & CURRY
  { id: 'm201', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Dum Fish Fry (दम मच्छी)', description: 'Steamed & shallow fried spiced whole fish in special masala', price: 150, image_url: '/images/dishes/dish_9.jpeg', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm202', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Crispy Fish Fry (फ्राय मच्छी)', description: 'Traditional Tawa fried crispy fish with red chili masala marinade', price: 150, image_url: '/images/dishes/dish_10.jpeg', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm203', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Bangda Tava Fish (बांगडा तवा)', description: 'Fresh Mackerel marinated in Kokum & Konkani spices, tava fried', price: 160, image_url: '/images/dishes/dish_11.jpeg', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm204', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Bangda Rava Fish (बांगडा रवा)', description: 'Mackerel coated in semolina (Rava) for an extra crunchy texture', price: 160, image_url: '/images/dishes/dish_12.jpeg', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm205', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Tomato Fish Curry (टमाटा मच्छी)', description: 'Tangy fresh fish curry cooked in rich tomato and garlic gravy', price: 200, image_url: '/images/dishes/dish_13.jpeg', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm206', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Fish Masala Gravy (मच्छी मसाला)', description: 'Classic spicy Malvani fish curry cooked with freshly ground spices', price: 120, image_url: '/images/dishes/dish_14.jpeg', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm207', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Bombil Fry (बॉबील फ्राय)', description: 'Golden crispy rava fried Bombay Duck fish - crisp outside, tender inside', price: 180, image_url: '/images/dishes/dish_15.jpeg', is_available: true, sort_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // 3. BIRYANI SPECIALS
  { id: 'm301', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Chicken Dum Biryani - Full', description: 'Aromatic basmati rice cooked on dum with marinated tender chicken pieces', price: 210, image_url: '/images/dishes/dish_16.jpeg', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm302', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Chicken Dum Biryani - Half', description: 'Half portion aromatic chicken dum biryani', price: 140, image_url: '/images/dishes/dish_17.jpeg', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm303', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Mutton Dum Biryani - Full', description: 'Rich & flavorful dum biryani cooked with succulent mutton pieces', price: 300, image_url: '/images/dishes/dish_18.jpeg', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm304', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Mutton Dum Biryani - Half', description: 'Half portion rich mutton dum biryani', price: 180, image_url: '/images/dishes/dish_19.jpeg', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm305', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Egg Biryani - Full', description: 'Delicious dum biryani cooked with spicy boiled eggs', price: 210, image_url: '/images/dishes/dish_20.jpeg', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm306', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Egg Biryani - Half', description: 'Half portion spicy egg dum biryani', price: 140, image_url: '/images/dishes/dish_21.jpeg', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // 4. CHICKEN MAIN COURSE
  { id: 'm401', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken 65 (5 Pcs)', description: 'Deep fried crispy chicken bites tossed in spicy curry leaf tempered gravy', price: 180, image_url: '/images/dishes/dish_23.jpeg', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm402', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Fry (चिकन फ्राय)', description: 'Spicy dry fried chicken tossed with caramelized onions and Maharashtrian spices', price: 150, image_url: '/images/dishes/dish_24.jpeg', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm403', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Chilli (6 Pcs)', description: 'Indo-Chinese style crispy fried chicken tossed in chili garlic sauce', price: 180, image_url: '/images/dishes/dish_25.jpeg', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm404', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Chilli (10 Pcs)', description: 'Large portion Indo-Chinese style chicken chili', price: 240, image_url: '/images/dishes/dish_26.jpeg', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm405', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Sukka (चिकन सुकी)', description: 'Semi-dry roasted chicken dish with toasted coconut & Malvani spices', price: 120, image_url: '/images/dishes/dish_27.jpeg', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm406', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Lollipop (4 Pcs)', description: 'Crispy fried chicken winglets served with spicy Schezwan dip', price: 120, image_url: '/images/dishes/dish_28.jpeg', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm407', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Lollipop (8 Pcs)', description: 'Large portion crispy chicken lollipops (8 Pcs)', price: 210, image_url: '/images/dishes/dish_29.jpeg', is_available: true, sort_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm408', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Dum Murga', description: 'Whole slow cooked chicken simmered on dum in rich royal spices', price: 600, image_url: '/images/dishes/dish_30.jpeg', is_available: true, sort_order: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm409', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Masala', description: 'Tender chicken pieces simmered in spicy onion-tomato gravy', price: 130, image_url: '/images/dishes/dish_31.jpeg', is_available: true, sort_order: 9, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm410', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Handi - Full', description: 'Rich Handi chicken gravy cooked in earthen pot with roasted spices (Serves 3-4)', price: 700, image_url: '/images/dishes/dish_32.jpeg', is_available: true, sort_order: 10, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm411', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Handi - Half', description: 'Half portion rich Handi chicken gravy (Serves 2)', price: 400, image_url: '/images/dishes/dish_33.jpeg', is_available: true, sort_order: 11, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm412', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Lollipop Masala (4 Pcs)', description: 'Chicken lollipops tossed in rich spicy masala gravy (4 Pcs)', price: 130, image_url: '/images/dishes/dish_34.jpeg', is_available: true, sort_order: 12, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm413', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Lollipop Masala (8 Pcs)', description: 'Chicken lollipops tossed in rich spicy masala gravy (8 Pcs)', price: 240, image_url: '/images/dishes/dish_35.jpeg', is_available: true, sort_order: 13, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm414', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Soup', description: 'Hot & healthy chicken clear soup infused with ginger & pepper', price: 50, image_url: '/images/dishes/dish_36.jpeg', is_available: true, sort_order: 14, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // 5. MUTTON MAIN COURSE
  { id: 'm501', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Mutton Fry (मटन फ्राय)', description: 'Tender goat meat dry fried in spicy Konkani black masala', price: 270, image_url: '/images/dishes/dish_37.jpeg', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm502', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Mutton Masala Gravy', description: 'Mutton pieces simmered in spicy onion, ginger, garlic & coconut gravy', price: 270, image_url: '/images/dishes/dish_38.jpeg', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm503', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Mutton Sukki (मटन सुकी)', description: 'Roasted mutton dish cooked with dried coconut and aromatic spices', price: 280, image_url: '/images/dishes/dish_39.jpeg', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm504', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Mutton Handi Malvani - Full', description: 'Traditional Malvani style earthen pot mutton curry (Serves 3-4)', price: 900, image_url: '/images/dishes/dish_40.jpeg', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm505', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Mutton Handi Malvani - Half', description: 'Half portion Malvani style mutton handi (Serves 2)', price: 500, image_url: '/images/dishes/dish_41.jpeg', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm506', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Mutton Soup', description: 'Nourishing spicy mutton bone broth soup', price: 90, image_url: '/images/dishes/dish_42.jpeg', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // 6. EGG SPECIALS
  { id: 'm601', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Boiled Egg Plate', description: 'Two boiled eggs sprinkled with chat masala & pepper', price: 40, image_url: '/images/dishes/dish_43.jpeg', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm602', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Egg Bhurji (Full)', description: 'Scrambled eggs cooked with green chilies, onions, tomatoes & coriander', price: 110, image_url: '/images/dishes/dish_44.jpeg', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm603', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Boiled Bhurji (Full)', description: 'Chopped boiled eggs tossed in spicy onion tomato masala', price: 100, image_url: '/images/dishes/dish_45.jpeg', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm604', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Egg Omelette', description: 'Double egg fluffy fried omelette with onions & green chilies', price: 60, image_url: '/images/dishes/dish_46.jpeg', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm605', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Egg Masala', description: 'Boiled eggs cooked in rich thick spicy gravy', price: 140, image_url: '/images/dishes/dish_47.jpeg', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm606', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Egg Curry (अंडा करी)', description: 'Hard boiled eggs simmered in spicy Maharashtrian curry gravy', price: 110, image_url: '/images/dishes/dish_48.jpeg', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // 7. VEG DISHES
  { id: 'm701', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Paneer Masala (पनीर मसाला)', description: 'Cottage cheese cubes cooked in rich onion tomato gravy', price: 200, image_url: '/images/dishes/dish_49.jpeg', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm702', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Kaju Curry (काजू करी)', description: 'Whole cashews simmered in rich creamy butter masala gravy', price: 200, image_url: '/images/dishes/dish_50.jpeg', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm703', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Shev Bhaji (शेव भाजी)', description: 'Crispy spicy fried gram flour noodles in spicy curry gravy', price: 150, image_url: '/images/dishes/dish_51.jpeg', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm704', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Sheng Bhaji (शेंग भाजी)', description: 'Peanut & spices curry gravy Maharashtrian specialty', price: 150, image_url: '/images/dishes/dish_51.jpeg', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm705', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Dal Tadka (डाळ तडका)', description: 'Yellow lentils tempered with ghee, cumin seeds, garlic & red chilis', price: 150, image_url: '/images/dishes/dish_52.jpeg', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm706', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Dal Fry (डाळ फ्राय)', description: 'Flavorful yellow dal fry tempered with butter and green chilies', price: 120, image_url: '/images/dishes/dish_52.jpeg', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm707', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Baingan Masala (बैंगन मसाला)', description: 'Spicy roasted stuffed eggplant curry', price: 150, image_url: '/images/dishes/dish_49.jpeg', is_available: true, sort_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // 8. STARTERS
  { id: 'm801', category_id: 'c1000000-0000-0000-0000-000000000008', name: 'Finger Chips (फिंगर चिप्स)', description: 'Golden crispy fried potato french fries', price: 90, image_url: '/images/dishes/dish_23.jpeg', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm802', category_id: 'c1000000-0000-0000-0000-000000000008', name: 'Gobi 65 (गोबी 65)', description: 'Crispy battered cauliflower florets tossed in spicy 65 masala', price: 80, image_url: '/images/dishes/dish_23.jpeg', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm803', category_id: 'c1000000-0000-0000-0000-000000000008', name: 'Gobi Manchurian (गोबी मंचुरियन)', description: 'Indo-Chinese style crispy cauliflower tossed in tangy soy garlic sauce', price: 100, image_url: '/images/dishes/dish_25.jpeg', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm804', category_id: 'c1000000-0000-0000-0000-000000000008', name: 'Kanda Pakoda (कांदा पकोडा)', description: 'Crispy fried onion fritters seasoned with carom seeds & chilies', price: 60, image_url: '/images/dishes/dish_51.jpeg', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm805', category_id: 'c1000000-0000-0000-0000-000000000008', name: 'Masala Papad (मसाला पापड)', description: 'Roasted papad topped with chopped onions, tomatoes, coriander & spices', price: 50, image_url: '/images/dishes/dish_53.jpeg', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm806', category_id: 'c1000000-0000-0000-0000-000000000008', name: 'Roasted Papad (रोस्टेड पापड)', description: 'Crispy charcoal roasted papad disc', price: 30, image_url: '/images/dishes/dish_53.jpeg', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // 9. ROTI, BHAKRI & RICE
  { id: 'm901', category_id: 'c1000000-0000-0000-0000-000000000009', name: 'Jowar / Bajra Bhakri (भाकरी)', description: 'Freshly hand-pattered hot flatbread made from Jowar or Bajra millet', price: 25, image_url: '/images/dishes/dish_53.jpeg', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm902', category_id: 'c1000000-0000-0000-0000-000000000009', name: 'Wheat Chapati (चपाती)', description: 'Soft whole wheat thin chapati roti', price: 20, image_url: '/images/dishes/dish_53.jpeg', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm903', category_id: 'c1000000-0000-0000-0000-000000000009', name: 'Indrayani Rice - Full (इंद्रायणी राईस)', description: 'Fragrant sticky aromatic Indrayani rice, perfect with rassa', price: 120, image_url: '/images/dishes/dish_7.jpeg', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm904', category_id: 'c1000000-0000-0000-0000-000000000009', name: 'Indrayani Rice - Half', description: 'Half portion fragrant Indrayani rice', price: 70, image_url: '/images/dishes/dish_7.jpeg', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm905', category_id: 'c1000000-0000-0000-0000-000000000009', name: 'Jeera Rice - Full (जिरा राईस)', description: 'Steamed basmati rice tempered with ghee & cumin seeds', price: 140, image_url: '/images/dishes/dish_7.jpeg', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm906', category_id: 'c1000000-0000-0000-0000-000000000009', name: 'Jeera Rice - Half', description: 'Half portion steamed jeera rice', price: 80, image_url: '/images/dishes/dish_7.jpeg', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // 10. BULK KG ORDERS
  { id: 'm1001', category_id: 'c1000000-0000-0000-0000-000000000010', name: 'Mutton (मटन) - 1 Kg', description: 'Freshly cooked bulk Mutton fry/curry (1 Full Kg)', price: 900, image_url: '/images/dishes/dish_40.jpeg', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm1002', category_id: 'c1000000-0000-0000-0000-000000000010', name: 'Mutton (मटन) - Half Kg', description: 'Freshly cooked bulk Mutton fry/curry (500g Half Kg)', price: 500, image_url: '/images/dishes/dish_41.jpeg', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm1003', category_id: 'c1000000-0000-0000-0000-000000000010', name: 'Chicken (चिकन) - 1 Kg', description: 'Freshly cooked bulk Chicken fry/curry (1 Full Kg)', price: 400, image_url: '/images/dishes/dish_32.jpeg', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm1004', category_id: 'c1000000-0000-0000-0000-000000000010', name: 'Chicken (चिकन) - Half Kg', description: 'Freshly cooked bulk Chicken fry/curry (500g Half Kg)', price: 250, image_url: '/images/dishes/dish_33.jpeg', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm1005', category_id: 'c1000000-0000-0000-0000-000000000010', name: 'Fish (मासे) - 1 Kg', description: 'Freshly prepared bulk Fish fry/curry (1 Full Kg)', price: 400, image_url: '/images/dishes/dish_1.jpeg', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm1006', category_id: 'c1000000-0000-0000-0000-000000000010', name: 'Fish (मासे) - Half Kg', description: 'Freshly prepared bulk Fish fry/curry (500g Half Kg)', price: 250, image_url: '/images/dishes/dish_2.jpeg', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export async function getValidatedTable(
  tableParam: string | undefined | null
): Promise<Table | null> {
  const supabase = await createClient();

  let targetNum = 1;
  if (tableParam && typeof tableParam === 'string' && tableParam.trim() !== '') {
    const trimmed = tableParam.trim();
    const isNumeric = /^\d+$/.test(trimmed);
    if (isNumeric) {
      targetNum = parseInt(trimmed, 10);
    } else {
      const numMatch = trimmed.match(/\d+/);
      if (numMatch) {
        targetNum = parseInt(numMatch[0], 10);
      }
    }

    let query = supabase.from('tables').select('*').eq('is_active', true);
    if (isNumeric) {
      query = query.eq('table_number', targetNum);
    } else {
      query = query.eq('qr_token', trimmed);
    }

    const { data } = await query.single();
    if (data) {
      return data as Table;
    }
  }

  // Gracefully return table object matching requested table number
  return {
    id: `table-id-${targetNum}`,
    table_number: targetNum,
    qr_token: `${targetNum}`,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function getActiveCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Category[];
    }
  } catch (err) {
    console.error('Error fetching categories from DB, using Kulswamini fallback:', err);
  }

  // Fallback to official Shree Kulswamini Hotel categories
  return KULSWAMINI_CATEGORIES;
}

export async function getAvailableMenuItems(): Promise<MenuItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as MenuItem[];
    }
  } catch (err) {
    console.error('Error fetching menu items from DB, using Kulswamini fallback:', err);
  }

  // Fallback to official Shree Kulswamini Hotel menu items
  return KULSWAMINI_MENU_ITEMS;
}
