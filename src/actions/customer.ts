'use server';

import { createClient } from '@/lib/supabase/server';
import { Table, Category, MenuItem } from '@/types';

// =========================================================
// OFFICIAL SHREE KULSWAMINI HOTEL MENU & DISH IMAGES
// Matches exact prices and categories from uploaded menu card
// =========================================================

const KULSWAMINI_CATEGORIES: Category[] = [
  { id: 'c1000000-0000-0000-0000-000000000001', name: 'Thali Specials (थाळी)', description: 'Authentic Maharashtrian Non-Veg & Veg Thalis with Rassa, Bhakri, Indrayani Rice & Solkadhi', sort_order: 1, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000002', name: 'Fish Fry (मच्छी फ्राय)', description: 'Fresh Malvani style Fish Fry, Rava Fry, Masala Curry & Bombil Fry', sort_order: 2, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000003', name: 'Biryani (बिर्याणी)', description: 'Aromatic Dum Biryani served with spicy gravy & Raita', sort_order: 3, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Specials (चिकन)', description: 'Spicy Chicken Fry, Handi, Sukka, Curry & Lollipop Specials', sort_order: 4, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000005', name: 'Mutton Specials (मटन)', description: 'Malvani Mutton Handi, Mutton Fry, Mutton Sukka & Mutton Masala', sort_order: 5, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000006', name: 'Egg Specials (अंडा)', description: 'Egg Bhurji, Egg Curry, Egg Masala & Omelette', sort_order: 6, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000007', name: 'Veg Specials (व्हेज)', description: 'Paneer Masala, Kaju Curry, Shev Bhaji, Dal Tadka & Baingan Masala', sort_order: 7, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000008', name: 'Starters (स्टार्टर)', description: 'Finger Chips, Gobi 65, Gobi Manchurian, Kanda Pakoda & Papad', sort_order: 8, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000009', name: 'Bhakri, Roti & Rice (भाकरी / भात)', description: 'Hot Jowar/Bajra Bhakri, Chapati, Indrayani Rice & Jeera Rice', sort_order: 9, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'c1000000-0000-0000-0000-000000000010', name: 'Bulk Kg Sales (किलोने विक्री)', description: 'Special Bulk Orders by Weight (Per Half Kg / Full Kg)', sort_order: 10, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const KULSWAMINI_MENU_ITEMS: MenuItem[] = [
  // THALI SPECIALS
  { id: 'm100', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Kulswamini Special Fish Thali (Chilapi)', description: 'Includes: 2 Pcs Fish Masala, 2 Pcs Kadak Fry, Curry/Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati, Indrayani Rice, Solkadhi & Sukat', price: 300, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm101', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Masala Fish Thali (Chilapi)', description: 'Includes: 4 Pcs Fish Masala Curry, Spicy Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', price: 220, image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm102', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Kadak Fish Fry Thali (Chilapi)', description: 'Includes: 4 Pcs Crispy Kadak Fry, Spicy Rassa, Aalandi Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', price: 220, image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm103', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Aalandi Fish Thali (Chilapi)', description: 'Includes: 4 Pcs Mild Aalandi Fish, Rassa, Soup, 2 Bhakri / 3 Chapati & Indrayani Rice', price: 220, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm104', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Chicken Thali', description: 'Includes: Chicken Fry, Chicken Rassa, Soup, Indrayani Rice, 2 Bhakri / 2 Chapati, 1 Boiled Egg & Solkadhi', price: 230, image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm105', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Chicken Rassa Thali', description: 'Includes: Chicken Rassa, Aalandi Soup, Indrayani Rice, Bhakri/Chapati & Solkadhi', price: 170, image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm106', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Mutton Thali', description: 'Includes: Mutton Fry, Spicy Mutton Rassa, Aalandi Soup, Indrayani Rice, 1 Boiled Egg, 2 Bhakri / 3 Chapati & Solkadhi', price: 300, image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', is_available: true, sort_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm107', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Veg Thali', description: 'Includes: 2 Veg Sabzi, 3 Chapati, Jeera Rice, Roasted Papad & 1 Sweet', price: 150, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', is_available: true, sort_order: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm108', category_id: 'c1000000-0000-0000-0000-000000000001', name: 'Egg Thali', description: 'Includes: 2 Boiled Eggs, Egg Curry/Rassa, 3 Chapati, Jeera Rice & 2 Bhakri', price: 150, image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop', is_available: true, sort_order: 9, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // FISH FRY
  { id: 'm200', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Dum Fish (दम मच्छी)', description: 'Steamed & shallow fried spiced whole fish in special masala', price: 150, image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm201', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Fry Fish (फ्राय मच्छी)', description: 'Traditional Tawa fried crispy fish with red chili masala marinade', price: 150, image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm202', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Bangda Tava Fish (बांगडा तवा मच्छी)', description: 'Fresh Mackerel marinated in Kokum & Konkani spices, tava fried', price: 160, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm203', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Bangda Rava Fish (बांगडा रवा मच्छी)', description: 'Mackerel coated in semolina (Rava) for an extra crunchy texture', price: 160, image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm204', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Tomato Fish (टमाटा मच्छी)', description: 'Tangy fresh fish curry cooked in rich tomato and garlic gravy', price: 200, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm205', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Fish Masala (मच्छी मसाला)', description: 'Classic spicy Malvani fish curry cooked with freshly ground spices', price: 120, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm206', category_id: 'c1000000-0000-0000-0000-000000000002', name: 'Bombil Fry (बॉबील फ्राय)', description: 'Golden crispy rava fried Bombay Duck fish - crisp outside, tender inside', price: 180, image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop', is_available: true, sort_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // BIRYANI
  { id: 'm300', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Chicken Biryani Dum - Full', description: 'Aromatic basmati rice cooked on dum with marinated tender chicken pieces', price: 210, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm301', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Chicken Biryani Dum - Half', description: 'Half portion aromatic chicken dum biryani', price: 140, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm302', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Mutton Biryani Dum - Full', description: 'Rich & flavorful dum biryani cooked with succulent goat meat mutton pieces', price: 300, image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm303', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Mutton Biryani Dum - Half', description: 'Half portion rich mutton dum biryani', price: 180, image_url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm304', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Egg Biryani - Full', description: 'Aromatic basmati rice cooked with boiled eggs and biryani spices', price: 210, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm305', category_id: 'c1000000-0000-0000-0000-000000000003', name: 'Egg Biryani - Half', description: 'Half portion egg biryani', price: 140, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // CHICKEN
  { id: 'm400', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken 65 (5 Pcs)', description: 'Deep fried crispy chicken bites tossed in spicy curry leaf tempered gravy', price: 180, image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm401', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Fry (चिकन फ्राय)', description: 'Spicy dry fried chicken tossed with caramelized onions and Maharashtrian spices', price: 150, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm402', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Chili (6 Pcs)', description: 'Indo-Chinese style crispy fried chicken tossed in chili sauce', price: 180, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm403', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Chili (10 Pcs)', description: 'Large portion Indo-Chinese chili chicken', price: 240, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm404', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Sukka (चिकन सुकी)', description: 'Semi-dry roasted chicken dish with toasted coconut & Malvani spices', price: 120, image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm405', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Lollipop (4 Pcs)', description: 'Crispy fried chicken wings lollipop', price: 120, image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm406', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Lollipop (8 Pcs)', description: '8 Pcs crispy fried chicken lollipop', price: 210, image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop', is_available: true, sort_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm407', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Dum Murgh', description: 'Whole marinated chicken slow-cooked on dum in rich gravy', price: 600, image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', is_available: true, sort_order: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm408', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Masala', description: 'Spicy chicken gravy cooked in onion and tomato masala', price: 130, image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', is_available: true, sort_order: 9, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm409', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Handi - Full', description: 'Rich Handi chicken gravy cooked in earthen pot (Serves 3-4)', price: 700, image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', is_available: true, sort_order: 10, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm410', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Handi - Half', description: 'Half portion rich Handi chicken gravy (Serves 2)', price: 400, image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop', is_available: true, sort_order: 11, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm411', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Lollipop Masala (4 Pcs)', description: 'Chicken lollipops tossed in spicy gravy', price: 130, image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop', is_available: true, sort_order: 12, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm412', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Lollipop Masala (8 Pcs)', description: '8 Pcs chicken lollipops tossed in spicy gravy', price: 240, image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop', is_available: true, sort_order: 13, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm413', category_id: 'c1000000-0000-0000-0000-000000000004', name: 'Chicken Soup (चिकन सूप)', description: 'Hot spicy clear chicken broth soup', price: 50, image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop', is_available: true, sort_order: 14, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // MUTTON
  { id: 'm500', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Mutton Fry (मटन फ्राय)', description: 'Tender goat meat dry fried in spicy Konkani black masala', price: 270, image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm501', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Mutton Masala (मटन मसाला)', description: 'Mutton pieces simmered in spicy onion, ginger, garlic & coconut gravy', price: 270, image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm502', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Mutton Sukka (मटन सुकी)', description: 'Semi-dry roasted mutton dish cooked with toasted coconut & spices', price: 280, image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm503', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Mutton Handi Malvani - Full', description: 'Traditional Malvani style earthen pot mutton curry (Serves 3-4)', price: 900, image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm504', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Mutton Handi Malvani - Half', description: 'Half portion Malvani style mutton handi (Serves 2)', price: 500, image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm505', category_id: 'c1000000-0000-0000-0000-000000000005', name: 'Mutton Soup (मटन सूप)', description: 'Hot spicy clear mutton broth aalandi soup', price: 90, image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // EGG
  { id: 'm600', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Boiled Egg Plate (बॉईल प्लेट)', description: 'Plain hard boiled egg plate', price: 40, image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm601', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Egg Bhurji - Full (अंडा भुर्जी)', description: 'Scrambled eggs cooked with green chilies, onions & spices', price: 110, image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm602', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Egg Bhurji - Half', description: 'Half portion scrambled egg bhurji', price: 60, image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm603', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Boiled Bhurji - Full (बॉईल भुर्जी)', description: 'Scrambled boiled eggs cooked with onions & masala', price: 100, image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm604', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Boiled Bhurji - Half', description: 'Half portion boiled bhurji', price: 60, image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm605', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Egg Omelette (अंडा आमलेट)', description: 'Classic spiced double egg omelette', price: 60, image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm606', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Egg Masala (अंडा मसाला)', description: 'Boiled eggs cooked in rich spicy onion tomato gravy', price: 140, image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop', is_available: true, sort_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm607', category_id: 'c1000000-0000-0000-0000-000000000006', name: 'Egg Curry (अंडा करी)', description: 'Hard boiled eggs simmered in spicy Maharashtrian curry gravy', price: 110, image_url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop', is_available: true, sort_order: 8, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // VEG
  { id: 'm700', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Paneer Masala (पनीर मसाला)', description: 'Cottage cheese cubes cooked in rich onion tomato gravy', price: 200, image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm701', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Kaju Curry (काजू करी)', description: 'Whole cashews simmered in rich creamy butter masala gravy', price: 200, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm702', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Shev Bhaji (शेव भाजी)', description: 'Crispy spicy fried gram flour noodle gravy', price: 150, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm703', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Sheng Bhaji (शेंग भाजी)', description: 'Delicious roasted peanut and garlic spicy gravy', price: 150, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm704', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Dal Tadka (डाळ तडका)', description: 'Yellow lentils tempered with ghee, cumin seeds, garlic & red chilis', price: 150, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm705', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Dal Fry (डाळ फ्राय)', description: 'Yellow dal tempered with onions, tomatoes and garlic', price: 120, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm706', category_id: 'c1000000-0000-0000-0000-000000000007', name: 'Baingan Masala (बैंगन मसाला)', description: 'Roasted stuffed eggplant cooked in Maharashtrian peanut garlic gravy', price: 150, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', is_available: true, sort_order: 7, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // STARTER
  { id: 'm800', category_id: 'c1000000-0000-0000-0000-000000000008', name: 'Finger Chips (फिंगर चिप्स)', description: 'Crispy fried potato french fries', price: 90, image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm801', category_id: 'c1000000-0000-0000-0000-000000000008', name: 'Gobi 65 (गोबी 65)', description: 'Deep fried crispy cauliflower florets in 65 spicy marinade', price: 80, image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm802', category_id: 'c1000000-0000-0000-0000-000000000008', name: 'Gobi Manchurian (गोबी मंचुरियन)', description: 'Crispy cauliflower tossed in spicy soy garlic Manchurian sauce', price: 100, image_url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm803', category_id: 'c1000000-0000-0000-0000-000000000008', name: 'Kanda Pakoda (कांदा पकोडा)', description: 'Crispy golden fried onion fritters', price: 60, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm804', category_id: 'c1000000-0000-0000-0000-000000000008', name: 'Masala Papad (मसाला पापड)', description: 'Roasted papad topped with chopped onions, tomatoes & chaat masala', price: 50, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm805', category_id: 'c1000000-0000-0000-0000-000000000008', name: 'Roasted Papad (रोस्टेड पापड)', description: 'Plain crisp charcoal roasted lentil papad', price: 30, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // BHAKRI, ROTI & RICE
  { id: 'm900', category_id: 'c1000000-0000-0000-0000-000000000009', name: 'Wheat Chapati (चपाती)', description: 'Soft whole wheat thin chapati roti', price: 20, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm901', category_id: 'c1000000-0000-0000-0000-000000000009', name: 'Jowar / Bajra Bhakri (भाकरी)', description: 'Freshly hand-pattered hot flatbread made from Jowar or Bajra millet', price: 25, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm902', category_id: 'c1000000-0000-0000-0000-000000000009', name: 'Jeera Rice - Full (जिरा राईस)', description: 'Steamed basmati rice tempered with ghee & cumin seeds', price: 140, image_url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm903', category_id: 'c1000000-0000-0000-0000-000000000009', name: 'Jeera Rice - Half', description: 'Half portion Jeera rice', price: 80, image_url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm904', category_id: 'c1000000-0000-0000-0000-000000000009', name: 'Indrayani Rice - Full (इंद्रायणी राईस)', description: 'Fragrant sticky aromatic Indrayani rice, perfect with rassa', price: 120, image_url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm905', category_id: 'c1000000-0000-0000-0000-000000000009', name: 'Indrayani Rice - Half', description: 'Half portion Indrayani sticky rice', price: 70, image_url: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // BULK KG SALES
  { id: 'm1000', category_id: 'c1000000-0000-0000-0000-000000000010', name: 'Mutton Per Kg (मटन १ किलो)', description: 'Bulk Mutton cooked dish (1 Full Kg)', price: 500, image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', is_available: true, sort_order: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm1001', category_id: 'c1000000-0000-0000-0000-000000000010', name: 'Mutton Per Half Kg (मटन अर्धा किलो)', description: 'Bulk Mutton cooked dish (Half Kg)', price: 300, image_url: 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&auto=format&fit=crop', is_available: true, sort_order: 2, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm1002', category_id: 'c1000000-0000-0000-0000-000000000010', name: 'Chicken Per Kg (चिकन १ किलो)', description: 'Bulk Chicken cooked dish (1 Full Kg)', price: 400, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', is_available: true, sort_order: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm1003', category_id: 'c1000000-0000-0000-0000-000000000010', name: 'Chicken Per Half Kg (चिकन अर्धा किलो)', description: 'Bulk Chicken cooked dish (Half Kg)', price: 250, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop', is_available: true, sort_order: 4, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm1004', category_id: 'c1000000-0000-0000-0000-000000000010', name: 'Fish Per Kg (मासे १ किलो)', description: 'Bulk Fish cooked dish (1 Full Kg)', price: 400, image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', is_available: true, sort_order: 5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'm1005', category_id: 'c1000000-0000-0000-0000-000000000010', name: 'Fish Per Half Kg (मासे अर्धा किलो)', description: 'Bulk Fish cooked dish (Half Kg)', price: 250, image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop', is_available: true, sort_order: 6, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
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
