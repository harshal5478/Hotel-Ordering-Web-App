import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  label?: string;
}

export function LoadingSpinner({ className, size = 24, label }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-2 text-stone-500">
      <Loader2 className={cn('animate-spin text-amber-500', className)} size={size} />
      {label && <p className="text-xs font-medium tracking-wide">{label}</p>}
    </div>
  );
}
