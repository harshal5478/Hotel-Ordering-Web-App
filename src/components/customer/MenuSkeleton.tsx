import React from 'react';

export function MenuSkeleton() {
  return (
    <div className="space-y-4 animate-pulse pt-2">
      {/* Search Skeleton */}
      <div className="h-10 bg-stone-200 dark:bg-stone-800 rounded-2xl w-full" />

      {/* Category Pills Skeleton */}
      <div className="flex space-x-2 overflow-hidden py-1">
        <div className="h-8 w-24 bg-stone-200 dark:bg-stone-800 rounded-xl shrink-0" />
        <div className="h-8 w-28 bg-stone-200 dark:bg-stone-800 rounded-xl shrink-0" />
        <div className="h-8 w-24 bg-stone-200 dark:bg-stone-800 rounded-xl shrink-0" />
        <div className="h-8 w-32 bg-stone-200 dark:bg-stone-800 rounded-xl shrink-0" />
      </div>

      {/* Food Cards Skeleton */}
      <div className="space-y-3 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex space-x-3.5"
          >
            <div className="h-24 w-24 rounded-xl bg-stone-200 dark:bg-stone-800 shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
              <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-full" />
              <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-16" />
                <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded-xl w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
