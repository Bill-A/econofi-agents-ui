import type { InvestigationStatus } from '@/lib/types';
import { INVESTIGATION_STATUS_LABELS } from '@/lib/types';

const styles: Record<InvestigationStatus, string> = {
  pending:           'bg-[#e6f4f2] text-[#0d7a6b] border border-[#0d7a6b]/30',
  in_progress:       'bg-purple-50 text-purple-700 border border-purple-200',
  sar_filed:         'bg-[#13204c]/10 text-[#13204c] border border-[#13204c]/20',
  no_sar_warranted:  'bg-gray-50 text-gray-600 border border-gray-200',
  false_positive:    'bg-gray-50 text-gray-400 border border-gray-200',
};

export function StatusBadge({ status }: { status: InvestigationStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-sm font-medium ${styles[status]}`}>
      {INVESTIGATION_STATUS_LABELS[status]}
    </span>
  );
}
