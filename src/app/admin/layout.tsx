import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Hotel } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      {/* Responsive Sidebar */}
      <AdminSidebar />

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3 lg:hidden pl-10">
            <Hotel className="h-5 w-5 text-amber-500" />
            <span className="font-bold text-sm">Grand Palace Admin</span>
          </div>

          <div className="hidden lg:flex items-center space-x-2 text-xs text-stone-500">
            <span className="font-medium text-stone-700 dark:text-stone-300">
              Single-Hotel QR System
            </span>
            <span>&bull;</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              Live Staff Dashboard
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="/kitchen"
              target="_blank"
              className="text-xs font-bold px-3.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-all flex items-center space-x-1.5"
            >
              <span>Open Kitchen Screen &rarr;</span>
            </a>
          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
