import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAlert, getAlertEvents, getAllAlerts } from '@/lib/api';
import { ALERT_TYPE_LABELS, RECOMMENDED_ACTION_LABELS } from '@/lib/types';
import { SeverityBadge } from '@/components/SeverityBadge';
import { StatusBadge } from '@/components/StatusBadge';
import { AuditTrail } from '@/components/AuditTrail';
import { FlaggedTransactionsPanel } from '@/components/FlaggedTransactionsPanel';
import { CustomerIdentityPanel } from '@/components/CustomerIdentityPanel';
import { CustomerAlertHistory } from '@/components/CustomerAlertHistory';
import { InvestigationForm } from './InvestigationForm';
import { PrintButton } from '@/components/PrintButton';

interface PageProps {
  params: Promise<{ alert_id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { alert_id: alertId } = await params;
  const alert = await getAlert(alertId);
  if (!alert) return { title: 'Alert Not Found | Econofi' };
  const typeLabel = alert.alert_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${alertId} · ${typeLabel} | Econofi BSA/AML`,
    description: `${alert.severity.toUpperCase()} severity BSA/AML alert — Risk score ${alert.risk_score}/100`,
  };
}

export default async function AlertDetailPage({ params }: PageProps) {
  const { alert_id: alertId } = await params;
  const [alert, events, allAlerts] = await Promise.all([
    getAlert(alertId),
    getAlertEvents(alertId),
    getAllAlerts(),
  ]);

  if (alert === null) {
    notFound();
  }

  const relatedAlerts = allAlerts.filter(
    a => a.customer_token === alert.customer_token && a.alert_id !== alertId,
  );

  const confidencePct = alert.confidence_score !== null ? `${alert.confidence_score}%` : 'N/A';
  const fpPct = alert.false_positive_probability !== null
    ? `${Math.round(alert.false_positive_probability * 100)}%`
    : 'N/A';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Print-only case file header */}
      <div className="print-header">
        <p className="text-xs font-mono font-bold uppercase tracking-widest">Econofi BSA/AML — Case File</p>
        <p className="text-xs font-mono text-gray-600">Alert: {alertId} · Generated: {new Date().toLocaleString('en-US')}</p>
        <p className="text-xs text-gray-500 mt-1">CONFIDENTIAL — For authorized compliance personnel only. Not a filed SAR.</p>
      </div>

      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href="/alerts" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <span aria-hidden>←</span> Back to Alert Dashboard
        </Link>
        <PrintButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Left column — alert detail */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-mono text-gray-400 mb-1">{alertId}</p>
                <h1 className="text-xl font-semibold text-gray-900">
                  {ALERT_TYPE_LABELS[alert.alert_type]}
                </h1>
              </div>
              <SeverityBadge severity={alert.severity} />
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wide">Risk Score</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${alert.risk_score >= 80 ? 'bg-red-500' : alert.risk_score >= 60 ? 'bg-orange-400' : 'bg-yellow-400'}`}
                      style={{ width: `${alert.risk_score}%` }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900">{alert.risk_score}/100</span>
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wide">Confidence</span>
                <p className="font-medium text-gray-900 mt-0.5">{confidencePct}</p>
              </div>
              <div>
                <span className="text-gray-400 text-xs uppercase tracking-wide">False Positive</span>
                <p className="font-medium text-gray-900 mt-0.5">{fpPct}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Suspicious Indicators
            </h2>
            <ul className="space-y-2">
              {alert.suspicious_indicators.map((indicator, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400" />
                  {indicator}
                </li>
              ))}
            </ul>
          </div>

          <FlaggedTransactionsPanel transactions={alert.transactions_flagged} />

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Regulatory Basis
            </h2>
            <p className="text-sm text-gray-700 font-mono bg-gray-50 rounded p-3 border border-gray-100">
              {alert.regulatory_citation}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Subject Account
            </h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Customer Token</dt>
                <dd className="font-mono text-gray-900">{alert.customer_token}</dd>
              </div>
              <div>
                <dt className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Account Hash</dt>
                <dd className="font-mono text-gray-500 text-xs truncate">{alert.account_hash}</dd>
              </div>
              <div>
                <dt className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Recommended Action</dt>
                <dd className="font-medium text-gray-900">{RECOMMENDED_ACTION_LABELS[alert.recommended_action]}</dd>
              </div>
              <div>
                <dt className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Alert Created</dt>
                <dd className="text-gray-700">
                  {new Date(alert.created_at).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right column — investigation + identity + history */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Investigation
              </h2>
              <StatusBadge status={alert.investigation_status} />
            </div>
            <InvestigationForm
              alertId={alertId}
              currentStatus={alert.investigation_status}
              currentNotes={alert.investigation_notes}
              alert={alert}
            />
          </div>

          {alert.investigation_completed_at !== null && (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-sm text-gray-600">
              <span className="font-medium">Completed:</span>{' '}
              {new Date(alert.investigation_completed_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric',
              })}
            </div>
          )}

          <CustomerIdentityPanel
            customerToken={alert.customer_token}
            accountHash={alert.account_hash}
          />

          <CustomerAlertHistory
            relatedAlerts={relatedAlerts}
            customerToken={alert.customer_token}
          />

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
              Audit Trail
            </h2>
            <AuditTrail events={events} />
          </div>
        </div>
      </div>
    </div>
  );
}
