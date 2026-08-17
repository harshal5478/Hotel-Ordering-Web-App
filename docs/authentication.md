# Authentication & Session Guide

## Authentication Overview
The application handles two distinct user personas:

1. **Customers**:
   - **No Login Required**: Customers place orders anonymously without registration.
   - Access to dining menus is validated via the table QR token (`?table=<token>`).

2. **Hotel Staff & Administrators**:
   - **Password Authentication**: Managed via Supabase Auth + `@supabase/ssr`.
   - Accessible at `/admin/login`.
   - Protected routes (`/admin/*`, `/kitchen`) are guarded by Next.js Root Middleware (`src/middleware.ts`).

---

## Session Persistence & Cookie Safety
- Staff sessions use **PKCE Flow** (Proof Key for Code Exchange).
- Cookies are stored as `HTTP-Only`, `SameSite=Lax`, and `Secure` in production.
- Middleware intercepts requests to `/admin` and `/kitchen`. If no valid staff session exists, users are redirected to `/admin/login`.

---

## How to Create Staff Admin Accounts
To create staff credentials for production:
1. Open the [Supabase Dashboard](https://app.supabase.com) -> **Authentication** -> **Users**.
2. Click **Create User** and enter email & password.
3. The staff member can now log in at `/admin/login`.
