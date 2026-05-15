'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { screenTransactionAction } from './actions';
import { SeverityBadge } from '@/components/SeverityBadge';
import { ALERT_TYPE_LABELS, RECOMMENDED_ACTION_LABELS } from '@/lib/types';
import type { ScreeningResult } from '@/lib/types';

const today = new Date().toISOString().split('T')[0] ?? '';

const DEMO_DEFAULTS = {
  customer_token: '[PERSON_001]',
  account_hash: 'a8f3c92e4b1d5f7a3c2b1e9d0f8a7b6c',
  amount: '9800',
  transaction_type: 'cash_deposit',
  transaction_date: today,
};

const TRANSACTION_TYPES = [
  { value: 'cash_deposit', label: 'Cash Deposit' },
  { value: 'cash_withdrawal', label: 'Cash Withdrawal' },
  { value: 'wire_in', label: 'Wire In' },
  { value: 'wire_out', label: 'Wire Out' },
  { value: 'ach_debit', label: 'ACH Debit' },
  { value: 'ach_credit', label: 'ACH Credit' },
  { value: 'check_deposit', label: 'Check Deposit' },
  { value: 'check_withdrawal', label: 'Check Withdrawal' },
];

const COUNTERPARTY_COUNTRIES = [
  { value: '', label: 'Domestic / None' },
  { value: 'IR', label: 'IR — Iran (FATF blacklist)' },
  { value: 'KP', label: 'KP — North Korea (FATF blacklist)' },
  { value: 'MM', label: 'MM — Myanmar (FATF blacklist)' },
  { value: 'AE', label: 'AE — UAE (FATF greylist)' },
  { value: 'TR', label: 'TR — Turkey (FATF greylist)' },
  { value: 'PH', label: 'PH — Philippines (FATF greylist)' },
  { value: 'PK', label: 'PK — Pakistan (FATF greylist)' },
  { value: 'KY', label: 'KY — Cayman Islands (shell company jurisdiction)' },
  { value: 'VG', label: 'VG — British Virgin Islands (shell company jurisdiction)' },
  { value: 'PA', label: 'PA — Panama (shell company jurisdiction)' },
];

export function ScreenerForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ScreeningResult | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const r = await screenTransactionAction(formData);
      setResult(r ?? undefined);
    });
  };

  if (result !== undefined) {
    return <ResultView result={result} onReset={() => setResult(undefined)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="customer_token" className="block text-lg font-medium text-gray-700 mb-1">
            Customer Token
          </label>
          <input
            id="customer_token"
            name="customer_token"
            type="text"
            defaultValue={DEMO_DEFAULTS.customer_token}
            placeholder="[PERSON_001]"
            required
            className="w-full border border-gray-300 rounded-md px-3 py-3 text-lg font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="account_hash" className="block text-lg font-medium text-gray-700 mb-1">
            Account Hash (SHA-256)
          </label>
          <input
            id="account_hash"
            name="account_hash"
            type="text"
            defaultValue={DEMO_DEFAULTS.account_hash}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-3 text-lg font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-lg font-medium text-gray-700 mb-1">
            Amount (USD)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={DEMO_DEFAULTS.amount}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-3 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="transaction_type" className="block text-lg font-medium text-gray-700 mb-1">
            Transaction Type
          </label>
          <select
            id="transaction_type"
            name="transaction_type"
            defaultValue={DEMO_DEFAULTS.transaction_type}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-3 text-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {TRANSACTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="transaction_date" className="block text-lg font-medium text-gray-700 mb-1">
            Transaction Date
          </label>
          <input
            id="transaction_date"
            name="transaction_date"
            type="date"
            defaultValue={DEMO_DEFAULTS.transaction_date}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-3 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="counterparty_country" className="block text-lg font-medium text-gray-700 mb-1">
            Counterparty Country
          </label>
          <select
            id="counterparty_country"
            name="counterparty_country"
            className="w-full border border-gray-300 rounded-md px-3 py-3 text-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COUNTERPARTY_COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-6">
          <input
            id="is_online_banking"
            name="is_online_banking"
            type="checkbox"
            value="true"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="is_online_banking" className="text-lg text-gray-700">
            Online banking transaction
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Screening...' : 'Screen Transaction'}
      </button>
    </form>
  );
}

function ResultView({ result, onReset }: { result: ScreeningResult; onReset: () => void }) {
  const { alert, screening_id, checked_patterns } = result;

  return (
    <div className="space-y-5">
      {alert === null ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-green-600 text-xl" aria-hidden>&#10003;</span>
            <div>
              <h3 className="text-base font-semibold text-green-800">No Suspicious Activity Detected</h3>
              <p className="text-sm text-green-700 mt-1">
                Transaction screened — no BSA/AML patterns identified.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-200">
            <p className="text-xs font-medium text-green-700 uppercase tracking-wide mb-2">Patterns Checked</p>
            <div className="flex flex-wrap gap-2">
              {checked_patterns.map((pattern) => (
                <span key={pattern} className="text-xs font-mono bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">
                  {pattern}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-3 text-xs text-green-600 font-mono">Screening ID: {screening_id}</p>
        </div>
      ) : (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-mono text-orange-500 mb-1">{alert.alert_id}</p>
              <h3 className="text-base font-semibold text-gray-900">Suspicious Activity Detected</h3>
              <p className="text-sm text-gray-600 mt-0.5">{ALERT_TYPE_LABELS[alert.alert_type]}</p>
            </div>
            <SeverityBadge severity={alert.severity} />
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Risk Score</span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${alert.risk_score >= 80 ? 'bg-red-500' : 'bg-orange-400'}`}
                    style={{ width: `${alert.risk_score}%` }}
                  />
                </div>
                <span className="font-semibold text-gray-900">{alert.risk_score}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wide">Action</span>
              <p className="font-medium text-gray-900 mt-0.5">{RECOMMENDED_ACTION_LABELS[alert.recommended_action]}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Suspicious Indicators</p>
            <ul className="space-y-1">
              {alert.suspicious_indicators.map((ind, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400" />
                  {ind}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Regulatory Basis</p>
            <p className="text-sm font-mono text-gray-700 bg-white rounded border border-orange-200 px-3 py-2">
              {alert.regulatory_citation}
            </p>
          </div>

          <Link
            href={`/alerts/${alert.alert_id}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View in Alert Dashboard <span className="ml-1" aria-hidden>→</span>
          </Link>
        </div>
      )}

      <button
        type="button"
        onClick={onReset}
        className="w-full px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
      >
        Screen Another Transaction
      </button>
    </div>
  );
}
