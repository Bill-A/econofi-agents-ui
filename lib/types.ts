export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AlertType =
  | 'structuring'
  | 'velocity_anomaly'
  | 'round_dollar'
  | 'geographic_risk'
  | 'customer_deviation'
  | 'multiple_indicators';

export type InvestigationStatus =
  | 'pending'
  | 'in_progress'
  | 'sar_filed'
  | 'no_sar_warranted'
  | 'false_positive';

export type RecommendedAction = 'monitor' | 'investigate' | 'file_sar' | 'escalate_immediately';

export const CLOSURE_REASON_CODES = [
  'tanda_cycle',
  'documented_business_purpose',
  'prior_cdd_review',
  'seasonal_income',
  'institutional_knowledge',
  'insufficient_evidence',
  'system_false_positive',
  'other',
] as const;

export type ClosureReasonCode = (typeof CLOSURE_REASON_CODES)[number];

export const CLOSURE_REASON_LABELS: Record<ClosureReasonCode, string> = {
  tanda_cycle: 'Tanda Cycle / Informal Savings',
  documented_business_purpose: 'Documented Business Purpose',
  prior_cdd_review: 'Prior CDD Review',
  seasonal_income: 'Seasonal Income',
  institutional_knowledge: 'Institutional Knowledge',
  insufficient_evidence: 'Insufficient Evidence',
  system_false_positive: 'System False Positive',
  other: 'Other',
};

export interface FlaggedTransaction {
  transaction_id: string;
  amount: number;
  transaction_type: string;
  transaction_date: string;
  is_online_banking: boolean;
}

export interface BsaAmlAlert {
  id: string;
  alert_id: string;
  account_hash: string;
  customer_token: string;
  risk_score: number;
  alert_type: AlertType;
  severity: AlertSeverity;
  transactions_flagged: FlaggedTransaction[];
  suspicious_indicators: string[];
  regulatory_citation: string;
  recommended_action: RecommendedAction;
  confidence_score: number | null;
  false_positive_probability: number | null;
  created_at: string;
  expires_at: string;
  assigned_to: string | null;
  investigation_status: InvestigationStatus;
  investigation_notes: string | null;
  investigation_completed_at: string | null;
  sar_reference_number: string | null;
  closure_reason_code: string | null;
  closure_reason_detail: string | null;
}

export interface AlertEvent {
  id: string;
  alert_id: string;
  event_type: string;
  from_status: string | null;
  to_status: string;
  notes: string | null;
  closure_reason_code: string | null;
  actor: string | null;
  created_at: string;
}

export interface AlertListResponse {
  alerts: BsaAmlAlert[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface SuspiciousActivityAlert {
  alert_id: string;
  account_hash: string;
  customer_token: string;
  risk_score: number;
  alert_type: AlertType;
  severity: AlertSeverity;
  suspicious_indicators: string[];
  regulatory_citation: string;
  recommended_action: RecommendedAction;
  confidence_score: number;
  false_positive_probability: number;
  expires_at: string;
}

export interface ScreeningResult {
  alert: SuspiciousActivityAlert | null;
  screening_id: string;
  checked_patterns: string[];
  processing_ms?: number;
}

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  structuring: 'Structuring',
  velocity_anomaly: 'Velocity Anomaly',
  round_dollar: 'Round Dollar',
  geographic_risk: 'Geographic Risk',
  customer_deviation: 'Customer Deviation',
  multiple_indicators: 'Multiple Indicators',
};

export const RECOMMENDED_ACTION_LABELS: Record<RecommendedAction, string> = {
  monitor: 'Monitor',
  investigate: 'Investigate',
  file_sar: 'File SAR',
  escalate_immediately: 'Escalate Immediately',
};

export const INVESTIGATION_STATUS_LABELS: Record<InvestigationStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  sar_filed: 'SAR Filed',
  no_sar_warranted: 'No SAR Warranted',
  false_positive: 'False Positive',
};
