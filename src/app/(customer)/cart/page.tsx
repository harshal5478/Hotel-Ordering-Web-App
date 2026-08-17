import React, { Suspense } from 'react';
import { getValidatedTable } from '@/actions/customer';
import { CartClient } from '@/components/customer/CartClient';
import { InvalidTableState } from '@/components/customer/InvalidTableState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const revalidate = 0;

interface CartPageProps {
  searchParams: Promise<{ table?: string }>;
}

async function CartContent({ searchParams }: CartPageProps) {
  const resolvedParams = await searchParams;
  const tableParam = resolvedParams.table || '1'; // Default table 1 if browsing cart

  const validatedTable = await getValidatedTable(tableParam);

  if (!validatedTable) {
    return <InvalidTableState tableParam={tableParam} />;
  }

  return <CartClient tableNumber={validatedTable.table_number} />;
}

export default function CartPage(props: CartPageProps) {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading your cart..." />}>
      <CartContent {...props} />
    </Suspense>
  );
}
