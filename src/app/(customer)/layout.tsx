import React from 'react';
import { Utensils } from 'lucide-react';
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
        <header className="sticky top-0 z-40 bg-stone-900 text-white border-b border-stone-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Utensils className="h-4 w-4 stroke-[2]" />
            </div>
            <div>
              <h1 className="font-black text-sm text-stone-100 leading-tight">
                श्री कुलस्वामिनी हॉटेल
              </h1>
              <p className="text-[10px] font-bold text-amber-400">Fish Special &bull; Veg & Non-Veg</p>
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
