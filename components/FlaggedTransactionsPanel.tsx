import type { FlaggedTransaction } from '@/lib/types';

const TX_TYPE_LABELS: Record<string, string> = {
  cash_deposit: 'Cash Deposit',
  cash_withdrawal: 'Cash Withdrawal',
  wire_in: 'Wire In',
  wire_out: 'Wire Out',
  ach_credit: 'ACH Credit',
  ach_debit: 'ACH Debit',
  check: 'Check',
  atm_withdrawal: 'ATM Withdrawal',
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

interface Props {
  transactions: FlaggedTransaction[];
}

export function FlaggedTransactionsPanel({ transactions }: Props) {
  if (transactions.length === 0) return null;

  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-[#f7f8fa] flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Flagged Transactions
        </h2>
        <span className="text-xs font-mono text-[#3d4557] bg-white border border-[#e9ecef] px-2 py-1 rounded">
          {transactions.length} txn{transactions.length !== 1 ? 's' : ''} · {formatAmount(total)}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-[#f7f8fa]">
            <tr>
              {['Transaction ID', 'Type', 'Amount', 'Date', 'Channel'].map(h => (
                <th
                  key={h}
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <tr key={tx.transaction_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                  {tx.transaction_id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                  {TX_TYPE_LABELS[tx.transaction_type] ?? tx.transaction_type}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap tabular-nums">
                  {formatAmount(tx.amount)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {formatDate(tx.transaction_date)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      tx.is_online_banking
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tx.is_online_banking ? 'Online' : 'Branch'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
