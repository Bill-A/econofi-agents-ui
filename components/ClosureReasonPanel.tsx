'use client';

import { CLOSURE_REASON_CODES, CLOSURE_REASON_LABELS } from '@/lib/types';

export function ClosureReasonPanel() {
  return (
    <div
      data-testid="closure-reason-panel"
      className="rounded-lg border border-amber-200 bg-amber-50 p-5 space-y-4"
    >
      <h3 className="text-sm font-semibold text-amber-900">Closure Reason</h3>
      <p className="text-xs text-amber-800 leading-relaxed">
        Select the primary reason no SAR is being filed. This is required for the audit trail.
      </p>

      <div>
        <label
          htmlFor="closure_reason_code"
          className="block text-sm font-medium text-amber-900 mb-1"
        >
          Closure Reason <span className="text-red-500">*</span>
        </label>
        <select
          id="closure_reason_code"
          name="closure_reason_code"
          defaultValue=""
          className="w-full border border-amber-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="" disabled>
            Select a reason...
          </option>
          {CLOSURE_REASON_CODES.map((code) => (
            <option key={code} value={code}>
              {CLOSURE_REASON_LABELS[code]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="closure_reason_detail"
          className="block text-sm font-medium text-amber-900 mb-1"
        >
          Additional Detail <span className="text-amber-600 font-normal">(optional)</span>
        </label>
        <textarea
          id="closure_reason_detail"
          name="closure_reason_detail"
          rows={3}
          placeholder="Provide any supporting context for the closure decision..."
          className="w-full border border-amber-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
        />
      </div>
    </div>
  );
}
