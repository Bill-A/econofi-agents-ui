/**
 * Audit Trail Timeline — AuditTrail Component Tests (TDD)
 *
 * Tests written FIRST. All should fail (RED) until AuditTrail is implemented.
 *
 * Covers:
 *   - Empty state: "No events recorded yet"
 *   - Single event: to_status as human-readable label
 *   - Formatted timestamp (month, day, year)
 *   - from_status → to_status transition arrow when from_status is present
 *   - No transition arrow when from_status is null (first event)
 *   - Closure reason displayed as human-readable label when present
 *   - No closure reason row when closure_reason_code is null
 *   - Notes displayed when present
 *   - No notes row when notes is null
 *   - Multiple events rendered in order
 */

import { render, screen } from '@testing-library/react';
import { AuditTrail } from '@/components/AuditTrail';
import type { AlertEvent } from '@/lib/types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const statusChangeEvent: AlertEvent = {
  id: 'evt-001',
  alert_id: 'ALT-2026-05-04-00001',
  event_type: 'status_change',
  from_status: null,
  to_status: 'in_progress',
  notes: null,
  closure_reason_code: null,
  actor: null,
  created_at: '2026-05-04T10:00:00Z',
};

const closureEvent: AlertEvent = {
  id: 'evt-002',
  alert_id: 'ALT-2026-05-04-00001',
  event_type: 'status_change',
  from_status: 'in_progress',
  to_status: 'no_sar_warranted',
  notes: 'Reviewed transaction history. Consistent with tanda cycle activity.',
  closure_reason_code: 'tanda_cycle',
  actor: null,
  created_at: '2026-05-05T14:30:00Z',
};

const sarFiledEvent: AlertEvent = {
  id: 'evt-003',
  alert_id: 'ALT-2026-05-05-00001',
  event_type: 'status_change',
  from_status: 'in_progress',
  to_status: 'sar_filed',
  notes: null,
  closure_reason_code: null,
  actor: null,
  created_at: '2026-05-06T09:15:00Z',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AuditTrail', () => {
  it('renders "No events recorded yet" when events array is empty', () => {
    render(<AuditTrail events={[]} />);
    expect(screen.getByText(/no events recorded yet/i)).toBeInTheDocument();
  });

  it('renders the to_status as a human-readable label', () => {
    render(<AuditTrail events={[statusChangeEvent]} />);
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
  });

  it('renders a formatted timestamp for each event', () => {
    render(<AuditTrail events={[statusChangeEvent]} />);
    expect(screen.getByText(/may 4, 2026/i)).toBeInTheDocument();
  });

  it('does not show a from_status arrow when from_status is null', () => {
    render(<AuditTrail events={[statusChangeEvent]} />);
    expect(screen.queryByText(/pending/i)).not.toBeInTheDocument();
  });

  it('shows from_status → to_status transition when from_status is present', () => {
    render(<AuditTrail events={[closureEvent]} />);
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    expect(screen.getByText(/no sar warranted/i)).toBeInTheDocument();
  });

  it('renders closure reason as a human-readable label when present', () => {
    render(<AuditTrail events={[closureEvent]} />);
    expect(screen.getByText(/tanda cycle \/ informal savings/i)).toBeInTheDocument();
  });

  it('does not render closure reason when closure_reason_code is null', () => {
    render(<AuditTrail events={[sarFiledEvent]} />);
    expect(screen.queryByText(/tanda/i)).not.toBeInTheDocument();
  });

  it('renders notes when present', () => {
    render(<AuditTrail events={[closureEvent]} />);
    expect(screen.getByText(/consistent with tanda cycle activity/i)).toBeInTheDocument();
  });

  it('does not render a notes row when notes is null', () => {
    render(<AuditTrail events={[statusChangeEvent]} />);
    expect(screen.queryByText(/reviewed/i)).not.toBeInTheDocument();
  });

  it('renders multiple events in the order provided', () => {
    render(<AuditTrail events={[statusChangeEvent, closureEvent]} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent(/in progress/i);
    expect(items[1]).toHaveTextContent(/no sar warranted/i);
  });
});
