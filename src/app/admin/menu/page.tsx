import React, { Suspense } from 'react';
import { getAllMenuItems, getAllCategories } from '@/actions/menu';
import { MenuManagementClient } from '@/components/admin/MenuManagementClient';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const revalidate = 0;

export default async function AdminMenuPage() {
  const [menuItems, categories] = await Promise.all([
    getAllMenuItems(),
    getAllCategories(),
  ]);

  return (
    <Suspense fallback={<LoadingSpinner label="Loading menu items..." />}>
      <MenuManagementClient
        initialMenuItems={menuItems}
        categories={categories}
      />
    </Suspense>
  );
}
