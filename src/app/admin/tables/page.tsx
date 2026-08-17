import React, { Suspense } from 'react';
import { getAllTables } from '@/actions/table';
import { TableManagementClient } from '@/components/admin/TableManagementClient';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const revalidate = 0;

export default async function AdminTablesPage() {
  const tables = await getAllTables();

  return (
    <Suspense fallback={<LoadingSpinner label="Loading tables and QR codes..." />}>
      <TableManagementClient initialTables={tables} />
    </Suspense>
  );
}
