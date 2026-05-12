import Link from 'next/link';
import { getAlerts } from '@/lib/api';
import { ALERT_TYPE_LABELS } from '@/lib/types';
import { SeverityBadge } from '@/components/SeverityBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { AlertFilters } from './AlertFilters';

interface PageProps {
  searchParams: Promise<{ severity?: string; status?: string; page?: string }>;
}

export default async function AlertsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));

  const { alerts, pagination } = await getAlerts({
    severity: params.severity,
    status: params.status,
    page,
    per_page: 25,
  });

  const start = (page - 1) * 25 + 1;
  const end = Math.min(page * 25, pagination.total);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#13204c] tracking-tight">BSA/AML Alert Dashboard</h1>
          <p className="mt-1 text-sm text-[#3d4557]">
            Bank-scoped alerts — investigation workflow and SAR decision support
          </p>
        </div>
        <Link
          href="/screen"
          className="inline-flex items-center px-4 py-2 bg-[#0d7a6b] text-white text-sm font-medium rounded-md hover:bg-[#0a6459] transition-colors shadow-sm"
        >
          Screen Transaction
        </Link>
      </div>

      {/* Alert count summary bar */}
      {pagination.total > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-mono text-[#3d4557] bg-[#e6f4f2] border border-[#0d7a6b]/20 px-2.5 py-1 rounded-full">
            {pagination.total} alert{pagination.total !== 1 ? 's' : ''}
          </span>
          {(params.severity || params.status) && (
            <Link
              href="/alerts"
              className="text-xs text-[#0d7a6b] hover:underline font-medium"
            >
              Clear filters
            </Link>
          )}
        </div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-lg border border-[#e9ecef] shadow-sm overflow-hidden">

        {/* Filters bar */}
        <div className="px-6 py-3 border-b border-[#e9ecef] bg-[#f7f8fa] flex items-center justify-between">
          <AlertFilters severity={params.severity} status={params.status} />
          {pagination.total > 0 && (
            <span className="text-xs text-[#3d4557] font-mono">
              {start}–{end} of {pagination.total}
            </span>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-[#3d4557] text-sm">No alerts match the current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[#e9ecef]">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#3d4557] uppercase tracking-wider bg-white">Alert ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#3d4557] uppercase tracking-wider bg-white">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#3d4557] uppercase tracking-wider bg-white">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#3d4557] uppercase tracking-wider bg-white">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#3d4557] uppercase tracking-wider bg-white">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#3d4557] uppercase tracking-wider bg-white">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#3d4557] uppercase tracking-wider bg-white">Date</th>
                  <th className="px-6 py-3 bg-white" />
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert, i) => (
                  <tr
                    key={alert.id}
                    className={`border-b border-[#e9ecef] hover:bg-[#e6f4f2]/40 transition-colors ${
                      i % 2 === 0 ? 'bg-white' : 'bg-[#f7f8fa]'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-mono text-[#1a1d26] bg-[#f7f8fa] border border-[#e9ecef] px-1.5 py-0.5 rounded">
                        {alert.alert_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-[#1a1d26]">{ALERT_TYPE_LABELS[alert.alert_type]}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <SeverityBadge severity={alert.severity} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#e9ecef] rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              alert.risk_score >= 80
                                ? 'bg-red-500'
                                : alert.risk_score >= 60
                                ? 'bg-amber-500'
                                : 'bg-[#0d7a6b]'
                            }`}
                            style={{ width: `${alert.risk_score}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-[#1a1d26] w-6 text-right">
                          {alert.risk_score}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-[#3d4557]">{alert.customer_token}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={alert.investigation_status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#3d4557]">
                        {new Date(alert.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/alerts/${alert.alert_id}`}
                        className="text-sm font-semibold text-[#0d7a6b] hover:text-[#0a6459] hover:underline"
                      >
                        Investigate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="px-6 py-4 border-t border-[#e9ecef] bg-[#f7f8fa] flex items-center justify-between">
            <span className="text-xs font-mono text-[#3d4557]">
              Page {pagination.page} of {pagination.total_pages}
            </span>
            <div className="flex gap-2">
              {pagination.page > 1 && (
                <Link
                  href={`/alerts?${new URLSearchParams({
                    ...(params.severity ? { severity: params.severity } : {}),
                    ...(params.status ? { status: params.status } : {}),
                    page: String(page - 1),
                  }).toString()}`}
                  className="px-3 py-1.5 text-sm border border-[#e9ecef] rounded-md text-[#3d4557] bg-white hover:border-[#0d7a6b] hover:text-[#0d7a6b] transition-colors"
                >
                  Previous
                </Link>
              )}
              {pagination.page < pagination.total_pages && (
                <Link
                  href={`/alerts?${new URLSearchParams({
                    ...(params.severity ? { severity: params.severity } : {}),
                    ...(params.status ? { status: params.status } : {}),
                    page: String(page + 1),
                  }).toString()}`}
                  className="px-3 py-1.5 text-sm border border-[#e9ecef] rounded-md text-[#3d4557] bg-white hover:border-[#0d7a6b] hover:text-[#0d7a6b] transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
