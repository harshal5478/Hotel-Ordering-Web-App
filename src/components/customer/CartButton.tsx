'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';

interface CartButtonProps {
  tableNumber: number;
}

export function CartButton({ tableNumber }: CartButtonProps) {
  const { totalItemsCount, subtotalAmount } = useCart();

  if (totalItemsCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 pointer-events-none max-w-md mx-auto">
      <Link
        href={`/cart?table=${tableNumber}`}
        className="pointer-events-auto w-full h-13 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-2xl font-black text-sm px-4 flex items-center justify-between shadow-2xl active:scale-98 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
        aria-label={`View order cart with ${totalItemsCount} items totaling ${formatCurrency(subtotalAmount)}`}
      >
        <div className="flex items-center space-x-3">
          <div className="relative p-2 bg-stone-950/20 rounded-xl">
            <ShoppingBag className="h-5 w-5 stroke-[2.5]" />
            <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-stone-950 text-amber-400 text-[11px] font-black flex items-center justify-center border-2 border-amber-500">
              {totalItemsCount}
            </span>
          </div>

          <div className="text-left leading-tight">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-stone-950/80 block">
              View Order Cart
            </span>
            <span className="text-base font-black text-stone-950">
              {formatCurrency(subtotalAmount)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 font-black text-xs bg-stone-950 text-amber-400 px-3.5 py-2 rounded-xl shadow-inner">
          <span>CHECKOUT</span>
          <ArrowRight className="h-4 w-4 stroke-[3]" />
        </div>
      </Link>
    </div>
  );
}
