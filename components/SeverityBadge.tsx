import type { AlertSeverity } from '@/lib/types';

const styles: Record<AlertSeverity, string> = {
  critical: 'bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-300',
  high:     'bg-orange-50 text-orange-700 border border-orange-200',
  medium:   'bg-amber-50 text-amber-700 border border-amber-200',
  low:      'bg-gray-50 text-gray-600 border border-gray-200',
};

export function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-sm font-semibold font-mono uppercase tracking-widest ${styles[severity]}`}>
      {severity}
    </span>
  );
}
