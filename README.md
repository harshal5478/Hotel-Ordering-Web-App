# Hotel QR Food Ordering System

A production-ready, mobile-first single-hotel QR-based food ordering web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL, Storage, Auth, Realtime)**.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Features](#2-features)
3. [Architecture](#3-architecture)
4. [Tech Stack](#4-tech-stack)
5. [Folder Structure](#5-folder-structure)
6. [Local Development Setup](#6-local-development-setup)
7. [Supabase Setup](#7-supabase-setup)
8. [Database Setup](#8-database-setup)
9. [Environment Variables](#9-environment-variables)
10. [Authentication Setup](#10-authentication-setup)
11. [Storage Setup](#11-storage-setup)
12. [Realtime Setup](#12-realtime-setup)
13. [QR Code Generation & Printing](#13-qr-code-generation--printing)
14. [Running Locally](#14-running-locally)
15. [Testing](#15-testing)
16. [Production Build](#16-production-build)
17. [Vercel Deployment](#17-vercel-deployment)
18. [Troubleshooting](#18-troubleshooting)

---

## 1. Project Overview
The **Hotel QR Food Ordering System** allows hotel guests to scan a QR code placed on their dining table or room. The QR opens a mobile-optimized digital menu where customers can select food items, customize quantities and notes, and place orders without requiring customer account registration.

Hotel staff manage menu categories, dishes, prices, storage image uploads, dining tables, and live order status from a staff dashboard (`/admin`) and a realtime kitchen display screen (`/kitchen`).

---

## 2. Features

### Customer Experience (`(customer)`)
- **QR Table Entry**: Automatically validates table active status via `/menu?table=<token>`.
- **Dynamic Category Navigation**: Filter food items by categories (Starters, Main Course, Drinks, Desserts).
- **Search & Dish Info**: Filter dishes with real-time text search and view dish descriptions, prices, and photos.
- **Cart Management**: Add/remove items, adjust quantities, add per-item notes (e.g., "Extra spicy") and overall kitchen notes.
- **Zero-Registration Checkout**: Customers place orders seamlessly without creating accounts.
- **Realtime Order Tracking (`/order/[id]`)**: Live status updates (`PENDING` → `ACCEPTED` → `PREPARING` → `READY` → `SERVED`) via Supabase Realtime without refreshing.

### Hotel Staff & Admin (`admin`)
- **Secure Authentication**: Password-protected staff login (`/admin/login`) with PKCE session persistence.
- **Analytics Overview (`/admin`)**: Real-time sales revenue, average order value (AOV), active kitchen queue, daily revenue trend chart, and top-selling dishes.
- **Category Management (`/admin/categories`)**: Create, edit, reorder, and activate/deactivate food categories.
- **Menu Management (`/admin/menu`)**: Create, edit, reorder, change prices, toggle availability, upload dish photos to Supabase Storage, and soft-deactivate dishes to preserve historical order records.
- **Table & QR Management (`/admin/tables`)**: Manage dining tables, generate stable unique QR tokens, preview table tent cards, download PNG graphics, and print QR cards.
- **Order Management (`/admin/orders`)**: Server-side paginated list with multi-filter search (ID, guest name, phone), status filtering, and itemized snapshot inspection.

### Kitchen Display System (`/kitchen`)
- **Dark-Mode High-Contrast KDS**: Optimized for tablets, desktops, and wall monitors.
- **Realtime Instant Sync**: Listens to database inserts to display new orders instantly.
- **Web Audio Chime Alert**: Plays a dual-tone chime when a new pending order arrives.
- **Tablet Touch Controls**: Min 48px touch buttons for single-tap status transitions (`ACCEPT` → `PREPARING` → `READY` → `SERVED`).

---

## 3. Architecture
The application follows a **Server-Centric Zero-Trust Architecture**:
- Next.js Server Components and Server Actions handle database operations securely.
- Client prices and totals submitted by browsers are completely ignored; the server re-queries current database prices and calculates total amounts inside an atomic PostgreSQL RPC (`create_customer_order`).
- Supabase Row Level Security (RLS) policies enforce database-level access control.

For details, read [docs/architecture.md](docs/architecture.md).

---

## 4. Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Supabase (PostgreSQL, Auth, Realtime)
- **File Storage**: Supabase Storage (`menu-images` bucket)
- **Forms & Validation**: React Hook Form, Zod
- **QR Codes**: `qrcode.react`
- **Notifications**: Sonner

---

## 5. Folder Structure
```
d:/kulswamiini/
├── src/
│   ├── actions/          # Server Actions (auth, order, menu, table, kitchen, admin)
│   ├── app/
│   │   ├── (customer)/   # Customer routes (/menu, /cart, /order/[id])
│   │   ├── admin/        # Staff dashboard routes (/admin, /admin/menu, etc.)
│   │   ├── kitchen/      # Kitchen Display System (/kitchen)
│   │   └── api/          # API route handlers
│   ├── components/
│   │   ├── admin/        # Dashboard, sidebar, modals, tables, charts
│   │   ├── customer/     # Menu cards, cart controls, order tracking
│   │   ├── kitchen/      # Kitchen Display System UI
│   │   ├── ui/           # Reusable base UI primitives (Button, Card, Input)
│   │   └── shared/       # Empty state, loading spinner, status badges
│   ├── context/          # Client state contexts (CartContext)
│   ├── lib/              # Supabase clients, env helpers, utils, audio chime
│   ├── types/            # TypeScript interfaces (Order, MenuItem, Category, Table)
│   └── middleware.ts     # Auth middleware guarding /admin/* and /kitchen
├── supabase/
│   ├── schema.sql        # Master database DDL schema script
│   └── migrations/       # Incremental SQL migration scripts
├── docs/                 # Detailed developer documentation guides
├── tests/                # Automated business-critical test suite
└── public/               # Static web assets
```

---

## 6. Local Development Setup
1. **Prerequisites**:
   - Node.js 20+ installed.
   - Git installed.
   - Supabase project created.

2. **Clone Repository**:
   ```bash
   git clone https://github.com/your-org/hotel-qr-ordering.git
   cd hotel-qr-ordering
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

---

## 7. Supabase Setup
Create a free project at [supabase.com](https://supabase.com). Copy your **Project URL** and **Anon Key** from `Project Settings -> API`.

---

## 8. Database Setup
1. Open your Supabase SQL Editor.
2. Run [`supabase/schema.sql`](supabase/schema.sql) or execute the migrations in [`supabase/migrations/`](supabase/migrations/) in order.
3. For full schema details, read [docs/database.md](docs/database.md).

---

## 9. Environment Variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ubdclczdxfonwrprpzyg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_pSEuJN2GcM8WZzsGWQoOEA_vaCMz6qV
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-server-only
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 10. Authentication Setup
Staff users log in at `/admin/login`. Auth is managed via Supabase Auth + `@supabase/ssr` cookies. For setup details, read [docs/authentication.md](docs/authentication.md).

---

## 11. Storage Setup
Food images are stored in the Supabase Storage bucket `menu-images` (5MB limit, public read access). Read [docs/database.md](docs/database.md) for RLS storage rules.

---

## 12. Realtime Setup
Realtime sync is enabled on `public.orders` for `/kitchen` order arrival alerts and `/order/[id]` customer status tracking. Read [docs/realtime.md](docs/realtime.md).

---

## 13. QR Code Generation & Printing
Generate and print table tent cards at `/admin/tables`. Printable cards include hotel branding, table numbers, and high-res SVG/PNG QR graphics.

---

## 14. Running Locally
Run the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 15. Testing
Run the business-critical automated test suite:
```bash
npm test
```

---

## 16. Production Build
Verify the production build locally:
```bash
npm run build
npm run start
```

---

## 17. Vercel Deployment
Deploy to Vercel by pushing your repository and adding environment variables in Vercel project settings. Read [docs/deployment.md](docs/deployment.md).

---

## 18. Troubleshooting

### Issue: "Invalid dining table configuration"
- **Cause**: The QR URL parameter `?table=` is missing or matches an inactive table in the database.
- **Solution**: Go to `/admin/tables`, activate the table, and use the generated QR token.

### Issue: "Supabase Realtime not updating"
- **Cause**: Realtime replication is disabled on `orders` in Supabase.
- **Solution**: Go to Supabase -> Database -> Replication and enable `orders`.

For security guidelines, read [docs/security.md](docs/security.md). For test strategies, read [docs/testing.md](docs/testing.md).
