import type { BsaAmlAlert, AlertType } from './types';
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
  const accountShort = alert.account_hash.slice(0, 8) + '...';
  const alertDate = new Date(alert.created_at).toLocaleDateString('en-US', {
    month: '2-digit', day: '2-digit', year: 'numeric',
  });
  const mdiContext = MDI_CONTEXT[alert.alert_type][institutionType];
  const indicatorLines = alert.suspicious_indicators
    .map((ind) => `  • ${ind}`)
    .join('\n');

  return `SUBJECT OF SUSPICIOUS ACTIVITY

[INSTITUTION NAME — REVIEW REQUIRED] files this Suspicious Activity Report regarding ${alert.customer_token}, holder of account ${accountShort}. Alert ID: ${alert.alert_id}.

DESCRIPTION OF SUSPICIOUS ACTIVITY

Alert classification: ${alertTypeLabel} — Risk Score ${alert.risk_score}/100.

The following suspicious indicators were identified by the monitoring system on ${alertDate}:

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
