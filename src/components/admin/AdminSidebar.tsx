'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Layers,
  QrCode,
  ChefHat,
  Settings,
  Hotel,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SignOutButton } from './SignOutButton';

interface SidebarNavItemsProps {
  onItemClick?: () => void;
}

function SidebarNavItems({ onItemClick }: SidebarNavItemsProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
    { name: 'Menu', href: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Tables', href: '/admin/tables', icon: QrCode },
    { name: 'Kitchen', href: '/kitchen', icon: ChefHat, target: '_blank' },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            target={item.target}
            onClick={onItemClick}
            className={cn(
              'flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group',
              isActive
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
            )}
          >
            <Icon
              className={cn(
                'h-4 w-4 transition-colors',
                isActive
                  ? 'text-stone-950'
                  : 'text-stone-400 group-hover:text-amber-400'
              )}
            />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="w-64 hidden lg:flex flex-col shrink-0 h-screen sticky top-0 z-40">
        <div className="flex flex-col h-full bg-stone-900 text-stone-200 border-r border-stone-800">
          <div className="p-5 border-b border-stone-800 flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Hotel className="h-5 w-5 stroke-[2]" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-stone-100 tracking-wide">
                Grand Palace
              </h2>
              <p className="text-[11px] text-amber-400 font-semibold">Admin Dashboard</p>
            </div>
          </div>

          <SidebarNavItems />

          <div className="p-4 border-t border-stone-800">
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Tablet & Mobile Menu Toggle Button */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 shadow-md hover:bg-stone-800"
          aria-label="Toggle Navigation Sidebar"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop & Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs animate-in fade-in"
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex flex-col h-full bg-stone-900 text-stone-200 border-r border-stone-800">
              <div className="p-5 border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Hotel className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-stone-100 tracking-wide">
                      Grand Palace
                    </h2>
                    <p className="text-[11px] text-amber-400 font-semibold">
                      Admin Dashboard
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-stone-400 hover:text-white p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <SidebarNavItems onItemClick={() => setMobileOpen(false)} />

              <div className="p-4 border-t border-stone-800">
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
