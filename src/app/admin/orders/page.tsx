import React, { Suspense } from 'react';
import { getAdminOrders } from '@/actions/orderManagement';
import { getAllTables } from '@/actions/table';
import { AdminOrdersClient } from '@/components/admin/AdminOrdersClient';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const revalidate = 0; // Fresh live order management per request

export default async function AdminOrdersPage() {
  const [ordersResult, tables] = await Promise.all([
    getAdminOrders({ page: 1, pageSize: 10, period: 'today' }),
    getAllTables(),
  ]);

  return (
    <Suspense fallback={<LoadingSpinner label="Loading admin order records..." />}>
      <AdminOrdersClient
        initialOrders={ordersResult.orders}
        initialTotalCount={ordersResult.totalCount}
        initialTotalPages={ordersResult.totalPages}
        tables={tables}
      />
    </Suspense>
  );
}
