import { UtensilsCrossed, QrCode, ShieldCheck, ChefHat, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-stone-100">
      {/* Top Luxury Branding Header */}
      <header className="p-6 border-b border-stone-800 flex justify-between items-center max-w-5xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide text-stone-100">Grand Palace Hotel</h1>
            <p className="text-xs text-amber-400 font-medium">Fine Dining & In-Room Service</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <a
            href="/admin/login"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-300 transition-colors"
          >
            Staff Login
          </a>
          <a
            href="/kitchen"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
          >
            Kitchen Display
          </a>
        </div>
      </header>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6">
          <QrCode className="h-3.5 w-3.5" />
          <span>Contactless QR Ordering</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Welcome to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">
            Grand Palace Dining
          </span>
        </h2>

        <p className="text-stone-400 text-sm sm:text-base mb-8 max-w-md">
          Scan the QR code on your dining table to explore our digital menu, customize your order, and place items directly to the kitchen.
        </p>

        {/* Demo Table Selector Quick Links */}
        <Card className="w-full bg-stone-900/90 border-stone-800 p-2 text-left mb-8 shadow-2xl">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Customer Demo Entry
              </span>
              <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded text-stone-400">
                Phase 1 Shell
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Select a table below to test customer mobile menu experience:
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[1, 2, 3].map((tableNum) => (
                <a
                  key={tableNum}
                  href={`/menu?table=${tableNum}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-stone-800 bg-stone-800/50 hover:bg-stone-800 hover:border-amber-500/50 text-stone-200 transition-all text-xs font-medium group"
                >
                  <span>Table {tableNum}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-stone-500 group-hover:text-amber-400 transition-colors" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features list */}
        <div className="grid grid-cols-2 gap-4 text-left w-full">
          <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800/60 flex items-start space-x-3">
            <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-stone-200">100% Contactless</h4>
              <p className="text-[11px] text-stone-400">Order & track status live from your phone.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800/60 flex items-start space-x-3">
            <ChefHat className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-stone-200">Instant Kitchen Realtime</h4>
              <p className="text-[11px] text-stone-400">Direct transmission to chef line.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-stone-500 border-t border-stone-900">
        Single-Hotel QR Food Ordering System &copy; 2026. All rights reserved.
      </footer>
    </div>
  );
}
