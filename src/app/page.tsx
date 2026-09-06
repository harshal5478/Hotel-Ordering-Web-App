'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Utensils, QrCode, ArrowRight, ShieldCheck, Clock, Flame, Sparkles, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950">
      {/* Top Header Navigation */}
      <header className="p-4 sm:p-6 border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="h-full w-full bg-stone-950 rounded-[10px] flex items-center justify-center text-amber-400">
                <Utensils className="h-5 w-5 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  Fish Special &bull; Veg & Non-Veg
                </span>
              </div>
              <h1 className="font-black text-base sm:text-lg tracking-tight text-white font-sans">
                श्री कुलस्वामिनी हॉटेल
              </h1>
            </div>
          </div>


        </div>
      </header>

      {/* Main Hero Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-14 text-center max-w-2xl mx-auto relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Sacred Mantras from Hotel Poster */}
        <div className="flex items-center justify-center space-x-3 text-amber-400/90 font-serif text-xs sm:text-sm font-semibold mb-4 tracking-wider">
          <span>॥ श्री गणेश प्रसन्न ॥</span>
          <span>&bull;</span>
          <span>॥ श्री स्वामी समर्थ ॥</span>
        </div>

        {/* Contactless QR Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-stone-900 border border-amber-500/40 text-amber-400 text-xs font-extrabold shadow-lg mb-6">
          <span className="uppercase tracking-wider">श्री म्हंकाळेश्वरं प्रसन्न</span>
        </div>

        {/* Hotel Title Heading */}
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2 leading-tight font-sans">
          श्री कुलस्वामिनी हॉटेल
        </h2>

        {/* Slogan */}
        <p className="text-amber-400 font-extrabold text-lg sm:text-2xl italic tracking-wide mb-4">
          &quot;स्वाद् जो लक्षात राहील...&quot;
        </p>

        <p className="text-stone-400 text-xs sm:text-sm max-w-md mb-8 leading-relaxed">
          Fresh Malvani Fish Fry, Chilapi Thali, Chicken & Mutton Sukka, Dum Biryani, Solkadhi & Hot Bhakri. Order directly from your table.
        </p>

        {/* Portal Action Buttons */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/admin/login"
            className="flex flex-col items-center justify-center space-y-2 p-6 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 hover:bg-stone-800/80 transition-all shadow-xl group"
          >
            <div className="h-12 w-12 rounded-full bg-stone-950 flex items-center justify-center border border-stone-800 group-hover:border-amber-500/50 transition-colors">
              <ShieldCheck className="h-6 w-6 text-stone-400 group-hover:text-amber-500 transition-colors" />
            </div>
            <span className="text-lg font-black text-stone-100 group-hover:text-white mt-2">Staff Portal</span>
            <span className="text-xs text-stone-400 text-center">Manage tables, orders, and QR codes</span>
          </Link>

          <Link
            href="/kitchen"
            className="flex flex-col items-center justify-center space-y-2 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/60 transition-all shadow-xl group"
          >
            <div className="h-12 w-12 rounded-full bg-stone-950/50 flex items-center justify-center border border-amber-500/30 group-hover:border-amber-500/60 transition-colors">
              <Flame className="h-6 w-6 text-amber-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <span className="text-lg font-black text-amber-500 group-hover:text-amber-400 mt-2">Kitchen KDS</span>
            <span className="text-xs text-amber-500/60 text-center">View and manage active orders</span>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left w-full">
          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Flame className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-stone-100">Fish & Thali Specials</h4>
              <p className="text-[11px] text-stone-400 leading-relaxed mt-0.5">
                Chilapi Fish Fry, Bombil Rava Fry, Mutton Sukka & Chicken Thalis.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-stone-100">100% Contactless</h4>
              <p className="text-[11px] text-stone-400 leading-relaxed mt-0.5">
                Instant digital menu ordering with live tracking on your phone.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-stone-100">Fast Kitchen Prep</h4>
              <p className="text-[11px] text-stone-400 leading-relaxed mt-0.5">
                Freshly prepared meals delivered in 10 to 15 minutes.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Banner Mantra */}
      <footer className="py-6 text-center text-xs text-stone-400 border-t border-stone-900 bg-stone-950 space-y-1">
        <p className="font-serif font-bold text-amber-400/90 tracking-wider">
          ॥ अत्र हे पूर्ण ब्रह्म : !! अतिथी देवो भव !! ॥
        </p>
        <p className="text-[11px] text-stone-500">
          श्री कुलस्वामिनी व्हेज-नॉनव्हेज हॉटेल &copy; 2026. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
