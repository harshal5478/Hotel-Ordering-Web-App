import React from 'react';
import { Sparkles } from 'lucide-react';
import { CustomerNavBar } from '@/components/customer/CustomerNavBar';
import { CartProvider } from '@/context/CartContext';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 pb-24 max-w-md mx-auto relative shadow-2xl border-x border-stone-200 dark:border-stone-800">
        {/* Top Mobile Header */}
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-stone-900 dark:text-stone-100 leading-tight">
                Grand Palace Dining
              </h1>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">In-Room & Table Service</p>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4">{children}</main>

        {/* Navigation & Table Badge */}
        <CustomerNavBar />
      </div>
    </CartProvider>
  );
}
