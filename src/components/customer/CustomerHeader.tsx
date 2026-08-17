'use client';

import React from 'react';
import { UtensilsCrossed, Clock, Info, Search } from 'lucide-react';
import { Table } from '@/types';

interface CustomerHeaderProps {
  tableNumber?: number;
  table?: Table;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function CustomerHeader({
  tableNumber,
  table,
  searchQuery,
  onSearchChange,
}: CustomerHeaderProps) {
  const activeTableNum = tableNumber ?? table?.table_number ?? 1;

  return (
    <div className="bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-stone-100 p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-4 relative overflow-hidden">
      {/* Gold Ambient Glow Accent */}
      <div className="absolute -top-12 -right-12 h-36 w-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 h-36 w-36 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Row */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/30" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
              Fish Special &bull; Veg & Non-Veg Hotel
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
            श्री कुलस्वामिनी हॉटेल
          </h1>
          <p className="text-xs font-bold text-amber-400 italic">
            &quot;स्वाद् जो लक्षात राहील...&quot; &bull; Taste You Will Remember
          </p>
        </div>

        {/* Table Number Pill */}
        <div className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-black text-xs shadow-md border border-amber-400 flex items-center space-x-1 shrink-0">
          <UtensilsCrossed className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>TABLE {activeTableNum}</span>
        </div>
      </div>

      {/* Dish Search Input */}
      {onSearchChange !== undefined && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search dishes (Fish, Thali, Biryani, Paneer...)"
            className="w-full h-11 pl-10 pr-4 bg-stone-900 border border-stone-800 rounded-xl text-xs font-medium text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      )}

      {/* Banner Rules & Notes Bar */}
      <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 space-y-1 text-[11px] text-stone-300">
        <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
          <Clock className="h-3.5 w-3.5" />
          <span>Order Prep Time: 10 to 15 Minutes</span>
        </div>
        <div className="flex items-center space-x-1.5 text-stone-400">
          <Info className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span>Fish, Chicken & Mutton Thalis served with hot Bhakri / Chapati & Solkadhi</span>
        </div>
      </div>
    </div>
  );
}
