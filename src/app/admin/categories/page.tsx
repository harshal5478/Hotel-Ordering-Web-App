import React, { Suspense } from 'react';
import { getAllCategories } from '@/actions/menu';
import { CategoryManagementClient } from '@/components/admin/CategoryManagementClient';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <Suspense fallback={<LoadingSpinner label="Loading categories..." />}>
      <CategoryManagementClient initialCategories={categories} />
    </Suspense>
  );
}
