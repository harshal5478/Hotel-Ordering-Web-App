import React from 'react';
import Link from 'next/link';
import { Utensils, QrCode, ArrowRight, ShieldCheck, Clock, Flame, Sparkles } from 'lucide-react';
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

          <div className="flex space-x-2">
            <Link
              href="/admin/login"
              className="text-xs font-bold px-3.5 py-2 rounded-xl border border-stone-800 bg-stone-900/90 hover:bg-stone-800 hover:border-amber-500/40 text-stone-200 transition-all shadow-sm"
            >
              Staff Portal
            </Link>
            <Link
              href="/kitchen"
              className="text-xs font-bold px-3.5 py-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-all shadow-sm flex items-center space-x-1"
            >
              <Flame className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Kitchen KDS</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center max-w-3xl mx-auto relative overflow-hidden">
        {/* Subtle Background Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Sacred Mantras from Hotel Poster */}
        <div className="flex items-center justify-center space-x-3 text-amber-400/90 font-serif text-xs sm:text-sm font-semibold mb-4 tracking-wider">
          <span>॥ श्री गणेश प्रसन्न ॥</span>
          <span>&bull;</span>
          <span>॥ श्री स्वामी समर्थ ॥</span>
        </div>

        {/* Contactless QR Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-stone-900 border border-amber-500/40 text-amber-400 text-xs font-extrabold shadow-lg mb-6">
          <QrCode className="h-4 w-4 stroke-[2.5]" />
          <span className="uppercase tracking-wider">Contactless QR Food Ordering</span>
        </div>

        {/* Hotel Title Banner Heading */}
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3 leading-tight font-sans">
          श्री कुलस्वामिनी हॉटेल
        </h2>

        {/* Slogan */}
        <p className="text-amber-400 font-extrabold text-lg sm:text-2xl italic tracking-wide mb-3">
          &quot;स्वाद् जो लक्षात राहील...&quot;
        </p>

        <p className="text-stone-400 text-xs sm:text-sm max-w-md mb-8 leading-relaxed">
          Explore our authentic Maharashtrian Fish Specials, Dum Biryani, Crispy Bombil Fry, Chicken & Mutton Thalis with Solkadhi. Scan the QR code on your dining table to order.
        </p>

        {/* Dining Table Quick Access Card */}
        <Card className="w-full bg-stone-900/90 border-amber-500/30 p-2 text-left mb-10 shadow-2xl backdrop-blur-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  Select Dining Table to Order
                </span>
              </div>
              <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Live QR Entry
              </span>
            </div>

            <p className="text-xs text-stone-400">
              Click your dining table number below to open your digital menu:
            </p>

            {/* Grid of Tables */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {[1, 2, 3, 4, 5, 6].map((tableNum) => (
                <Link
                  key={tableNum}
                  href={`/menu?table=${tableNum}`}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-stone-800 bg-stone-950/80 hover:bg-amber-500 hover:text-stone-950 hover:border-amber-400 text-stone-200 transition-all text-xs font-extrabold group shadow-sm active:scale-98"
                >
                  <div className="flex items-center space-x-2">
                    <Utensils className="h-4 w-4 text-amber-400 group-hover:text-stone-950 transition-colors" />
                    <span>Table {tableNum}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-stone-500 group-hover:text-stone-950 transition-colors" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

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
