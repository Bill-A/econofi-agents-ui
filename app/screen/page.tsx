import { ScreenerForm } from './ScreenerForm';

export default function ScreenPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Transaction Screener</h1>
        <p className="mt-1 text-sm text-gray-500">
          Screen a sanitized transaction for BSA/AML patterns before it enters the alert queue.
        </p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <ScreenerForm />
      </div>
    </div>
  );
}
