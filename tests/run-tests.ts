/**
 * Business-Critical Automated Test Suite
 * Hotel QR Ordering System
 */

import {
  CreateOrderSchema,
  CategorySchema,
  MenuItemSchema,
  TableSchema,
} from '../src/lib/validations';
import { formatCurrency, getOrderStatusBadgeClass, cn } from '../src/lib/utils';
import { getSiteUrl } from '../src/lib/env';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASSED: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAILED: ${testName}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('\n==================================================');
  console.log(' RUNNING BUSINESS-CRITICAL TEST SUITE');
  console.log('==================================================\n');

  // 1. Zod Validation Tests - CreateOrderSchema
  console.log('[1] Customer Order Payload Validations');
  const validOrderPayload = {
    table_id: '123e4567-e89b-12d3-a456-426614174000',
    customer_name: 'Mr. Sharma',
    customer_phone: '9876543210',
    order_note: 'Less spicy please',
    items: [
      {
        menu_item_id: '123e4567-e89b-12d3-a456-426614174001',
        quantity: 2,
        item_note: 'Extra cheese',
      },
    ],
  };
  const validResult = CreateOrderSchema.safeParse(validOrderPayload);
  assert(validResult.success === true, 'Accepts valid order payload');

  const zeroQuantityPayload = {
    ...validOrderPayload,
    items: [{ menu_item_id: '123e4567-e89b-12d3-a456-426614174001', quantity: 0 }],
  };
  const zeroQtyResult = CreateOrderSchema.safeParse(zeroQuantityPayload);
  assert(
    zeroQtyResult.success === false,
    'Rejects order with item quantity = 0'
  );

  const emptyItemsPayload = {
    ...validOrderPayload,
    items: [],
  };
  const emptyItemsResult = CreateOrderSchema.safeParse(emptyItemsPayload);
  assert(emptyItemsResult.success === false, 'Rejects order with empty cart items array');

  const invalidUuidPayload = {
    ...validOrderPayload,
    table_id: 'not-a-valid-uuid',
  };
  const invalidUuidResult = CreateOrderSchema.safeParse(invalidUuidPayload);
  assert(invalidUuidResult.success === false, 'Rejects invalid table UUID format');

  // 2. Menu Item & Price Validations
  console.log('\n[2] Menu Item & Price Validations');
  const validMenuItem = {
    name: 'Paneer Tikka Angara',
    description: 'Smoked cottage cheese in tandoor',
    price: 420.0,
    category_id: '123e4567-e89b-12d3-a456-426614174002',
    is_available: true,
    sort_order: 1,
  };
  const menuItemResult = MenuItemSchema.safeParse(validMenuItem);
  assert(menuItemResult.success === true, 'Accepts valid menu dish payload');

  const negativePriceItem = {
    ...validMenuItem,
    price: -50,
  };
  const negativePriceResult = MenuItemSchema.safeParse(negativePriceItem);
  assert(negativePriceResult.success === false, 'Rejects negative prices (price < 0)');

  // 3. Category Validations
  console.log('\n[3] Category Validations');
  const validCategory = {
    name: 'Starters & Appetizers',
    description: 'Hot appetizers',
    sort_order: 1,
    is_active: true,
  };
  assert(CategorySchema.safeParse(validCategory).success === true, 'Accepts valid category payload');
  assert(
    CategorySchema.safeParse({ ...validCategory, name: '' }).success === false,
    'Rejects category with empty name'
  );

  // 4. Table Validations
  console.log('\n[4] Dining Table Validations');
  const validTable = {
    table_number: 12,
    qr_token: 'qr-tbl-12-tok-abc123',
    is_active: true,
  };
  assert(TableSchema.safeParse(validTable).success === true, 'Accepts valid table payload');
  assert(
    TableSchema.safeParse({ ...validTable, table_number: 0 }).success === false,
    'Rejects table_number <= 0'
  );

  // 5. Utility & Currency Formatting Tests
  console.log('\n[5] Currency & Badge Styling Utilities');
  const formattedPrice = formatCurrency(780);
  assert(formattedPrice.includes('780'), 'Formats 780 correctly in currency');
  assert(formattedPrice.includes('₹'), 'Includes Rupee symbol (₹)');

  const pendingBadge = getOrderStatusBadgeClass('PENDING');
  assert(pendingBadge.includes('amber'), 'PENDING status badge includes amber styling');

  const readyBadge = getOrderStatusBadgeClass('READY');
  assert(readyBadge.includes('emerald'), 'READY status badge includes emerald styling');

  const mergedClass = cn('px-2 py-1', 'bg-amber-500');
  assert(mergedClass.includes('bg-amber-500'), 'cn() utility merges Tailwind classes properly');

  // 6. Site URL Configuration
  console.log('\n[6] Environment & Site URL Config');
  const siteUrl = getSiteUrl();
  assert(typeof siteUrl === 'string' && siteUrl.startsWith('http'), 'getSiteUrl returns valid HTTP/HTTPS URL');
  assert(!siteUrl.endsWith('/'), 'getSiteUrl strips trailing slashes correctly');

  console.log('\n==================================================');
  console.log(` TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
