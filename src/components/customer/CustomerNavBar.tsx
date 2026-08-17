'use client';

import React from 'react';
import Link from 'next/link';
import { Utensils, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

interface CustomerNavBarProps {
  tableNumber?: number;
}

export function CustomerNavBar({ tableNumber = 1 }: CustomerNavBarProps) {
  const { totalItemsCount, subtotalAmount } = useCart();

  return (
    <header className="h-16 border-b border-stone-200 dark:border-stone-800 bg-stone-900 text-white px-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
      <Link href={`/menu?table=${tableNumber}`} className="flex items-center space-x-2.5">
        <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Utensils className="h-5 w-5 stroke-[2]" />
        </div>
        <div>
          <h2 className="font-black text-sm tracking-wide text-white">
            श्री कुलस्वामिनी
          </h2>
          <p className="text-[10px] font-bold text-amber-400">Fish Special Hotel</p>
        </div>
      </Link>

      <div className="flex items-center space-x-3">
        <span className="text-xs font-black bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full">
          Table {tableNumber}
        </span>

        {totalItemsCount > 0 && (
          <Link
            href={`/cart?table=${tableNumber}`}
            aria-label="View Cart"
            className="flex items-center space-x-1.5 bg-amber-500 text-stone-950 px-3 py-1.5 rounded-xl font-extrabold text-xs shadow-md hover:bg-amber-400 transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{formatCurrency(subtotalAmount)}</span>
          </Link>
        )}
      </div>
    </header>
  );
}
