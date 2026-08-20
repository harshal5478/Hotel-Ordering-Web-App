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
      className={`relative overflow-hidden border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 transition-all shadow-xs ${
        !isAvailable ? 'opacity-65 grayscale-[30%]' : 'hover:border-amber-500/40'
      }`}
    >
      <div className="p-3.5 flex gap-3">
        {/* Left Side: Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center space-x-1.5 mb-1">
              {isVeg ? (
                <span className="h-3 w-3 rounded-sm border-[1.5px] border-emerald-600 flex items-center justify-center shrink-0">
                  <span className="h-1 w-1 rounded-full bg-emerald-600" />
                </span>
              ) : (
                <span className="h-3 w-3 rounded-sm border-[1.5px] border-rose-600 flex items-center justify-center shrink-0">
                  <span className="h-1 w-1 rounded-full bg-rose-600" />
                </span>
              )}
            </div>
            
            <h3 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 leading-snug truncate">
              {item.name}
            </h3>
            
            <div className="mt-0.5">
              <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                {formatCurrency(item.price)}
              </span>
            </div>

            {item.description && (
              <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed mt-1.5 pr-2">
                {item.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Image and Action */}
        <div className="flex flex-col items-center shrink-0 w-[110px]">
          <div className="relative h-[110px] w-[110px] rounded-xl bg-stone-100 dark:bg-stone-800 overflow-hidden border border-stone-200/60 dark:border-stone-800">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                loading="lazy"
                sizes="110px"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-stone-400">
                <Utensils className="h-6 w-6 stroke-[1.5]" />
              </div>
            )}
            
            {!isAvailable && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-md">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Action Button - Overlapping Image */}
          <div className="relative -mt-4 z-10 w-full px-1">
            {!isAvailable ? (
              <button
                disabled
                className="w-full h-8 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 font-bold text-[10px] cursor-not-allowed uppercase shadow-sm border border-stone-300 dark:border-stone-700"
              >
                Unavailable
              </button>
            ) : quantity > 0 ? (
              <div className="w-full h-8 bg-amber-500/10 rounded-lg border border-amber-500/30 flex items-center justify-center shadow-sm backdrop-blur-md overflow-hidden bg-white dark:bg-stone-900">
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
                className="w-full h-8 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-lg flex items-center justify-center space-x-1 shadow-md active:scale-95 transition-all uppercase tracking-wide border border-amber-400"
                aria-label={`Add ${item.name}`}
              >
                <Plus className="h-3 w-3 stroke-[3]" />
                <span>ADD</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
