import Link from 'next/link';
import type { BsaAmlAlert } from '@/lib/types';
import { ALERT_TYPE_LABELS } from '@/lib/types';
import { SeverityBadge } from './SeverityBadge';
import { StatusBadge } from './StatusBadge';
import { alertAgeDays } from '@/lib/utils';

interface Props {
  relatedAlerts: BsaAmlAlert[];
  customerToken: string;
}

export function CustomerAlertHistory({ relatedAlerts, customerToken }: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-[#f7f8fa] flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Customer Alert History
        </h2>
        <span className="text-xs font-mono text-[#3d4557]">{customerToken}</span>
      </div>

      {relatedAlerts.length === 0 ? (
        <p className="px-5 py-4 text-sm text-gray-500">No other alerts for this customer.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {relatedAlerts.map((alert) => (
            <li key={alert.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-mono text-gray-400 mb-0.5">{alert.alert_id}</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {ALERT_TYPE_LABELS[alert.alert_type]}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {alertAgeDays(alert.created_at)}d ago · Risk {alert.risk_score}/100
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <SeverityBadge severity={alert.severity} />
                  <StatusBadge status={alert.investigation_status} />
                </div>
              </div>
              <Link
                href={`/alerts/${alert.alert_id}`}
                className="mt-2 inline-block text-xs font-semibold text-[#0d7a6b] hover:underline"
              >
                View alert →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
