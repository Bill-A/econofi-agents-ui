/**
 * Batch Screener — BatchScreenForm Component Tests (TDD)
 *
 * Tests written FIRST. All should fail (RED) until BatchScreenForm is implemented.
 *
 * This is a developer / demo tool. In production, bulk intake arrives via
 * SFTP → S3 → PII Sanitizer → API. This form is for integration testing,
 * demos, and manual spot-checks only.
 *
 * Covers:
 *   - Textarea pre-populated with a valid 3-transaction example
 *   - Live transaction count reflects the pre-populated example
 *   - Count updates when the user edits the JSON
 *   - Submit button label
 *   - "Analyzing N transactions..." loading state during submission
 *   - Results summary: transactions submitted + alerts created counts
 *   - Per-alert links to /alerts/:alert_id
 *   - Zero-alert result: "No alerts generated" message
 *   - PII_DETECTED 422: specific error message
 *   - Generic error message on other failures
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@/app/screen/actions', () => ({
  screenTransactionAction: jest.fn(),
  batchScreenAction: jest.fn(),
}));

import { BatchScreenForm } from '@/app/screen/BatchScreenForm';
import { batchScreenAction } from '@/app/screen/actions';

const mockBatchAction = batchScreenAction as jest.Mock;

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const noAlertsResult = {
  batch_id: 'batch-abc123',
  transactions_submitted: 3,
  alerts_created: 0,
  alerts: [],
};

const oneAlertResult = {
  batch_id: 'batch-def456',
  transactions_submitted: 3,
  alerts_created: 1,
  alerts: [
    {
      alert_id: 'ALT-2026-05-04-00001',
      alert_type: 'structuring',
      severity: 'high',
      risk_score: 87,
      suspicious_indicators: ['Three deposits under $10,000'],
      regulatory_citation: '31 USC §5324',
      recommended_action: 'file_sar',
      confidence_score: 88,
      false_positive_probability: 0.12,
      account_hash: 'abc123',
      customer_token: '[PERSON_001]',
      expires_at: '2026-06-04T00:00:00Z',
    },
  ],
};

const twoAlertsResult = {
  batch_id: 'batch-ghi789',
  transactions_submitted: 5,
  alerts_created: 2,
  alerts: [
    { ...oneAlertResult.alerts[0] },
    {
      alert_id: 'ALT-2026-05-05-00001',
      alert_type: 'velocity_anomaly',
      severity: 'critical',
      risk_score: 94,
      suspicious_indicators: ['11 outbound wires in 48 hours'],
      regulatory_citation: '31 USC §5318(g)',
      recommended_action: 'escalate_immediately',
      confidence_score: 96,
      false_positive_probability: 0.04,
      account_hash: 'def456',
      customer_token: '[PERSON_002]',
      expires_at: '2026-06-05T00:00:00Z',
    },
  ],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('BatchScreenForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a JSON textarea pre-populated with example transactions', () => {
    render(<BatchScreenForm />);
    const textarea = screen.getByRole('textbox', { name: /transaction json/i });
    expect(textarea).toBeInTheDocument();
    const value = (textarea as HTMLTextAreaElement).value;
    expect(value.trim()).toMatch(/^\[/);
    expect(value).toContain('[PERSON_001]');
    expect(value).toContain('account_hash');
  });

  it('shows a transaction count based on the pre-populated example', () => {
    render(<BatchScreenForm />);
    expect(screen.getByText(/3 transactions/i)).toBeInTheDocument();
  });

  it('updates the transaction count when the user edits the JSON', async () => {
    render(<BatchScreenForm />);

    const textarea = screen.getByRole('textbox', { name: /transaction json/i });
    fireEvent.change(textarea, {
      target: { value: '[{"account_hash":"abc","customer_token":"[PERSON_001]","amount":5000,"transaction_type":"cash_deposit","transaction_date":"2026-05-01"}]' },
    });

    expect(screen.getByText(/1 transaction/i)).toBeInTheDocument();
  });

  it('renders a "Screen Batch" submit button', () => {
    render(<BatchScreenForm />);
    expect(screen.getByRole('button', { name: /screen batch/i })).toBeInTheDocument();
  });

  it('shows "Analyzing N transactions..." on the button while the action is pending', async () => {
    mockBatchAction.mockImplementation(() => new Promise(() => {}));
    render(<BatchScreenForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen batch/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /analyzing 3 transactions/i })).toBeInTheDocument();
    });
  });

  it('shows submitted and alerts-created counts after a result with no alerts', async () => {
    mockBatchAction.mockResolvedValueOnce(noAlertsResult);
    render(<BatchScreenForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen batch/i }));

    await waitFor(() => {
      expect(screen.getByText(/3 submitted/i)).toBeInTheDocument();
      expect(screen.getByText(/0 alerts/i)).toBeInTheDocument();
    });
  });

  it('shows "no alerts generated" message when alerts_created is 0', async () => {
    mockBatchAction.mockResolvedValueOnce(noAlertsResult);
    render(<BatchScreenForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen batch/i }));

    await waitFor(() => {
      expect(screen.getByText(/no alerts generated/i)).toBeInTheDocument();
    });
  });

  it('shows alert count and a link for each alert created', async () => {
    mockBatchAction.mockResolvedValueOnce(oneAlertResult);
    render(<BatchScreenForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen batch/i }));

    await waitFor(() => {
      expect(screen.getByText(/1 alert/i)).toBeInTheDocument();
    });

    const link = screen.getByRole('link', { name: /ALT-2026-05-04-00001/i });
    expect(link).toHaveAttribute('href', '/alerts/ALT-2026-05-04-00001');
  });

  it('shows a link for each alert when multiple alerts are created', async () => {
    mockBatchAction.mockResolvedValueOnce(twoAlertsResult);
    render(<BatchScreenForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen batch/i }));

    await waitFor(() => {
      expect(screen.getByText(/2 alerts/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: /ALT-2026-05-04-00001/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ALT-2026-05-05-00001/i })).toBeInTheDocument();
  });

  it('shows a PII_DETECTED error message on 422', async () => {
    mockBatchAction.mockResolvedValueOnce({ error: 'PII_DETECTED', message: 'Batch rejected: PII detected in one or more transactions.' });
    render(<BatchScreenForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen batch/i }));

    await waitFor(() => {
      expect(screen.getByText(/pii detected — batch rejected/i)).toBeInTheDocument();
    });
  });

  it('shows a generic error message on other failures', async () => {
    mockBatchAction.mockResolvedValueOnce({ error: 'INVALID_REQUEST', message: 'Request body validation failed.' });
    render(<BatchScreenForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen batch/i }));

    await waitFor(() => {
      expect(screen.getByText(/request body validation failed/i)).toBeInTheDocument();
    });
  });

  it('shows a "Screen Another Batch" button after any result', async () => {
    mockBatchAction.mockResolvedValueOnce(noAlertsResult);
    render(<BatchScreenForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen batch/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /screen another batch/i })).toBeInTheDocument();
    });
  });

  it('resets to the form when "Screen Another Batch" is clicked', async () => {
    mockBatchAction.mockResolvedValueOnce(noAlertsResult);
    render(<BatchScreenForm />);

    await userEvent.click(screen.getByRole('button', { name: /screen batch/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /screen another batch/i })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /screen another batch/i }));

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /transaction json/i })).toBeInTheDocument();
    });
    expect(screen.queryByText(/no alerts generated/i)).not.toBeInTheDocument();
  });
});
