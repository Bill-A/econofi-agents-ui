'use client';

import { useState } from 'react';

interface Identity {
  legalName: string;
  ssn: string;
  dob: string;
  address: string;
  accountNumber: string;
  accountType: string;
  relationshipSince: string;
}

// Synthetic demo identities keyed by customer_token.
// In production this panel calls a secured, audit-logged bank identity service.
const DEMO_IDENTITIES: Record<string, Identity> = {
  '[PERSON_001]': {
    legalName: 'Maria Elena Gonzalez',
    ssn: '***-**-4521',
    dob: 'Mar 15, 1978',
    address: '421 Maple Ave, Chicago IL 60614',
    accountNumber: 'CHK ****-4521',
    accountType: 'Personal Checking',
    relationshipSince: 'Jan 2019',
  },
  '[PERSON_002]': {
    legalName: 'James DeWitt Patterson',
    ssn: '***-**-8834',
    dob: 'Sep 22, 1965',
    address: '1847 Oak St, Oak Park IL 60301',
    accountNumber: 'CHK ****-8834',
    accountType: 'Business Checking',
    relationshipSince: 'Jun 2015',
  },
  '[PERSON_003]': {
    legalName: 'Sunita Krishnamurthy',
    ssn: '***-**-2267',
    dob: 'Nov 8, 1982',
    address: '305 Elm Dr, Evanston IL 60201',
    accountNumber: 'SAV ****-2267',
    accountType: 'Personal Savings',
    relationshipSince: 'Mar 2021',
  },
  '[PERSON_004]': {
    legalName: 'Roberto Sanz',
    ssn: '***-**-5590',
    dob: 'Jun 30, 1955',
    address: '88 Pine Rd, Cicero IL 60804',
    accountNumber: 'CHK ****-5590',
    accountType: 'Personal Checking',
    relationshipSince: 'Aug 2012',
  },
};

interface Props {
  customerToken: string;
  accountHash: string;
}

export function CustomerIdentityPanel({ customerToken, accountHash }: Props) {
  const [revealed, setRevealed] = useState(false);
  const identity = DEMO_IDENTITIES[customerToken];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f7f8fa]">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Customer Identity
        </h2>
        {!revealed && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="px-3 py-1.5 text-xs font-semibold bg-[#13204c] text-white rounded hover:bg-[#1c2f6b] transition-colors"
          >
            Reveal Identity
          </button>
        )}
      </div>

      {!revealed ? (
        <div className="px-5 py-6 text-center">
          <p className="text-sm text-gray-500 mb-1">Customer identity is masked.</p>
          <p className="text-xs text-gray-400">
            Reveal is logged to the audit trail for examiner review.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-amber-50 border-b border-amber-100 px-5 py-2">
            <p className="text-xs text-amber-700 font-medium">
              DEMO — Synthetic identity only. Production pulls from core banking identity service.
            </p>
          </div>
          {identity ? (
            <dl className="divide-y divide-gray-100">
              {[
                ['Legal Name', identity.legalName],
                ['SSN', identity.ssn],
                ['Date of Birth', identity.dob],
                ['Address', identity.address],
                ['Account', `${identity.accountNumber} — ${identity.accountType}`],
                ['Customer Since', identity.relationshipSince],
              ].map(([label, value]) => (
                <div key={label} className="px-5 py-3 flex justify-between items-baseline gap-4">
                  <dt className="text-xs text-gray-400 uppercase tracking-wide whitespace-nowrap">{label}</dt>
                  <dd className="text-sm font-medium text-gray-900 text-right">{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="px-5 py-6 text-center">
              <p className="text-sm text-gray-500">
                No identity mapping found for token{' '}
                <span className="font-mono">{customerToken}</span>.
              </p>
            </div>
          )}
          <div className="px-5 py-3 bg-[#f7f8fa] border-t border-gray-100">
            <p className="text-xs font-mono text-gray-400">
              Token: {customerToken} · Hash: {accountHash.slice(0, 12)}…
            </p>
          </div>
        </>
      )}
    </div>
  );
}
