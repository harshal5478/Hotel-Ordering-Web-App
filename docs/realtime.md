# Realtime Sync & Audio Chime Guide

## Realtime Architecture
The application uses **Supabase Realtime** (`postgres_changes` subscriptions) to sync order state instantly across client devices without requiring manual page reloads or polling loops.

---

## 1. Kitchen Display Realtime (`/kitchen`)
- **Subscription**: Subscribes to all `INSERT` and `UPDATE` events on the `public.orders` table.
- **Event Handling**:
  - `INSERT`: When a customer submits an order at a dining table, the kitchen receives an immediate payload event, refreshes the orders list, and plays a dual-tone Web Audio chime alert.
  - `UPDATE`: When order status changes, kitchen cards update instantly.

---

## 2. Customer Order Tracking (`/order/[id]`)
- **Subscription**: Subscribes to `UPDATE` events on `public.orders` filtered by `id=eq.${orderId}`.
- **Status Workflow**:
  - `PENDING` → `ACCEPTED` → `PREPARING` → `READY` → `SERVED`
  - When staff update status in `/kitchen` or `/admin/orders`, the customer order timeline updates automatically on the customer's phone screen.

---

## 3. Web Audio Chime Helper (`src/lib/audio.ts`)
Synthesizes a dual-tone C5 → G5 chime via the browser's Web Audio API. Requires user interaction (clicking *"Enable Sound"* on the kitchen screen) to unlock browser audio context.
