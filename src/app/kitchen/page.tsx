import React, { Suspense } from 'react';
import { getKitchenOrders } from '@/actions/kitchen';
import { KitchenDisplayClient } from '@/components/kitchen/KitchenDisplayClient';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const revalidate = 0; // Live realtime kitchen view per request

export default async function KitchenPage() {
  const orders = await getKitchenOrders();

  return (
    <Suspense fallback={<LoadingSpinner label="Connecting to live kitchen feed..." />}>
      <KitchenDisplayClient initialOrders={orders} />
    </Suspense>
  );
}
