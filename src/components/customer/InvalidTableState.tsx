import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface InvalidTableStateProps {
  tableParam?: string;
}

export function InvalidTableState({ tableParam }: InvalidTableStateProps) {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center text-center p-4">
      <Card className="w-full max-w-sm border-rose-200 dark:border-rose-900 bg-white dark:bg-stone-900 shadow-xl p-2">
        <CardHeader className="space-y-3">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <CardTitle className="text-xl font-black text-stone-900 dark:text-stone-100">
            Invalid Table Code
          </CardTitle>

          <CardDescription className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            The table identifier <code className="bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded font-mono text-amber-600 dark:text-amber-400">{tableParam || 'Unknown'}</code> does not match an active dining table.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-xl text-left space-y-1.5 border border-stone-200/80 dark:border-stone-800 text-xs">
            <p className="font-bold text-stone-800 dark:text-stone-200">What to do next?</p>
            <ul className="list-disc pl-4 space-y-1 text-stone-500">
              <li>Re-scan the QR code printed on your table tent card.</li>
              <li>Ask a waiter or hotel staff member for assistance.</li>
            </ul>
          </div>

          <Link
            href="/"
            className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Return to Main Screen</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
