import { ReactNode } from 'react';
import { Utensils } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon = <Utensils className="h-10 w-10 text-stone-400" />,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl bg-stone-50/50 dark:bg-stone-900/50 my-4">
      <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-full mb-3">
        {icon}
      </div>
      <h4 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-1">
        {title}
      </h4>
      {description && (
        <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mb-4">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
