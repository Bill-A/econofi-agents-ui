# TransactionMonitor — BSA/AML Compliance Dashboard

A demo compliance platform for community banks and credit unions to screen transactions for suspicious activity, manage BSA/AML alerts, and generate SAR (Suspicious Activity Report) narratives. Built with Next.js 16 and a Claude-powered backend detection engine.

![Alert Dashboard](https://via.placeholder.com/800x400?text=Alert+Dashboard+Screenshot)

---

## What it does

1. **Alert Dashboard** — displays paginated BSA/AML alerts with severity, risk scores, and investigation status. Each alert includes the regulatory citation (e.g., 31 USC §5324) that triggered it.
2. **Investigation workflow** — compliance officers update status (pending → in progress → SAR filed / no SAR warranted / false positive), add notes, and select a standardized closure reason code.
3. **SAR narrative generation** — one-click draft of a Suspicious Activity Report narrative, editable in-browser, exportable as a `.docx` Word document.
4. **Transaction screener** — ad-hoc single or batch transaction screening against the backend detection engine.
5. **Immutable audit trail** — every status change is recorded as an append-only event with actor, timestamp, and notes.

PII is tokenized before reaching the backend (`[PERSON_001]`, SHA-256 account hashes) so no real customer data is exposed to the AI layer.

---

## Prerequisites

| Requirement  | Version                                                |
| ------------ | ------------------------------------------------------ |
| Node.js      | 20+                                                    |
| npm          | 10+                                                    |
| Backend API  | Running at `http://localhost:3001` (see separate repo) |

---

## Installation

```bash
git clone <repo-url>
cd econofi-agents-ui
npm install
```

Copy the environment template and fill in values:

```bash
cp .env.example .env.local
```

---

## Environment variables

| Variable           | Default                                | Description                                                                          |
| ------------------ | -------------------------------------- | ------------------------------------------------------------------------------------ |
| `API_URL`          | `http://localhost:3001`                | Base URL of the BSA/AML backend API                                                  |
| `DEMO_JWT_SECRET`  | `fallback-secret-not-for-production`   | Secret used to sign demo JWTs (HS256). Use a strong random value outside local dev.  |

---

## Running locally

```bash
# Development (Turbopack)
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000). The app requires the backend to be running to display alerts or screen transactions.

---

## Running tests

```bash
npm test            # single run
npm run test:watch  # watch mode
```

Tests use Jest + React Testing Library. Key suites: `ScreenerForm`, `BatchScreenForm`, `AuditTrail`, `InvestigationForm`.

---

## Architecture

```text
app/                        # Next.js App Router pages
  page.tsx                  # Landing / onboarding guide
  alerts/
    page.tsx                # Alert list (server component)
    [alert_id]/
      page.tsx              # Alert detail (server component)
      InvestigationForm.tsx # Status/notes form (client component)
      actions.ts            # Server action: updateInvestigationStatus
  screen/
    page.tsx                # Transaction screener
    ScreenerForm.tsx        # Single-transaction form (client)
    BatchScreenForm.tsx     # Bulk upload form (client)
    actions.ts              # Server action: screenTransactionAction

components/                 # Shared UI
  SARNarrativePanel.tsx     # Editable SAR draft + Word export
  AuditTrail.tsx            # Status timeline
  ClosureReasonPanel.tsx    # Standardized closure reason picker
  Nav.tsx / Footer.tsx
  SeverityBadge.tsx / StatusBadge.tsx

lib/
  api.ts                    # REST wrapper around backend (auth, fetch, error handling)
  types.ts                  # TypeScript interfaces + enum label maps
```

**Patterns:**

- Pages are server components — data is fetched server-side via `lib/api.ts`
- Forms use server actions for mutations, avoiding a client-side API layer
- All backend requests carry a short-lived demo JWT (`sub: user-demo-001`, `role: compliance_officer`)

---

## Data model highlights

**Alert types:** `structuring`, `velocity_anomaly`, `round_dollar`, `geographic_risk`, `customer_deviation`, `multiple_indicators`

**Investigation statuses:** `pending` → `in_progress` → `sar_filed` | `no_sar_warranted` | `false_positive`

**Closure reason codes:** `tanda_cycle`, `documented_business_purpose`, `prior_cdd_review`, `seasonal_income`, `institutional_knowledge`, `insufficient_evidence`, `system_false_positive`, `other`

---

## Tech stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Framework        | Next.js 16 (App Router, Turbopack)  |
| Language         | TypeScript 5                        |
| Styling          | Tailwind CSS 4                      |
| Auth (demo)      | `jose` — HS256 JWT signing          |
| Document export  | `docx` — Word `.docx` generation    |
| Testing          | Jest 30, React Testing Library      |

---

## Demo data

The backend ships with four pre-seeded synthetic alerts covering common BSA/AML patterns. No real customer data is used. The home page walks through the recommended demo flow.
