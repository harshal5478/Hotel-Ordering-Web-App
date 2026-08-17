import React from 'react';
import { ChefHat, Volume2 } from 'lucide-react';

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans select-none">
      {/* High-contrast Kitchen Header */}
      <header className="h-16 bg-stone-900 border-b border-stone-800 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ChefHat className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-wide">
              KITCHEN DISPLAY SYSTEM (KDS)
            </h1>
            <p className="text-xs text-amber-400 font-semibold">
              Grand Palace Main Kitchen Line
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>REALTIME SYNC ACTIVE</span>
          </div>

          <button className="p-2 rounded-lg border border-stone-800 bg-stone-800/60 hover:bg-stone-800 text-stone-300">
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Kitchen Screen */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
