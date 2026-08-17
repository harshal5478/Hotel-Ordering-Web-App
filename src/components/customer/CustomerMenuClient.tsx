'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Category, MenuItem } from '@/types';
import { CustomerHeader } from './CustomerHeader';
import { CategoryTabs } from './CategoryTabs';
import { MenuItemCard } from './MenuItemCard';
import { CartButton } from './CartButton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useCart } from '@/context/CartContext';
import { Utensils, SearchX } from 'lucide-react';

interface CustomerMenuClientProps {
  table: Table;
  categories: Category[];
  menuItems: MenuItem[];
}

export function CustomerMenuClient({
  table,
  categories,
  menuItems,
}: CustomerMenuClientProps) {
  const { setTableInfo } = useCart();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Register validated table with CartContext
  useEffect(() => {
    setTableInfo(table.id, table.table_number);
  }, [table.id, table.table_number, setTableInfo]);

  // Filter menu items by selected category and search query
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category filter
      const matchesCategory =
        selectedCategoryId === null || item.category_id === selectedCategoryId;

      // Search filter
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategoryId, searchQuery]);

  return (
    <div className="space-y-4 pb-12">
      {/* Header with Table Info & Search */}
      <CustomerHeader
        table={table}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Category Tabs Slider */}
      <CategoryTabs
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        totalItemsCount={menuItems.length}
      />

      {/* Menu Items List */}
      <div className="space-y-3.5 pt-1">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))
        ) : searchQuery.trim() !== '' ? (
          <EmptyState
            icon={<SearchX className="h-8 w-8 text-stone-400" />}
            title="No dishes found"
            description={`No items match "${searchQuery}". Try searching for something else.`}
            action={
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline mt-1"
              >
                Clear Search Query
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={<Utensils className="h-8 w-8 text-stone-400" />}
            title="No items in this category"
            description="Items for this category will be available soon."
            action={
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline mt-1"
              >
                View All Categories
              </button>
            }
          />
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      <CartButton tableNumber={table.table_number} />
    </div>
  );
}
