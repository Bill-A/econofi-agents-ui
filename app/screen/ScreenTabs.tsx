'use client';

import { useState } from 'react';
import { ScreenerForm } from './ScreenerForm';
import { BatchScreenForm } from './BatchScreenForm';

type Tab = 'single' | 'batch';

export function ScreenTabs() {
  const [tab, setTab] = useState<Tab>('single');

  return (
    <>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          type="button"
          onClick={() => setTab('single')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'single'
              ? 'border-[#0d7a6b] text-[#0d7a6b]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Screen One
        </button>
        <button
          type="button"
          onClick={() => setTab('batch')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === 'batch'
              ? 'border-[#0d7a6b] text-[#0d7a6b]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Batch Screen
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        {tab === 'single' ? <ScreenerForm /> : <BatchScreenForm />}
      </div>

      {tab === 'batch' && (
        <p className="mt-3 text-xs text-gray-400 text-center">
          Developer / demo tool — in production, bulk intake arrives via SFTP pipeline.
        </p>
      )}
    </>
  );
}
