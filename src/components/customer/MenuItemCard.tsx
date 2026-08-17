'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Utensils } from 'lucide-react';
import { MenuItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { QuantitySelector } from './QuantitySelector';
import { Card } from '@/components/ui/card';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { getItemQuantity, addToCart, updateQuantity } = useCart();
  const quantity = getItemQuantity(item.id);
  const isAvailable = item.is_available;

  // Determine Veg vs Non-Veg badge based on dish/category keywords
  const isVeg =
    item.name.toLowerCase().includes('veg') ||
    item.name.toLowerCase().includes('paneer') ||
    item.name.toLowerCase().includes('kaju') ||
    item.name.toLowerCase().includes('dal') ||
    item.name.toLowerCase().includes('gobi') ||
    item.name.toLowerCase().includes('papad') ||
    item.name.toLowerCase().includes('roti') ||
    item.name.toLowerCase().includes('chapati') ||
    item.name.toLowerCase().includes('bhakri') ||
    item.name.toLowerCase().includes('finger chips');

  return (
    <Card
      className={`overflow-hidden border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 transition-all shadow-xs flex flex-col justify-between ${
        !isAvailable ? 'opacity-65 grayscale-[30%]' : 'hover:border-amber-500/40'
      }`}
    >
      <div className="p-4 space-y-3">
        {/* Header Photo & Veg/Non-Veg Badge */}
        <div className="relative h-44 w-full rounded-xl bg-stone-100 dark:bg-stone-800 overflow-hidden border border-stone-200/60 dark:border-stone-800">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-stone-400">
              <Utensils className="h-8 w-8 stroke-[1.5]" />
            </div>
          )}

          {/* Veg / Non-Veg Indicator Icon */}
          <div className="absolute top-2.5 left-2.5 bg-white/90 dark:bg-stone-950/90 backdrop-blur-xs p-1 rounded-md border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-center">
            {isVeg ? (
              <span
                className="h-3.5 w-3.5 rounded-sm border-2 border-emerald-600 flex items-center justify-center"
                title="Pure Veg"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              </span>
            ) : (
              <span
                className="h-3.5 w-3.5 rounded-sm border-2 border-rose-600 flex items-center justify-center"
                title="Non-Veg Special"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
              </span>
            )}
          </div>

          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-rose-600 text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Title, Description & Price */}
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 leading-snug">
              {item.name}
            </h3>
          </div>

          {item.description && (
            <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="pt-1 flex items-baseline justify-between">
            <span className="text-lg font-black text-amber-600 dark:text-amber-400">
              {formatCurrency(item.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-0">
        {!isAvailable ? (
          <button
            disabled
            className="w-full h-11 rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 font-bold text-xs cursor-not-allowed"
          >
            Currently Unavailable
          </button>
        ) : quantity > 0 ? (
          <div className="flex items-center justify-between bg-amber-500/10 p-1 rounded-xl border border-amber-500/30">
            <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 pl-2">
              In Cart
            </span>
            <QuantitySelector
              quantity={quantity}
              onIncrement={() => updateQuantity(item.id, quantity + 1)}
              onDecrement={() => updateQuantity(item.id, quantity - 1)}
              size="sm"
            />
          </div>
        ) : (
          <button
            onClick={() => addToCart(item)}
            className="w-full h-11 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md active:scale-98 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label={`Add ${item.name} to order for ${formatCurrency(item.price)}`}
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>ADD TO ORDER</span>
          </button>
        )}
      </div>
    </Card>
  );
}
