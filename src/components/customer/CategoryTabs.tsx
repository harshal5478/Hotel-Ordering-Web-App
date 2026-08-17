'use client';

import React from 'react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  totalItemsCount: number;
}

export function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
  totalItemsCount,
}: CategoryTabsProps) {
  return (
    <div className="sticky top-[57px] z-30 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-md py-2.5 -mx-4 px-4 border-b border-stone-200/80 dark:border-stone-800">
      <div className="flex space-x-2 overflow-x-auto no-scrollbar scroll-smooth">
        {/* All items tab */}
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 shrink-0',
            selectedCategoryId === null
              ? 'bg-amber-500 text-stone-950 shadow-sm scale-102'
              : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
          )}
        >
          <span>All Items</span>
          <span
            className={cn(
              'px-1.5 py-0.5 rounded-full text-[10px] font-extrabold',
              selectedCategoryId === null
                ? 'bg-stone-950/20 text-stone-950'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
            )}
          >
            {totalItemsCount}
          </span>
        </button>

        {/* Dynamic Category Tabs */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0',
                isSelected
                  ? 'bg-amber-500 text-stone-950 shadow-sm scale-102'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
