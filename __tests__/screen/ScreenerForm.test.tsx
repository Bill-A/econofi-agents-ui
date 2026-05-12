/**
 * Transaction Screener — ScreenerForm Component Tests (TDD)
 *
 * Tests written FIRST. All should fail (RED) until ScreenerForm is implemented.
 *
 * Covers:
 *   - Form renders with pre-populated demo values (structuring scenario)
 *   - Submit button label
 *   - No-alert result: "No Suspicious Activity Detected" + checked patterns
 *   - Alert result: severity, type, regulatory citation, risk score
 *   - "View in Alert Dashboard" link when alert is returned
 *   - "Screen Another Transaction" resets to form
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@/app/screen/actions', () => ({
  screenTransactionAction: jest.fn(),
}));

import { ScreenerForm } from '@/app/screen/ScreenerForm';
import { screenTransactionAction } from '@/app/screen/actions';

const mockAction = screenTransactionAction as jest.Mock;

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const noAlertResult = {
  alert: null,
  screening_id: 'screen-test-001',
  checked_patterns: ['structuring', 'velocity_anomaly', 'round_dollar', 'geographic_risk'],
};

const alertResult = {
  alert: {
    alert_id: 'ALT-2026-05-06-00001',
    alert_type: 'structuring' as const,
    severity: 'high' as const,
    risk_score: 85,
    suspicious_indicators: ['Three deposits under $10,000 in 3-day window'],
    regulatory_citation: '31 USC §5324 — Structuring transactions to evade reporting requirements',
    recommended_action: 'file_sar' as const,
    confidence_score: 88,
    false_positive_probability: 0.12,
    account_hash: 'abc123hash',
    customer_token: '[PERSON_001]',
    expires_at: '2026-06-05T00:00:00Z',
  },
  screening_id: 'screen-test-002',
  checked_patterns: ['structuring', 'velocity_anomaly', 'round_dollar', 'geographic_risk'],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ScreenerForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with pre-populated demo customer token and amount', () => {
    render(<ScreenerForm />);
    expect(screen.getByDisplayValue('[PERSON_001]')).toBeInTheDocument();
    expect(screen.getByDisplayValue('9800')).toBeInTheDocument();
  });

  it('renders a "Screen Transaction" submit button', () => {
    render(<ScreenerForm />);
    expect(screen.getByRole('button', { name: /screen transaction/i })).toBeInTheDocument();
  });

  it('shows "No Suspicious Activity Detected" for a clean transaction', async () => {
    mockAction.mockResolvedValueOnce(noAlertResult);
    render(<ScreenerForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen transaction/i }));

    await waitFor(() => {
      expect(screen.getByText(/no suspicious activity detected/i)).toBeInTheDocument();
    });
  });

  it('lists all checked patterns in the no-alert result', async () => {
    mockAction.mockResolvedValueOnce(noAlertResult);
    render(<ScreenerForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen transaction/i }));

    await waitFor(() => {
      expect(screen.getByText(/no suspicious activity detected/i)).toBeInTheDocument();
    });

    expect(screen.getByText('structuring')).toBeInTheDocument();
    expect(screen.getByText('velocity_anomaly')).toBeInTheDocument();
    expect(screen.getByText('round_dollar')).toBeInTheDocument();
    expect(screen.getByText('geographic_risk')).toBeInTheDocument();
  });

  it('shows the alert type when a suspicious transaction is detected', async () => {
    mockAction.mockResolvedValueOnce(alertResult);
    render(<ScreenerForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen transaction/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/structuring/i).length).toBeGreaterThan(0);
    });
  });

  it('displays the regulatory citation 31 USC §5324 in the alert result', async () => {
    mockAction.mockResolvedValueOnce(alertResult);
    render(<ScreenerForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen transaction/i }));

    await waitFor(() => {
      expect(screen.getByText(/31 USC §5324/i)).toBeInTheDocument();
    });
  });

  it('shows the risk score in the alert result', async () => {
    mockAction.mockResolvedValueOnce(alertResult);
    render(<ScreenerForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen transaction/i }));

    await waitFor(() => {
      expect(screen.getByText('85')).toBeInTheDocument();
    });
  });

  it('shows a "View in Alert Dashboard" link when an alert is returned', async () => {
    mockAction.mockResolvedValueOnce(alertResult);
    render(<ScreenerForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen transaction/i }));

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /view in alert dashboard/i })).toBeInTheDocument();
    });
  });

  it('shows a "Screen Another Transaction" button after any result', async () => {
    mockAction.mockResolvedValueOnce(noAlertResult);
    render(<ScreenerForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen transaction/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /screen another transaction/i })).toBeInTheDocument();
    });
  });

  it('resets to the form when "Screen Another Transaction" is clicked', async () => {
    mockAction.mockResolvedValueOnce(noAlertResult);
    render(<ScreenerForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen transaction/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /screen another transaction/i })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /screen another transaction/i }));

    expect(screen.getByRole('button', { name: /screen transaction/i })).toBeInTheDocument();
    expect(screen.queryByText(/no suspicious activity detected/i)).not.toBeInTheDocument();
  });
});
