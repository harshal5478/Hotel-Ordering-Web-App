import React from 'react';
import { Hotel, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
          Hotel Settings & Preferences
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Configure single-hotel identity, currency options, and staff permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
              <Hotel className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Hotel Profile
              </h3>
              <p className="text-xs text-stone-500">Grand Palace Hotel & Fine Dining</p>
            </div>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 pt-1">
            Single-hotel architecture configured. Currency set to INR (₹).
          </p>
        </Card>

        <Card className="border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Security & Row Level Policies
              </h3>
              <p className="text-xs text-stone-500">Supabase Auth & RLS Enforced</p>
            </div>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 pt-1">
            All database operations protected by Supabase Row Level Security.
          </p>
        </Card>
      </div>
    </div>
  );
}
