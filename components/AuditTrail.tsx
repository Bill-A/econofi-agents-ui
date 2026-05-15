import type { AlertEvent } from '@/lib/types';
import { INVESTIGATION_STATUS_LABELS, CLOSURE_REASON_LABELS, type ClosureReasonCode } from '@/lib/types';

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function statusLabel(status: string): string {
  return INVESTIGATION_STATUS_LABELS[status as keyof typeof INVESTIGATION_STATUS_LABELS] ?? status;
}

function closureLabel(code: string): string {
  return CLOSURE_REASON_LABELS[code as ClosureReasonCode] ?? code;
}

export function AuditTrail({ events }: { events: AlertEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-base text-[#3d4557]">No events recorded yet.</p>
      </div>
    );
  }

  return (
    <ol className="space-y-0">
      {events.map((event, i) => (
        <li key={event.id} className="relative flex gap-4">
          {/* Vertical connector line */}
          {i < events.length - 1 && (
            <span
              className="absolute left-3 top-7 bottom-0 w-px bg-[#e9ecef]"
              aria-hidden
            />
          )}

          {/* Dot */}
          <span className="relative mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#e6f4f2] border-2 border-[#0d7a6b] flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#0d7a6b]" aria-hidden />
          </span>

          <div className="flex-1 pb-6">
            {/* Status transition */}
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {event.from_status !== null && (
                <>
                  <span className="text-base text-[#3d4557]">{statusLabel(event.from_status)}</span>
                  <span className="text-[#3d4557]" aria-hidden>→</span>
                </>
              )}
              <span className="text-base font-semibold text-[#13204c]">{statusLabel(event.to_status)}</span>
            </div>

            {/* Timestamp */}
            <p className="text-sm text-[#3d4557] mb-2">{formatTimestamp(event.created_at)}</p>

            {/* Closure reason */}
            {event.closure_reason_code !== null && (
              <p className="text-sm text-[#3d4557] mb-1">
                <span className="font-medium">Reason:</span>{' '}
                {closureLabel(event.closure_reason_code)}
              </p>
            )}

            {/* Notes */}
            {event.notes !== null && (
              <p className="text-sm text-[#3d4557] bg-[#f7f8fa] border border-[#e9ecef] rounded px-3 py-2 leading-relaxed">
                {event.notes}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
