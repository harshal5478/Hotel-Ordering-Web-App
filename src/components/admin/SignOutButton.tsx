'use client';

import React, { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { logoutAction } from '@/actions/auth';

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await logoutAction();
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded-lg border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs font-medium transition-colors disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
      ) : (
        <LogOut className="h-3.5 w-3.5" />
      )}
      <span>{loading ? 'Signing Out...' : 'Sign Out'}</span>
    </button>
  );
}
