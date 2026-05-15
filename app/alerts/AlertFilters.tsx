'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface Props {
  severity?: string;
  status?: string;
}

export function AlertFilters({ severity, status }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`/alerts?${params.toString()}`);
    },
    [router, searchParams],
  );

  const selectClass =
    'text-sm border border-[#e9ecef] rounded-md px-3 py-1.5 bg-white text-[#3d4557] focus:outline-none focus:ring-2 focus:ring-[#0d7a6b]/40 focus:border-[#0d7a6b] transition-colors';

  return (
    <div className="flex items-center gap-3">
      <select
        value={severity ?? ''}
        onChange={(e) => updateFilter('severity', e.target.value)}
        className={selectClass}
      >
        <option value="">All Severities</option>
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={status ?? ''}
        onChange={(e) => updateFilter('status', e.target.value)}
        className={selectClass}
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="sar_filed">SAR Filed</option>
        <option value="no_sar_warranted">No SAR Warranted</option>
        <option value="false_positive">False Positive</option>
        <option value="overdue">Overdue (&gt;25 days open)</option>
      </select>
    </div>
  );
}
