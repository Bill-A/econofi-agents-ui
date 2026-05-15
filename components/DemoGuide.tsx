'use client';

import { useState } from 'react';

const steps = [
  {
    time: '0:00 – 0:30',
    tool: 'TransactionMonitor',
    toolUrl: 'econofi-demo.netlify.app',
    heading: 'Select institution type',
    actions: [
      'Open econofi-demo.netlify.app in a browser tab — have it ready before the demo starts.',
      'Pick Bank or Credit Union. This choice drives the MDI context paragraphs and institution name throughout.',
    ],
    lookFor: [],
  },
  {
    time: '0:30 – 1:00',
    tool: 'TransactionMonitor',
    toolUrl: 'econofi-demo.netlify.app',
    heading: 'Walk the transaction feed',
    actions: [
      'Point out the 7 highlighted rows — explain that 7 individual transactions belong to 3 distinct patterns.',
      'The badge reads "3 patterns requiring review" — not 7 — because the BSA officer investigates patterns, not individual transactions.',
      'Click any row in the structuring group (account ****4821).',
    ],
    lookFor: [
      'Same account number across three rows — three branches, five days.',
      'Every amount stays just under $10,000.',
    ],
  },
  {
    time: '1:00 – 2:00',
    tool: 'TransactionMonitor',
    toolUrl: 'econofi-demo.netlify.app',
    heading: 'Flag detail — pattern and MDI context',
    actions: [
      'Read the pattern summary aloud: "$9,200 / $9,400 / $9,150 — three branches, five days, never hits the $10K CTR threshold."',
      'Point to the MDI context card. This is the differentiator — read the first sentence.',
      'Click "Generate SAR Draft".',
    ],
    lookFor: [
      'MDI context paragraph — this is what makes Econofi different from generic AML tools. A community bank BSA officer needs to consider tanda cycles, payroll patterns, and diaspora cash behavior before filing.',
      'Regulatory basis line — cites the actual statute (31 USC §5324), not generic language.',
    ],
  },
  {
    time: '2:00 – 2:45',
    tool: 'TransactionMonitor',
    toolUrl: 'econofi-demo.netlify.app',
    heading: 'SAR draft',
    actions: [
      'Point to the amber placeholders — these are the sections requiring the officer\'s review.',
      'Click "Copy to clipboard" or "Download Word doc" to show the export options.',
    ],
    lookFor: [
      'Draft is pre-populated from the alert data — officer fills in the highlighted sections, not the whole narrative.',
      'DRAFT banner at the top — filing is always the institution\'s responsibility.',
    ],
  },
  {
    time: '2:45 – 3:00',
    tool: 'Alert Dashboard',
    toolUrl: 'econofi-bsa-dashboard.netlify.app/alerts',
    heading: 'Transition to the investigation queue',
    actions: [
      'Switch to the econofi-bsa-dashboard.netlify.app tab.',
      'Say: "In production, when patterns like these are detected automatically, they surface here in the BSA officer\'s investigation queue. This is where the daily work happens."',
    ],
    lookFor: [],
    note: 'Do not say "the system just created this alert." TransactionMonitor and the Alert Dashboard do not share live data — the alerts were pre-loaded. Frame the switch as showing the other side of the workflow, not a live result.',
  },
  {
    time: '3:00 – 3:45',
    tool: 'Alert Dashboard',
    toolUrl: 'econofi-bsa-dashboard.netlify.app/alerts',
    heading: 'Walk the alert list',
    actions: [
      'Point out severity color coding (Critical / High / Medium) and the risk score bars.',
      'Show the status filter — use it to filter to Pending only, then clear it.',
      'Click "Investigate" on ALT-2026-05-11-00001 — the CRITICAL structuring alert, risk score 91, at the top of the list.',
    ],
    lookFor: [
      '15 alerts across all five statuses — pending, in progress, SAR filed, no SAR warranted, false positive.',
      'Resolved alerts (SAR Filed, No SAR Warranted) show the full lifecycle — not just open items.',
      'Risk scores reflect confidence in the pattern, not just amount.',
    ],
  },
  {
    time: '3:45 – 4:45',
    tool: 'Alert Detail',
    toolUrl: 'econofi-bsa-dashboard.netlify.app/alerts/ALT-2026-05-11-00001',
    heading: 'Investigate and generate the SAR narrative',
    actions: [
      'Walk the suspicious indicators and regulatory citation — three branches, three consecutive days, never hits $10K.',
      'In the Investigation panel, change status to "SAR Filed" — the SAR narrative panel appears automatically.',
      'Point to the filing deadline at the top of the draft and the no tipping off warning.',
      'Toggle Bank / Credit Union to show the narrative adapts.',
      'Click inside the narrative to show inline editing.',
      'Click "Download Word doc".',
    ],
    lookFor: [
      'Narrative opens with the no tipping off prohibition and the 30/60-day filing deadline — compliance guardrails, not just a text template.',
      'Transaction chronology is auto-generated from the flagged transactions — dates, amounts, branch vs online.',
      'Bank/CU toggle changes the MDI context paragraph — same differentiator, different surface.',
    ],
  },
  {
    time: '4:45 – 5:00',
    tool: 'Close',
    toolUrl: null,
    heading: 'Closing line',
    actions: [
      '"Detection to filing — in one workflow. MDI context built in, not bolted on. No manual template maintenance."',
      'Ask: "What does your current SAR narrative process look like?"',
    ],
    lookFor: [],
  },
];

export function DemoGuide() {
  const [open, setOpen] = useState(false);

  return (
    <section className="border border-[#e9ecef] rounded-lg overflow-hidden">

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 bg-[#f7f8fa] hover:bg-[#eef0f5] transition-colors text-left"
      >
        <div>
          <span className="text-lg font-bold text-[#13204c]">Demo Guide</span>
          <span className="ml-3 text-sm font-mono text-[#3d4557]">5-minute walkthrough — what to do and what to look for</span>
        </div>
        <span className="text-[#3d4557] text-lg font-light select-none">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="divide-y divide-[#e9ecef]">
          {steps.map((step, i) => (
            <div key={i} className="px-6 py-5 bg-white">

              <div className="flex items-start gap-4 mb-3">
                <span className="shrink-0 font-mono text-sm text-white bg-[#13204c] px-2.5 py-1 rounded mt-0.5">
                  {step.time}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h3 className="text-base font-bold text-[#13204c]">{step.heading}</h3>
                    {step.toolUrl && (
                      <span className="text-sm font-mono text-[#00a4b4] bg-[#f0fafa] border border-[#c0e8ec] px-2 py-0.5 rounded">
                        {step.tool}
                      </span>
                    )}
                    {!step.toolUrl && step.tool !== 'Close' && (
                      <span className="text-sm font-mono text-[#3d4557]">{step.tool}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={`grid gap-4 ${step.lookFor.length > 0 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
                <div>
                  <p className="text-sm font-semibold text-[#3d4557] uppercase tracking-wider mb-1.5">Actions</p>
                  <ol className="space-y-1.5">
                    {step.actions.map((action, j) => (
                      <li key={j} className="flex items-start gap-2 text-base text-[#3d4557]">
                        <span className="shrink-0 font-mono text-sm text-[#0d7a6b] font-bold mt-0.5">{j + 1}.</span>
                        {action}
                      </li>
                    ))}
                  </ol>
                </div>

                {step.lookFor.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-[#0d7a6b] uppercase tracking-wider mb-1.5">What to look for</p>
                    <ul className="space-y-1.5">
                      {step.lookFor.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-base text-[#3d4557]">
                          <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-[#0d7a6b]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {step.note && (
                <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                  <span className="text-amber-500 text-sm shrink-0">⚠</span>
                  <p className="text-sm text-amber-800 leading-relaxed">{step.note}</p>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </section>
  );
}
