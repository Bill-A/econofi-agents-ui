'use client';

import { useActionState, useState } from 'react';
import { updateInvestigationStatus } from './actions';
import type { ActionState } from './actions';
import type { BsaAmlAlert, InvestigationStatus } from '@/lib/types';
import { INVESTIGATION_STATUS_LABELS } from '@/lib/types';
import { SARNarrativePanel } from '@/components/SARNarrativePanel';

const STATUSES: InvestigationStatus[] = [
  'pending',
  'in_progress',
  'sar_filed',
  'no_sar_warranted',
  'false_positive',
];

interface Props {
  alertId: string;
  currentStatus: InvestigationStatus;
  currentNotes: string | null;
  alert: BsaAmlAlert;
}

// Re-export type for use in page
export type { ActionState };

const initial: ActionState = { error: null, success: false };

export function InvestigationForm({ alertId, currentStatus, currentNotes, alert }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<InvestigationStatus>(currentStatus);
  const boundAction = updateInvestigationStatus.bind(null, alertId);
  const [state, formAction, isPending] = useActionState(boundAction, initial);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Investigation Status
        </label>
        <select
          id="status"
          name="status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as InvestigationStatus)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {INVESTIGATION_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="investigation_notes" className="block text-sm font-medium text-gray-700 mb-1">
          Investigation Notes
        </label>
        <textarea
          id="investigation_notes"
          name="investigation_notes"
          rows={4}
          defaultValue={currentNotes ?? ''}
          placeholder="Document your findings, review steps taken, rationale for decision..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {selectedStatus === 'sar_filed' && (
        <SARNarrativePanel alert={alert} />
      )}

      {selectedStatus === 'sar_filed' && (
        <div>
          <label htmlFor="sar_reference_number" className="block text-sm font-medium text-gray-700 mb-1">
            SAR Reference Number <span className="text-red-500">*</span>
          </label>
          <input
            id="sar_reference_number"
            name="sar_reference_number"
            type="text"
            required
            placeholder="e.g. SAR-2026-001"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Required when filing a SAR. Enter the FinCEN reference number assigned at submission.
          </p>
        </div>
      )}

      {state.error !== null && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      {state.success && (
        <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3">
          <p className="text-sm text-green-700">Investigation status updated.</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Updating...' : 'Update Investigation'}
      </button>
    </form>
  );
}
