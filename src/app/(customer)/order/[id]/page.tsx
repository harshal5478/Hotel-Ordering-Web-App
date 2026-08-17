import React, { Suspense } from 'react';
import { getOrderDetails } from '@/actions/order';
import { OrderConfirmationClient } from '@/components/customer/OrderConfirmationClient';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0; // Fresh live order status on every request

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

async function OrderContent({ params }: OrderPageProps) {
  const { id } = await params;

  // Retrieve actual order & order_items from Supabase database
  const order = await getOrderDetails(id);

  if (!order) {
    return (
      <div className="py-12 px-4 text-center space-y-4">
        <EmptyState
          icon={<AlertCircle className="h-10 w-10 text-rose-500" />}
          title="Order Not Found"
          description={`No active order was found matching ID "${id}".`}
          action={
            <Link
              href="/"
              className="mt-2 inline-flex items-center space-x-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
            >
              <span>Back to Home</span>
            </Link>
          }
        />
      </div>
    );
  }

  return <OrderConfirmationClient order={order} />;
}

export default function OrderPage(props: OrderPageProps) {
  return (
    <Suspense fallback={<LoadingSpinner label="Retrieving live order status..." />}>
      <OrderContent {...props} />
    </Suspense>
  );
}
