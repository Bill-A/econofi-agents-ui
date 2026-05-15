import Link from 'next/link';
import { DemoGuide } from '@/components/DemoGuide';

const steps = [
  {
    number: '01',
    title: 'Open the Alert Dashboard',
    href: '/alerts',
    description:
      'This is your daily starting point. The dashboard shows every active BSA/AML alert scoped to your bank, filtered by severity or investigation status. Fifteen pre-seeded alerts across all five investigation statuses are ready to work.',
  },
  {
    number: '02',
    title: 'Investigate an Alert',
    href: '/alerts',
    description:
      'Click Investigate on any alert to see the full picture — suspicious indicators, risk score, regulatory citation, and recommended action. Update the investigation status and capture your notes as you work.',
  },
  {
    number: '03',
    title: 'Generate a SAR Narrative',
    href: '/alerts',
    description:
      'Set investigation status to SAR Filed and the SAR narrative panel appears automatically. The draft is pre-populated from the alert data, with placeholders highlighted for your review. Edit inline, then copy or download as a Word document.',
  },
  {
    number: '04',
    title: 'Screen a Specific Transaction',
    href: '/screen',
    description:
      'Use the Transaction Screener when you need to check a specific transaction on demand — a branch tip, a relationship manager referral, or a law enforcement inquiry. It runs the same detection engine as the automated system.',
  },
];

const scenarios = [
  {
    id: 'ALT-2026-05-11-00001',
    label: 'Structuring',
    severity: 'CRITICAL',
    severityColor: 'bg-red-50 text-red-700 border-red-200',
    riskScore: 91,
    riskColor: 'bg-red-500',
    citation: '31 USC §5324',
    description:
      'Three cash deposits deliberately kept below the $10,000 CTR threshold across multiple branches within a short window. Elevated to Critical — second structuring pattern on this customer within the quarter.',
    whatToLookFor: [
      'Deposits deliberately kept under $10,000',
      'Multiple branches within a short window',
      'Prior structuring alert on same customer this quarter',
    ],
    action: 'File SAR',
  },
  {
    id: 'ALT-2026-05-05-00001',
    label: 'Velocity Anomaly',
    severity: 'CRITICAL',
    severityColor: 'bg-red-50 text-red-700 border-red-200',
    riskScore: 94,
    riskColor: 'bg-red-500',
    citation: '31 USC §5318(g)',
    description:
      '11 outbound wire transfers totaling $284,000 in a 48-hour window — 6× the account\'s 6-month baseline. All wires to four previously unused counterparty accounts with no supporting documentation.',
    whatToLookFor: [
      'Volume far above account baseline',
      'New, unknown counterparties',
      'No business documentation on file',
    ],
    action: 'Escalate Immediately',
  },
  {
    id: 'ALT-2026-05-06-00001',
    label: 'Geographic Risk',
    severity: 'MEDIUM',
    severityColor: 'bg-amber-50 text-amber-700 border-amber-200',
    riskScore: 62,
    riskColor: 'bg-amber-500',
    citation: '31 CFR Part 560',
    description:
      'Wire transfers to a high-risk jurisdiction flagged under OFAC SDN monitoring. Customer has no documented international business relationships on file.',
    whatToLookFor: [
      'Destination country on OFAC/FATF watchlist',
      'No international business history',
      'OFAC SDN cross-reference required',
    ],
    action: 'Investigate',
  },
  {
    id: 'ALT-2026-05-07-00001',
    label: 'Round Dollar',
    severity: 'HIGH',
    severityColor: 'bg-orange-50 text-orange-700 border-orange-200',
    riskScore: 73,
    riskColor: 'bg-orange-400',
    citation: '31 CFR §1020.320',
    description:
      'Six consecutive round-dollar wire transfers ($5,000 / $10,000 / $15,000 / $20,000 / $10,000 / $5,000) over 9 days, all to a single previously unknown counterparty. Account opened 6 weeks prior.',
    whatToLookFor: [
      'Exact round-dollar amounts — rare in legitimate wire activity',
      'Single new counterparty receiving all transfers',
      'New account consistent with layering setup',
    ],
    action: 'File SAR',
  },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

      {/* Hero */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-[#13204c] bg-[#e6f0fb] border border-[#13204c]/20 px-2.5 py-1 rounded-full tracking-widest uppercase">
            BSA/AML · TransactionMonitor
          </span>
          <span className="text-xs font-mono font-semibold text-white bg-[#b45309] border border-[#b45309] px-2.5 py-1 rounded-full tracking-widest uppercase">
            Demo
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#13204c] tracking-tight leading-tight">
          Every suspicious transaction flagged. Every decision documented.<br />
          <span className="text-[#0d7a6b]">Your BSA program, exam-ready.</span>
        </h1>
        <p className="text-[17px] text-[#3d4557] leading-relaxed max-w-2xl">
          TransactionMonitor screens transactions against BSA/AML patterns in real time and builds an immutable
          audit trail your examiners can follow — structuring, velocity anomalies, round-dollar transfers,
          and geographic risk, each with a regulatory citation and recommended action.
        </p>
        <div className="flex items-center gap-4 pt-2">
          <Link
            href="/alerts"
            className="inline-flex items-center px-5 py-2.5 bg-[#0d7a6b] text-white text-sm font-semibold rounded-md hover:bg-[#0a6459] transition-colors shadow-sm"
          >
            Open Alert Dashboard
          </Link>
          <Link
            href="/screen"
            className="inline-flex items-center px-5 py-2.5 border border-[#0d7a6b] text-[#0d7a6b] text-sm font-semibold rounded-md hover:bg-[#e6f4f2] transition-colors"
          >
            Screen a Transaction
          </Link>
        </div>
      </section>

      {/* How to use */}
      <section>
        <h2 className="text-2xl font-bold text-[#13204c] mb-2">How to use this app</h2>
        <p className="text-base text-[#3d4557] mb-6">
          The Alert Dashboard is your primary workspace. The Transaction Screener is a secondary tool for on-demand spot checks.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {steps.map((step) => (
            <Link
              key={step.number}
              href={step.href}
              className="group block bg-white rounded-lg border border-[#e9ecef] p-6 hover:border-[#0d7a6b] hover:shadow-sm transition-all"
            >
              <div className="text-2xl font-mono font-bold text-[#0d7a6b] mb-3">{step.number}</div>
              <h3 className="text-lg font-bold text-[#13204c] mb-2 group-hover:text-[#0d7a6b] transition-colors">
                {step.title}
              </h3>
              <p className="text-base text-[#3d4557] leading-relaxed">{step.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Demo guide */}
      <DemoGuide />

      {/* Pre-seeded scenarios */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#13204c]">Featured alerts in the dashboard</h2>
          <p className="mt-1 text-sm text-[#3d4557]">
            Fifteen alerts are pre-loaded across all five investigation statuses. Four key patterns are highlighted below — each with real regulatory citations and synthetic transaction data.
          </p>
        </div>
        <div className="space-y-4">
          {scenarios.map((s) => (
            <Link
              key={s.id}
              href={`/alerts/${s.id}`}
              className="block bg-white rounded-lg border border-[#e9ecef] p-6 hover:border-[#0d7a6b] hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold uppercase tracking-widest border ${s.severityColor}`}>
                    {s.severity}
                  </span>
                  <h3 className="text-base font-bold text-[#13204c]">{s.label}</h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-20 bg-[#e9ecef] rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${s.riskColor}`} style={{ width: `${s.riskScore}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-[#1a1d26] w-6">{s.riskScore}</span>
                </div>
              </div>

              <p className="text-sm text-[#3d4557] leading-relaxed mb-4">{s.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#3d4557] uppercase tracking-wider mb-2">What to look for</p>
                  <ul className="space-y-1">
                    {s.whatToLookFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#3d4557]">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0d7a6b] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-xs font-semibold text-[#3d4557] uppercase tracking-wider mb-1">Regulatory basis</p>
                    <span className="text-xs font-mono bg-[#f7f8fa] border border-[#e9ecef] text-[#13204c] px-2 py-0.5 rounded">
                      {s.citation}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#3d4557] uppercase tracking-wider mb-1">Recommended action</p>
                    <span className="text-xs font-semibold text-[#0d7a6b]">{s.action}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#3d4557] uppercase tracking-wider mb-1">Alert ID</p>
                    <span className="text-xs font-mono text-[#3d4557]">{s.id}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PII note */}
      <section className="bg-[#e6f4f2] border border-[#0d7a6b]/20 rounded-lg px-6 py-5">
        <h3 className="text-sm font-bold text-[#13204c] mb-1">PII Sanitization</h3>
        <p className="text-sm text-[#3d4557] leading-relaxed">
          All customer data passed to the detection engine is tokenized before processing. No names, SSNs, or account
          numbers are sent to Claude. Customer identifiers appear as{' '}
          <span className="font-mono bg-white border border-[#e9ecef] px-1 rounded text-xs">[PERSON_001]</span> and
          account numbers as SHA-256 hashes. This is a hard architectural constraint, not a configuration option.
        </p>
      </section>

    </div>
  );
}
