'use client';

import React from 'react';
import { UtensilsCrossed, Search, X } from 'lucide-react';
import { Table } from '@/types';

interface CustomerHeaderProps {
  table: Table;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CustomerHeader({
  table,
  searchQuery,
  onSearchChange,
}: CustomerHeaderProps) {
  return (
    <div className="space-y-3 pt-1">
      {/* Top Branding Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-xs">
            <UtensilsCrossed className="h-5 w-5 stroke-[2]" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
              Grand Palace Dining
            </h1>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              In-Room & Table Menu
            </p>
          </div>
        </div>

        {/* Validated Table Badge */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-500/10 dark:bg-amber-950/80 border border-amber-500/30 rounded-full shadow-xs">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider">
            Table {table.table_number}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search food items by name or description..."
          className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-xs font-medium text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
