import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Econofi BSA/AML',
  description: 'About Econofi TransactionMonitor — BSA/AML compliance automation for community banks.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12 space-y-12">

      <section>
        <p className="text-xs font-mono font-semibold text-[#0d7a6b] uppercase tracking-widest mb-3">About</p>
        <h1 className="text-3xl font-bold text-[#13204c] tracking-tight mb-4">
          Econofi TransactionMonitor
        </h1>
        <p className="text-base text-[#3d4557] leading-relaxed">
          TransactionMonitor is an AI-assisted BSA/AML compliance platform built for community banks and credit unions —
          particularly Minority Depository Institutions (MDIs) and CDFIs that serve underbanked communities and face
          the same regulatory expectations as larger institutions with a fraction of the compliance staff.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          {
            label: 'Detection Engine',
            body: 'Screens transactions against six BSA/AML pattern families — structuring, velocity anomalies, round-dollar transfers, geographic risk, customer deviation, and multi-indicator combinations — each with a regulatory citation.',
          },
          {
            label: 'Investigation Workflow',
            body: 'Compliance officers manage alert status from pending through resolution, with structured closure reason codes, immutable audit events, and SAR narrative drafting built into the same screen.',
          },
          {
            label: 'SAR Narrative Generation',
            body: 'Claude-powered SAR draft generation, pre-populated from alert data with highlighted placeholders for officer review. Exportable as a Word document for FinCEN submission.',
          },
          {
            label: 'PII Architecture',
            body: 'Customer data is tokenized before reaching the AI layer. No names, SSNs, or account numbers are ever sent to the detection engine or narrative generator.',
          },
        ].map(({ label, body }) => (
          <div key={label} className="bg-white rounded-lg border border-[#e9ecef] p-6">
            <h2 className="text-sm font-semibold text-[#13204c] uppercase tracking-wide mb-2">{label}</h2>
            <p className="text-sm text-[#3d4557] leading-relaxed">{body}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-bold text-[#13204c] mb-3">Regulatory Coverage</h2>
        <div className="bg-white rounded-lg border border-[#e9ecef] overflow-hidden">
          {[
            ['31 USC §5324', 'Structuring to evade CTR reporting requirements'],
            ['31 USC §5318(g)', 'Suspicious activity reporting obligations'],
            ['31 CFR §1020.320', 'SAR filing requirements for banks'],
            ['31 CFR Part 560', 'OFAC Iran transactions regulations'],
            ['31 CFR Part 1010', 'General BSA provisions'],
          ].map(([citation, description], i) => (
            <div key={citation} className={`px-5 py-3 flex items-baseline gap-4 ${i > 0 ? 'border-t border-[#e9ecef]' : ''}`}>
              <span className="text-sm font-mono font-semibold text-[#13204c] shrink-0">{citation}</span>
              <span className="text-sm text-[#3d4557]">{description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#e9ecef] pt-8">
        <h2 className="text-lg font-bold text-[#13204c] mb-1">Built by Agile Innovation Labs</h2>
        <p className="text-sm text-[#3d4557] leading-relaxed mb-4">
          Agile Innovation Labs LLC is a fintech studio focused on AI-native compliance and lending tools
          for community financial institutions. Econofi is our flagship platform.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/alerts"
            className="px-4 py-2 bg-[#0d7a6b] text-white text-sm font-semibold rounded-md hover:bg-[#0a6459] transition-colors"
          >
            Open Alert Dashboard
          </Link>
          <Link
            href="https://econofi.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#0d7a6b] hover:underline"
          >
            econofi.app →
          </Link>
        </div>
      </section>

    </div>
  );
}
