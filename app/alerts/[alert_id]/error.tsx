'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AlertDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <p className="text-xs font-mono text-red-400 uppercase tracking-widest mb-3">Alert Unavailable</p>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Could not load this alert</h1>
      <p className="text-sm text-gray-500 mb-6">
        The alert detail failed to load. The backend may be unavailable or this alert ID may not exist.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 bg-[#13204c] text-white text-sm font-medium rounded-md hover:bg-[#1c2f6b] transition-colors"
        >
          Retry
        </button>
        <Link href="/alerts" className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
