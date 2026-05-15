import type { BsaAmlAlert, AlertType, FlaggedTransaction } from './types';
import { ALERT_TYPE_LABELS } from './types';

const PLACEHOLDER_RE = /\[[A-Z][^\[\]]*— REVIEW REQUIRED\]/g;

export function parseNarrative(text: string): Array<{ type: 'text' | 'placeholder'; value: string }> {
  const segments: Array<{ type: 'text' | 'placeholder'; value: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  PLACEHOLDER_RE.lastIndex = 0;
  while ((match = PLACEHOLDER_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'placeholder', value: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }
  return segments;
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatLongDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: '2-digit', day: '2-digit', year: 'numeric',
  });
}

function formatTransactionType(type: string): string {
  return type.replace(/_/g, ' ');
}

function sortedTransactions(txns: FlaggedTransaction[]): FlaggedTransaction[] {
  return [...txns].sort(
    (a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime(),
  );
}

function buildTransactionChronology(txns: FlaggedTransaction[]): string {
  return sortedTransactions(txns)
    .map((txn, i) => {
      const channel = txn.is_online_banking ? 'via online banking' : 'at a branch';
      return `  (${i + 1}) ${formatLongDate(txn.transaction_date)}: ${formatCurrency(txn.amount)} ${formatTransactionType(txn.transaction_type)} ${channel} (ID: ${txn.transaction_id})`;
    })
    .join('\n');
}

function getActivityDateRange(txns: FlaggedTransaction[]): { from: string; to: string } {
  const sorted = sortedTransactions(txns);
  return {
    from: formatShortDate(sorted[0].transaction_date),
    to: formatShortDate(sorted[sorted.length - 1].transaction_date),
  };
}

function getTotalAmount(txns: FlaggedTransaction[]): string {
  return formatCurrency(txns.reduce((sum, t) => sum + t.amount, 0));
}

const MDI_CONTEXT: Record<AlertType, Record<'bank' | 'credit_union', string>> = {
  structuring: {
    bank: 'Cash-primary customers at community institutions may conduct multiple smaller deposits for legitimate reasons — payroll cycles, informal savings groups, or business cash handling. Verify the account relationship and customer profile before concluding structuring intent.',
    credit_union: 'At credit unions serving cash-primary member communities, sub-threshold cash deposits may reflect tanda/susu participation, seasonal business activity, or informal savings. Review member relationship and account history before filing.',
  },
  velocity_anomaly: {
    bank: 'Dormant account reactivations at MDIs often reflect legitimate returning customers — diaspora members, seasonal workers, or customers recovering from hardship. Investigate source of funds and circumstances before filing.',
    credit_union: 'Member accounts frequently show dormancy during hardship, job transition, or time abroad. Sudden reactivation may reflect a life event. Review member history and the stated purpose of any inbound transfer before filing.',
  },
  geographic_risk: {
    bank: 'MDIs with international customer bases conduct legitimate remittance and trade activity to FATF-listed jurisdictions. The listing alone does not establish suspicious activity. Investigate stated purpose, counterparty identity, and consistency with documented account behavior.',
    credit_union: 'Credit unions serving diaspora communities regularly process wires to high-risk jurisdictions as routine remittance. FATF listing is a risk indicator, not a filing trigger. Review member history and stated purpose.',
  },
  round_dollar: {
    bank: 'Round-dollar wire or ACH patterns may reflect routine business disbursements, payroll, or vendor payments. Verify whether the pattern is consistent with the account holder\'s stated business activity before filing.',
    credit_union: 'Round-dollar ACH patterns at credit unions may reflect legitimate payroll processing or scheduled loan disbursements. Review member business profile and account purpose before concluding the pattern is suspicious.',
  },
  customer_deviation: {
    bank: 'Customer deviation alerts at MDIs may reflect legitimate life changes — new employment, business expansion, or community organization activity. Document the investigation of any provided explanation thoroughly.',
    credit_union: 'Significant deviation from member baseline at community credit unions may reflect legitimate changes in financial circumstances. Review member relationship history and any explanations provided.',
  },
  multiple_indicators: {
    bank: 'Multiple-indicator alerts require careful investigation of each pattern independently. At MDIs, individually explainable patterns may appear suspicious in combination. Document the investigation of each indicator and the rationale for the filing decision.',
    credit_union: 'Multiple-indicator alerts at credit unions require independent review of each flag. Ensure investigation notes address each indicator and document why the combination, considered as a whole, warrants filing.',
  },
};

export function generateNarrative(alert: BsaAmlAlert, institutionType: 'bank' | 'credit_union'): string {
  const alertTypeLabel = ALERT_TYPE_LABELS[alert.alert_type];
  const alertDate = formatShortDate(alert.created_at);
  const mdiContext = MDI_CONTEXT[alert.alert_type][institutionType];
  const indicatorLines = alert.suspicious_indicators.map((ind) => `  • ${ind}`).join('\n');

  const txns = alert.transactions_flagged;
  const chronology = txns.length > 0 ? buildTransactionChronology(txns) : '  [NO TRANSACTIONS AVAILABLE — REVIEW REQUIRED]';
  const dateRange = txns.length > 0 ? getActivityDateRange(txns) : { from: '[START DATE — REVIEW REQUIRED]', to: '[END DATE — REVIEW REQUIRED]' };
  const totalAmount = txns.length > 0 ? getTotalAmount(txns) : '[TOTAL AMOUNT — REVIEW REQUIRED]';

  return `SUBJECT OF SUSPICIOUS ACTIVITY

IMPORTANT: ${alert.customer_token} is a system-assigned privacy token. Before filing, replace with the subject's full legal name, SSN/TIN, date of birth, address, and account number from your institution's records and de-tokenization vault. Do not submit this document with token references.

[INSTITUTION NAME — REVIEW REQUIRED] files this Suspicious Activity Report regarding [SUBJECT FULL NAME — REVIEW REQUIRED], holder of account [ACCOUNT NUMBER — REVIEW REQUIRED]. System reference: ${alert.customer_token}. Alert ID: ${alert.alert_id}.

Activity period: ${dateRange.from} through ${dateRange.to}
Total dollar amount involved: ${totalAmount}

PRIOR SAR FILINGS

[PRIOR SAR REFERENCE — REVIEW REQUIRED: Enter any prior SAR filing number(s) for this subject at this institution. If no prior SARs exist, state "No prior SARs on file for this subject."]

DESCRIPTION OF SUSPICIOUS ACTIVITY

Alert classification: ${alertTypeLabel} — Risk Score ${alert.risk_score}/100.

The following transactions were identified during the activity period:

${chronology}

The following suspicious indicators were identified by the automated monitoring system on ${alertDate}:

${indicatorLines}

Regulatory basis: ${alert.regulatory_citation}

MDI CONTEXT — REVIEW BEFORE FILING

${mdiContext}

INVESTIGATION CONDUCTED

Upon identification of this activity, [INSTITUTION NAME — REVIEW REQUIRED]'s BSA Officer conducted the following investigation:

  (1) Account and customer review: [DESCRIBE ACCOUNT HISTORY AND CDD FINDINGS — REVIEW REQUIRED]

  (2) Transaction pattern review: [DESCRIBE PRIOR TRANSACTION PATTERNS AND BASELINE — REVIEW REQUIRED]

  (3) Customer contact: [DESCRIBE INQUIRY AND ANY EXPLANATION PROVIDED — REVIEW REQUIRED]

  (4) Community and relationship context: [MDI/COMMUNITY CONTEXT ASSESSMENT — REVIEW REQUIRED]

BASIS FOR FILING

Based on the foregoing investigation, [INSTITUTION NAME — REVIEW REQUIRED] has determined that the activity described above warrants SAR filing. The pattern is consistent with ${alertTypeLabel.toLowerCase()} as defined under ${alert.regulatory_citation}. [SPECIFIC BASIS FOR FILING — REVIEW REQUIRED] No innocent explanation was identified after investigation.

FILING INSTITUTION

[INSTITUTION NAME — REVIEW REQUIRED]
[INSTITUTION ADDRESS — REVIEW REQUIRED]
BSA Officer: [BSA OFFICER NAME/TITLE — REVIEW REQUIRED]
Contact: [CONTACT INFORMATION — REVIEW REQUIRED]
SAR Filing Date: [SAR FILING DATE — REVIEW REQUIRED]`;
}
