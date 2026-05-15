'use client';

import { useEffect } from 'react';

export default function ScreenError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <p className="text-xs font-mono text-red-400 uppercase tracking-widest mb-3">Screener Unavailable</p>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Could not reach the screening engine</h1>
      <p className="text-sm text-gray-500 mb-6">
        The backend API is unavailable. Check the service and try again.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-[#13204c] text-white text-sm font-medium rounded-md hover:bg-[#1c2f6b] transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
