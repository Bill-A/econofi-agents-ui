'use server';

import { screenTransaction, batchScreenTransactions } from '@/lib/api';
import type { ScreeningResult } from '@/lib/types';

export interface BatchScreenResult {
  batch_id: string;
  transactions_submitted: number;
  alerts_created: number;
  alerts: unknown[];
  error?: string;
  message?: string;
}

export async function batchScreenAction(json: string): Promise<BatchScreenResult> {
  let transactions: unknown[];
  try {
    transactions = JSON.parse(json) as unknown[];
  } catch {
    return { batch_id: '', transactions_submitted: 0, alerts_created: 0, alerts: [], error: 'INVALID_JSON', message: 'Invalid JSON — please check the format and try again.' };
  }

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return { batch_id: '', transactions_submitted: 0, alerts_created: 0, alerts: [], error: 'INVALID_REQUEST', message: 'Transactions must be a non-empty array.' };
  }

  return batchScreenTransactions(transactions);
}

export async function screenTransactionAction(formData: FormData): Promise<ScreeningResult | null> {
  const counterpartyCountry = (formData.get('counterparty_country') as string) || '';
  const transaction = {
    transaction_id: (formData.get('transaction_id') as string) || crypto.randomUUID(),
    account_hash: formData.get('account_hash') as string,
    customer_token: formData.get('customer_token') as string,
    amount: parseFloat(formData.get('amount') as string),
    transaction_type: formData.get('transaction_type') as string,
    transaction_date: formData.get('transaction_date') as string,
    is_online_banking: formData.get('is_online_banking') === 'true',
    ...(counterpartyCountry ? { counterparty_country: counterpartyCountry } : {}),
    metadata: {
      sanitized_at: new Date().toISOString(),
      sanitization_version: '1.0',
    },
  };

  return screenTransaction(transaction);
}
