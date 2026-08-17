import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
  disabled = false,
  size = 'md',
  className,
}: QuantitySelectorProps) {
  const isMin = quantity <= min;
  const isMax = quantity >= max;

  const buttonSizeClasses = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const iconSizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 p-1 shadow-xs',
        className
      )}
      role="group"
      aria-label="Quantity Selector"
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={disabled || isMin}
        aria-label="Decrease quantity"
        className={cn(
          'flex items-center justify-center rounded-lg font-extrabold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-40 disabled:cursor-not-allowed',
          buttonSizeClasses[size],
          'hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
        )}
      >
        <Minus className={iconSizeClasses[size]} />
      </button>

      <span
        className={cn(
          'font-black text-stone-900 dark:text-stone-100 text-center select-none',
          size === 'sm' ? 'px-2 min-w-[24px] text-xs' : 'px-3 min-w-[32px] text-sm'
        )}
        aria-live="polite"
        aria-label={`Current quantity: ${quantity}`}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        disabled={disabled || isMax}
        aria-label="Increase quantity"
        className={cn(
          'flex items-center justify-center rounded-lg font-extrabold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-40 disabled:cursor-not-allowed',
          buttonSizeClasses[size],
          'bg-amber-500 text-stone-950 hover:bg-amber-400 font-black shadow-xs'
        )}
      >
        <Plus className={iconSizeClasses[size]} />
      </button>
    </div>
  );
}
