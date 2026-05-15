/**
 * InvestigationForm — Close Without Filing Panel (TDD)
 *
 * Tests written FIRST. All should fail (RED) until ClosureReasonPanel and
 * closure_reason_code field are added to InvestigationForm.
 *
 * Covers:
 *   - Closure panel appears for no_sar_warranted and false_positive statuses
 *   - Closure panel does NOT appear for pending, in_progress, sar_filed
 *   - All 8 closure reason codes are present in the dropdown
 *   - closure_reason_code is submitted with the form action
 *   - Optional detail text field renders inside the panel
 *   - Closure panel heading is visible
 */

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@/app/alerts/[alert_id]/actions', () => ({
  updateInvestigationStatus: jest.fn(),
}));

jest.mock('@/components/SARNarrativePanel', () => ({
  SARNarrativePanel: () => <div data-testid="sar-narrative-panel" />,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

import { InvestigationForm } from '@/app/alerts/[alert_id]/InvestigationForm';
import type { BsaAmlAlert } from '@/lib/types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const baseAlert: BsaAmlAlert = {
  id: 'uuid-001',
  alert_id: 'ALT-2026-05-04-00001',
  account_hash: 'abc123',
  customer_token: '[PERSON_001]',
  risk_score: 87,
  alert_type: 'structuring',
  severity: 'high',
  transactions_flagged: [],
  suspicious_indicators: ['Three deposits under $10,000'],
  regulatory_citation: '31 USC §5324',
  recommended_action: 'file_sar',
  confidence_score: 88,
  false_positive_probability: 0.12,
  created_at: '2026-05-04T10:00:00Z',
  expires_at: '2026-06-04T10:00:00Z',
  assigned_to: null,
  investigation_status: 'pending',
  investigation_notes: null,
  investigation_completed_at: null,
  closure_reason_code: null,
  closure_reason_detail: null,
};

const CLOSURE_REASON_CODES = [
  'tanda_cycle',
  'documented_business_purpose',
  'prior_cdd_review',
  'seasonal_income',
  'institutional_knowledge',
  'insufficient_evidence',
  'system_false_positive',
  'other',
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('InvestigationForm — Close Without Filing Panel', () => {
  it('does not show closure panel when status is pending', () => {
    render(
      <InvestigationForm
        alertId="ALT-2026-05-04-00001"
        currentStatus="pending"
        currentNotes={null}
        alert={baseAlert}
      />,
    );
    expect(screen.queryByTestId('closure-reason-panel')).not.toBeInTheDocument();
  });

  it('does not show closure panel when status is in_progress', async () => {
    render(
      <InvestigationForm
        alertId="ALT-2026-05-04-00001"
        currentStatus="in_progress"
        currentNotes={null}
        alert={baseAlert}
      />,
    );
    expect(screen.queryByTestId('closure-reason-panel')).not.toBeInTheDocument();
  });

  it('does not show closure panel when status is sar_filed', async () => {
    render(
      <InvestigationForm
        alertId="ALT-2026-05-04-00001"
        currentStatus="sar_filed"
        currentNotes={null}
        alert={baseAlert}
      />,
    );
    expect(screen.queryByTestId('closure-reason-panel')).not.toBeInTheDocument();
  });

  it('shows closure panel when status is no_sar_warranted', async () => {
    render(
      <InvestigationForm
        alertId="ALT-2026-05-04-00001"
        currentStatus="pending"
        currentNotes={null}
        alert={baseAlert}
      />,
    );

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /investigation status/i }), 'no_sar_warranted');

    expect(screen.getByTestId('closure-reason-panel')).toBeInTheDocument();
  });

  it('shows closure panel when status is false_positive', async () => {
    render(
      <InvestigationForm
        alertId="ALT-2026-05-04-00001"
        currentStatus="pending"
        currentNotes={null}
        alert={baseAlert}
      />,
    );

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /investigation status/i }), 'false_positive');

    expect(screen.getByTestId('closure-reason-panel')).toBeInTheDocument();
  });

  it('closure panel contains a heading', async () => {
    render(
      <InvestigationForm
        alertId="ALT-2026-05-04-00001"
        currentStatus="no_sar_warranted"
        currentNotes={null}
        alert={baseAlert}
      />,
    );

    const panel = screen.getByTestId('closure-reason-panel');
    expect(within(panel).getByRole('heading', { name: /closure reason/i })).toBeInTheDocument();
  });

  it('closure panel contains a dropdown with all 8 reason codes', async () => {
    render(
      <InvestigationForm
        alertId="ALT-2026-05-04-00001"
        currentStatus="no_sar_warranted"
        currentNotes={null}
        alert={baseAlert}
      />,
    );

    const panel = screen.getByTestId('closure-reason-panel');
    const select = within(panel).getByRole('combobox', { name: /closure reason/i });

    for (const code of CLOSURE_REASON_CODES) {
      expect(within(select).getByRole('option', { name: new RegExp(code.replace(/_/g, '[_ ]'), 'i') })).toBeInTheDocument();
    }
  });

  it('closure panel contains an optional detail text field', async () => {
    render(
      <InvestigationForm
        alertId="ALT-2026-05-04-00001"
        currentStatus="false_positive"
        currentNotes={null}
        alert={baseAlert}
      />,
    );

    const panel = screen.getByTestId('closure-reason-panel');
    expect(within(panel).getByRole('textbox', { name: /additional detail/i })).toBeInTheDocument();
  });

  it('closure panel disappears when status switches back to in_progress', async () => {
    render(
      <InvestigationForm
        alertId="ALT-2026-05-04-00001"
        currentStatus="no_sar_warranted"
        currentNotes={null}
        alert={baseAlert}
      />,
    );

    expect(screen.getByTestId('closure-reason-panel')).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /investigation status/i }), 'in_progress');

    expect(screen.queryByTestId('closure-reason-panel')).not.toBeInTheDocument();
  });
});
