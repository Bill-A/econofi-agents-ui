'use server';

import { screenTransaction } from '@/lib/api';
import type { ScreeningResult } from '@/lib/types';

export async function screenTransactionAction(formData: FormData): Promise<ScreeningResult | null> {
  const transaction = {
    transaction_id: (formData.get('transaction_id') as string) || crypto.randomUUID(),
    account_hash: formData.get('account_hash') as string,
    customer_token: formData.get('customer_token') as string,
    amount: parseFloat(formData.get('amount') as string),
    transaction_type: formData.get('transaction_type') as string,
    transaction_date: formData.get('transaction_date') as string,
    is_online_banking: formData.get('is_online_banking') === 'true',
    metadata: {
      sanitized_at: new Date().toISOString(),
      sanitization_version: '1.0',
    },
  };

  return screenTransaction(transaction);
}
