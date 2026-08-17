# System Architecture Guide

## Overview
The **Hotel QR Food Ordering System** is designed specifically for a **Single-Hotel / Single-Restaurant Architecture**. It avoids multi-tenant or SaaS complexity in favor of high reliability, fast performance, zero registration friction for customers, and zero-trust security.

---

## High-Level Architecture Diagram

```
[ Customer Mobile Phone ]  ----> (Scans Table QR Code)
           |
           v
  Next.js App Router (Public Route)
  /menu?table=<token>  --------> Server Validates Table Active Status
           |
           v
[ Shopping Cart & Checkout ] ---> Server Action: createOrderAction()
                                       |
                                       v
                                PostgreSQL RPC: create_customer_order()
                                (Server Recalculates Prices & Totals)
                                       |
                                       +----> Inserts into orders & order_items
                                       |
                                       v
                              Supabase Realtime Channel
                                       |
                     +-----------------+-----------------+
                     |                                   |
                     v                                   v
          [ Kitchen Display System ]          [ Customer Order Tracking ]
                 /kitchen                           /order/[id]
```

---

## Key Design Principles

1. **Zero Customer Registration**:
   - Customers do not create accounts or enter passwords.
   - Ordering is tied directly to the dining table token passed in the QR code.

2. **Zero-Trust Server Price Verification**:
   - Clients send item IDs and quantities, but client prices and totals are completely ignored.
   - Prices are retrieved directly from the `menu_items` PostgreSQL table at the time of order creation.

3. **Historical Data Protection (Soft Deletion)**:
   - When menu items or categories are deleted by staff, the server verifies if historical `order_items` exist.
   - If historical records exist, items are marked as `is_available = false` (soft-deactivated) rather than deleted, preserving financial reports.

4. **Real-Time Event Driven**:
   - Orders placed at tables automatically broadcast via Supabase Realtime to `/kitchen` and update `/order/[id]`.
