'use client';

import { useState } from 'react';
import { ScreenerForm } from './ScreenerForm';
import { BatchScreenForm } from './BatchScreenForm';

type Tab = 'single' | 'batch';

export default function ScreenPage() {
  const [tab, setTab] = useState<Tab>('single');

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#13204c] tracking-tight">Transaction Screener</h1>
        <p className="mt-1 text-base text-[#3d4557]">
          Screen sanitized transactions for BSA/AML patterns on demand.
        </p>
      </div>

      {/* Tab toggle */}
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
    </div>
  );
}
