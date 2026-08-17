# Testing Strategy Guide

## Overview
The application includes an automated unit and integration test suite targeting business-critical validation logic, zero-trust price rules, and utility functions.

---

## Running Tests
Execute the test suite locally:
```bash
npm test
```

## Test Coverage Summary

1. **Customer Order Validations (`CreateOrderSchema`)**:
   - Accepts valid order payloads.
   - Rejects item quantities <= 0.
   - Rejects empty cart items arrays.
   - Rejects malformed table UUIDs.

2. **Menu Item & Price Rules (`MenuItemSchema`)**:
   - Enforces `price >= 0`.
   - Rejects negative prices.

3. **Category & Table Rules (`CategorySchema`, `TableSchema`)**:
   - Rejects empty category names.
   - Rejects table numbers <= 0.

4. **Utilities & Formatting**:
   - `formatCurrency` Rupee formatting.
   - `getOrderStatusBadgeClass` styling logic.
   - `cn` class merging.
   - `getSiteUrl` domain formatting and trailing slash stripping.
