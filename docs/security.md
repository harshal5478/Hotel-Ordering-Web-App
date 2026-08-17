# Application Security Guide

## Security Model Overview
The system enforces a **Zero-Trust Server Verification Policy**:

1. **Price & Total Protection**:
   - Customer-submitted prices and totals are completely ignored on the server.
   - Prices are retrieved from `menu_items` table in database and recalculated server-side.

2. **Row Level Security (RLS)**:
   - Enabled on all tables (`categories`, `menu_items`, `tables`, `orders`, `order_items`).
   - Public users can read active categories/dishes and insert orders.
   - Database mutations (`INSERT`, `UPDATE`, `DELETE` on menu/tables/orders) require `authenticated` staff user role.

3. **Storage Upload Security**:
   - `menu-images` bucket restricts file size to 5MB and limits MIME types to JPEG, PNG, WebP, AVIF.
   - File uploads are restricted to `authenticated` staff sessions.

4. **Secret Key Safety**:
   - `SUPABASE_SERVICE_ROLE_KEY` is kept exclusively on the server and never exposed in browser bundles.
