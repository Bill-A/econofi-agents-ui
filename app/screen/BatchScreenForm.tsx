'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { batchScreenAction } from './actions';
import type { BatchScreenResult } from './actions';

const EXAMPLE_TRANSACTIONS = JSON.stringify(
  [
    {
      transaction_id: 'txn-001',
      account_hash: 'a8f3c92e4b1d5f7a3c2b1e9d0f8a7b6c',
      customer_token: '[PERSON_001]',
      amount: 9200,
      transaction_type: 'cash_deposit',
      transaction_date: '2026-05-01',
    },
    {
      transaction_id: 'txn-002',
      account_hash: 'a8f3c92e4b1d5f7a3c2b1e9d0f8a7b6c',
      customer_token: '[PERSON_001]',
      amount: 9400,
      transaction_type: 'cash_deposit',
      transaction_date: '2026-05-02',
    },
    {
      transaction_id: 'txn-003',
      account_hash: 'a8f3c92e4b1d5f7a3c2b1e9d0f8a7b6c',
      customer_token: '[PERSON_001]',
      amount: 9150,
      transaction_type: 'cash_deposit',
      transaction_date: '2026-05-03',
    },
  ],
  null,
  2,
);

function countTransactions(json: string): number {
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

interface AlertRow {
  alert_id: string;
  alert_type: string;
  severity: string;
  risk_score: number;
}

export function BatchScreenForm() {
  const [json, setJson] = useState(EXAMPLE_TRANSACTIONS);
  const [result, setResult] = useState<BatchScreenResult | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const count = countTransactions(json);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const r = await batchScreenAction(json);
      setResult(r);
    });
  };

  if (result !== undefined) {
    return <BatchResultView result={result} onReset={() => setResult(undefined)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="transaction_json" className="block text-base font-medium text-gray-700">
            Transaction JSON
          </label>
          <span className="text-xs font-mono text-gray-400">
            {count} transaction{count !== 1 ? 's' : ''}
          </span>
        </div>
        <textarea
          id="transaction_json"
          name="transaction_json"
          rows={14}
          value={json}
          onChange={(e) => setJson(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-base font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          aria-label="Transaction JSON"
        />
        <p className="mt-1 text-xs text-gray-400">
          Sanitized transactions only — customer tokens and account hashes, no PII. Max 500 per batch.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending || count === 0}
        className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? `Analyzing ${count} transaction${count !== 1 ? 's' : ''}...` : 'Screen Batch'}
      </button>
    </form>
  );
}

function BatchResultView({ result, onReset }: { result: BatchScreenResult; onReset: () => void }) {
  if (result.error) {
    const isPii = result.error === 'PII_DETECTED';
    return (
      <div className="space-y-4">
        <div className={`rounded-lg border p-5 ${isPii ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}`}>
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {isPii ? 'PII Detected — Batch Rejected' : 'Batch Failed'}
          </p>
          <p className="text-sm text-gray-700">{result.message}</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="w-full px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Screen Another Batch
        </button>
      </div>
    );
  }

  const alerts = result.alerts as AlertRow[];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 flex items-center gap-8">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Submitted</p>
          <p className="text-2xl font-bold text-gray-900">{result.transactions_submitted} submitted</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Alerts</p>
          <p className={`text-2xl font-bold ${result.alerts_created > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {result.alerts_created} alert{result.alerts_created !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {result.alerts_created === 0 ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-4">
          <p className="text-sm font-medium text-green-800">No alerts generated</p>
          <p className="text-xs text-green-700 mt-0.5">No BSA/AML patterns detected in the submitted transactions.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Link
              key={alert.alert_id}
              href={`/alerts/${alert.alert_id}`}
              className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 hover:border-orange-300 hover:shadow-sm transition-all"
            >
              <span className="text-sm font-mono font-semibold text-gray-900">{alert.alert_id}</span>
              <span className="text-xs text-orange-700 font-semibold uppercase tracking-wide">
                Risk {alert.risk_score}
              </span>
            </Link>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onReset}
        className="w-full px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
      >
        Screen Another Batch
      </button>
    </div>
  );
}
