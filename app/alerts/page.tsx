import type { Metadata } from 'next';
import Link from 'next/link';
import { getAlerts, getAllAlerts } from '@/lib/api';
import { ALERT_TYPE_LABELS } from '@/lib/types';
import type { BsaAmlAlert } from '@/lib/types';
import { alertAgeDays, isAlertOpen, isOverdue } from '@/lib/utils';
import { SeverityBadge } from '@/components/SeverityBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { AlertFilters } from './AlertFilters';

export const metadata: Metadata = {
  title: 'Alert Dashboard | Econofi BSA/AML',
  description: 'BSA/AML alert management and investigation workflow.',
};

type SortBy = 'risk_score' | 'age' | 'severity';
type SortDir = 'asc' | 'desc';

const SEVERITY_ORDER: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

function sortAlerts(alerts: BsaAmlAlert[], sortBy: SortBy, sortDir: SortDir): BsaAmlAlert[] {
  return [...alerts].sort((a, b) => {
    let diff = 0;
    if (sortBy === 'risk_score') diff = a.risk_score - b.risk_score;
    else if (sortBy === 'age') diff = alertAgeDays(a.created_at) - alertAgeDays(b.created_at);
    else if (sortBy === 'severity')
      diff = (SEVERITY_ORDER[a.severity] ?? 0) - (SEVERITY_ORDER[b.severity] ?? 0);
    return sortDir === 'asc' ? diff : -diff;
  });
}

interface PageProps {
  searchParams: Promise<{ severity?: string; status?: string; page?: string; sortBy?: string; sortDir?: string }>;
}

function AgeCell({ alert }: { alert: BsaAmlAlert }) {
  const days = alertAgeDays(alert.created_at);
  const open = isAlertOpen(alert.investigation_status);
  const overdue = open && days > 25;

  if (overdue) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-red-600">{days}d</span>
        <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Overdue</span>
      </div>
    );
  }
  if (open && days > 15) {
    return <span className="text-base font-semibold text-amber-600">{days}d</span>;
  }
  return <span className="text-base text-[#3d4557]">{days}d</span>;
}

export default async function AlertsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const sortBy = (params.sortBy ?? 'risk_score') as SortBy;
  const sortDir = (params.sortDir ?? 'desc') as SortDir;
  const isOverdueFilter = params.status === 'overdue';

  const [pageResult, allAlerts] = await Promise.all([
    isOverdueFilter
      ? Promise.resolve(null)
      : getAlerts({ severity: params.severity, status: params.status, page, per_page: 25 }),
    getAllAlerts(),
  ]);

  let alerts: BsaAmlAlert[];
  let pagination: { total: number; page: number; per_page: number; total_pages: number };

  if (isOverdueFilter) {
    const filtered = allAlerts.filter(
      a => isOverdue(a) && (!params.severity || a.severity === params.severity),
    );
    alerts = sortAlerts(filtered, sortBy, sortDir);
    pagination = { total: filtered.length, page: 1, per_page: filtered.length, total_pages: 1 };
  } else {
    alerts = sortAlerts(pageResult!.alerts, sortBy, sortDir);
    pagination = pageResult!.pagination;
  }

  // KPI stats from all alerts
  const now = new Date();
  const pendingCritical = allAlerts.filter(
    a => a.severity === 'critical' && isAlertOpen(a.investigation_status),
  ).length;
  const overdueCount = allAlerts.filter(a => isOverdue(a)).length;
  const sarThisMonth = allAlerts.filter(a => {
    if (a.investigation_status !== 'sar_filed' || !a.investigation_completed_at) return false;
    const d = new Date(a.investigation_completed_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const closedWithDates = allAlerts.filter(
    a => !isAlertOpen(a.investigation_status) && a.investigation_completed_at,
  );
  const avgDaysToClose =
    closedWithDates.length > 0
      ? Math.round(
          closedWithDates.reduce((sum, a) => {
            return (
              sum +
              (new Date(a.investigation_completed_at!).getTime() - new Date(a.created_at).getTime()) /
                86_400_000
            );
          }, 0) / closedWithDates.length,
        )
      : null;

  const start = (page - 1) * 25 + 1;
  const end = Math.min(page * 25, pagination.total);

  return (
    <div className="px-6 lg:px-10 py-8">

      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#13204c] tracking-tight">BSA/AML Alert Dashboard</h1>
          <p className="mt-1 text-base text-[#3d4557]">
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

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-red-200 rounded-lg px-5 py-4">
          <p className="text-xs font-semibold text-red-500 uppercase tracking-wide">Pending Critical</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{pendingCritical}</p>
          <p className="text-xs text-red-400 mt-1">open &amp; critical severity</p>
        </div>
        <div className={`bg-white rounded-lg px-5 py-4 border ${overdueCount > 0 ? 'border-amber-300' : 'border-[#e9ecef]'}`}>
          <p className={`text-xs font-semibold uppercase tracking-wide ${overdueCount > 0 ? 'text-amber-600' : 'text-[#3d4557]'}`}>
            Overdue
          </p>
          <p className={`text-3xl font-bold mt-1 ${overdueCount > 0 ? 'text-amber-600' : 'text-[#13204c]'}`}>
            {overdueCount}
          </p>
          <p className="text-xs text-[#3d4557] mt-1">open &gt;25 days</p>
        </div>
        <div className="bg-white border border-[#0d7a6b]/30 rounded-lg px-5 py-4">
          <p className="text-xs font-semibold text-[#0d7a6b] uppercase tracking-wide">SARs This Month</p>
          <p className="text-3xl font-bold text-[#0d7a6b] mt-1">{sarThisMonth}</p>
          <p className="text-xs text-[#3d4557] mt-1">
            {now.toLocaleString('en-US', { month: 'long' })} {now.getFullYear()}
          </p>
        </div>
        <div className="bg-white border border-[#13204c]/20 rounded-lg px-5 py-4">
          <p className="text-xs font-semibold text-[#13204c] uppercase tracking-wide">Avg Days to Close</p>
          <p className="text-3xl font-bold text-[#13204c] mt-1">
            {avgDaysToClose !== null ? `${avgDaysToClose}d` : '—'}
          </p>
          <p className="text-xs text-[#3d4557] mt-1">closed alerts</p>
        </div>
      </div>

      {/* Alert count summary bar */}
      {pagination.total > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-base font-mono text-[#3d4557] bg-[#e6f4f2] border border-[#0d7a6b]/20 px-3 py-1.5 rounded-full">
            {pagination.total} alert{pagination.total !== 1 ? 's' : ''}
          </span>
          {(params.severity || params.status) && (
            <Link href="/alerts" className="text-base text-[#0d7a6b] hover:underline font-medium">
              Clear filters
            </Link>
          )}
        </div>
      )}

      {/* Overdue filter active banner */}
      {isOverdueFilter && (
        <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <span className="text-amber-600 font-semibold text-sm">⚠ Overdue filter active</span>
          <span className="text-amber-700 text-sm">Showing only open alerts past the 25-day SAR deadline. Closed alerts (SAR Filed, No SAR, False Positive) are hidden.</span>
          <Link href="/alerts" className="ml-auto text-sm font-semibold text-[#0d7a6b] hover:underline whitespace-nowrap">
            Show all alerts
          </Link>
        </div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-lg border border-[#e9ecef] shadow-sm overflow-hidden">

        {/* Filters bar */}
        <div className="px-6 py-3 border-b border-[#e9ecef] bg-[#f7f8fa] flex items-center justify-between">
          <AlertFilters severity={params.severity} status={params.status} />
          {pagination.total > 0 && (
            <span className="text-base text-[#3d4557] font-mono">
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
                  {[
                    { label: 'Alert ID', key: null },
                    { label: 'Type', key: null },
                    { label: 'Severity', key: 'severity' as SortBy },
                    { label: 'Risk', key: 'risk_score' as SortBy },
                    { label: 'Customer', key: null },
                    { label: 'Status', key: null },
                    { label: 'Age', key: 'age' as SortBy },
                  ].map(({ label, key }) => {
                    const isActive = key && sortBy === key;
                    const nextDir = isActive && sortDir === 'desc' ? 'asc' : 'desc';
                    const href = key
                      ? `/alerts?${new URLSearchParams({ ...(params.severity ? { severity: params.severity } : {}), ...(params.status ? { status: params.status } : {}), sortBy: key, sortDir: nextDir }).toString()}`
                      : undefined;
                    return (
                      <th key={label} className="px-6 py-4 text-left text-base font-semibold text-[#3d4557] uppercase tracking-wider bg-white">
                        {href ? (
                          <Link href={href} className={`inline-flex items-center gap-1 hover:text-[#13204c] transition-colors ${isActive ? 'text-[#13204c]' : ''}`}>
                            {label}
                            <span className="text-xs">{isActive ? (sortDir === 'desc' ? '↓' : '↑') : '↕'}</span>
                          </Link>
                        ) : label}
                      </th>
                    );
                  })}
                  <th className="px-6 py-4 bg-white" />
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert, i) => (
                  <tr
                    key={alert.id}
                    className={`border-b border-[#e9ecef] hover:bg-[#e6f4f2]/40 transition-colors ${
                      isOverdue(alert) ? 'bg-red-50/40' : i % 2 === 0 ? 'bg-white' : 'bg-[#f7f8fa]'
                    }`}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-base font-mono font-semibold text-[#1a1d26]">
                        {alert.alert_id}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-lg font-medium text-[#1a1d26]">{ALERT_TYPE_LABELS[alert.alert_type]}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <SeverityBadge severity={alert.severity} />
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-[#e9ecef] rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              alert.risk_score >= 80
                                ? 'bg-red-500'
                                : alert.risk_score >= 60
                                ? 'bg-amber-500'
                                : 'bg-[#0d7a6b]'
                            }`}
                            style={{ width: `${alert.risk_score}%` }}
                          />
                        </div>
                        <span className="text-lg font-semibold text-[#1a1d26] w-8 text-right">
                          {alert.risk_score}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-lg font-mono text-[#3d4557]">{alert.customer_token}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <StatusBadge status={alert.investigation_status} />
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <AgeCell alert={alert} />
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <Link
                        href={`/alerts/${alert.alert_id}`}
                        className="text-lg font-semibold text-[#0d7a6b] hover:text-[#0a6459] hover:underline"
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
