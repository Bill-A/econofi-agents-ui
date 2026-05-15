import type { Metadata } from 'next';
import { ScreenTabs } from './ScreenTabs';

export const metadata: Metadata = {
  title: 'Transaction Screener | Econofi BSA/AML',
  description: 'Screen individual or batch transactions for BSA/AML patterns on demand.',
};

export default function ScreenPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#13204c] tracking-tight">Transaction Screener</h1>
        <p className="mt-1 text-base text-[#3d4557]">
          Screen sanitized transactions for BSA/AML patterns on demand.
        </p>
      </div>
      <ScreenTabs />
    </div>
  );
}
