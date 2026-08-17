import React, { Suspense } from 'react';
import { getValidatedTable, getActiveCategories, getAvailableMenuItems } from '@/actions/customer';
import { CustomerMenuClient } from '@/components/customer/CustomerMenuClient';
import { InvalidTableState } from '@/components/customer/InvalidTableState';
import { MenuSkeleton } from '@/components/customer/MenuSkeleton';

export const revalidate = 0; // Fresh menu data per request

interface MenuPageProps {
  searchParams: Promise<{ table?: string }>;
}

async function MenuContent({ searchParams }: MenuPageProps) {
  const resolvedParams = await searchParams;
  const tableParam = resolvedParams.table;

  // Validate table against Supabase database
  const validatedTable = await getValidatedTable(tableParam);

  if (!validatedTable) {
    return <InvalidTableState tableParam={tableParam} />;
  }

  // Fetch categories and menu items from Supabase
  const [categories, menuItems] = await Promise.all([
    getActiveCategories(),
    getAvailableMenuItems(),
  ]);

  return (
    <CustomerMenuClient
      table={validatedTable}
      categories={categories}
      menuItems={menuItems}
    />
  );
}

export default function MenuPage(props: MenuPageProps) {
  return (
    <Suspense fallback={<MenuSkeleton />}>
      <MenuContent {...props} />
    </Suspense>
  );
}
