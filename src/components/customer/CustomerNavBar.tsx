'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Utensils, ShoppingBag, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

function CustomerNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tableParam = searchParams.get('table') || '1';

  const navItems = [
    {
      name: 'Menu',
      href: `/menu?table=${tableParam}`,
      active: pathname.startsWith('/menu'),
      icon: Utensils,
    },
    {
      name: 'Cart',
      href: `/cart?table=${tableParam}`,
      active: pathname.startsWith('/cart'),
      icon: ShoppingBag,
      badge: 0,
    },
    {
      name: 'Status',
      href: `/order/demo-order-123?table=${tableParam}`,
      active: pathname.startsWith('/order'),
      icon: Clock,
    },
  ];

  return (
    <>
      <div className="fixed top-3 right-4 z-50 flex items-center space-x-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800/80 rounded-full shadow-sm">
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
          Table {tableParam}
        </span>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center py-1 px-4 rounded-xl text-xs font-medium transition-all relative',
                  item.active
                    ? 'text-amber-600 dark:text-amber-400 font-bold'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                )}
              >
                <div className="relative">
                  <Icon className={cn('h-5 w-5 mb-0.5', item.active && 'scale-110')} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-amber-500 text-stone-950 font-extrabold text-[10px] h-4 w-4 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export function CustomerNavBar() {
  return (
    <Suspense
      fallback={
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 max-w-md mx-auto px-4 py-3 text-center text-xs text-stone-400">
          Loading navigation...
        </div>
      }
    >
      <CustomerNavContent />
    </Suspense>
  );
}
