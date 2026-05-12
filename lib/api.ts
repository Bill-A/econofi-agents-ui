import { getDemoToken } from './auth';
import type { BsaAmlAlert, AlertListResponse, ScreeningResult } from './types';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string; details?: unknown } | null;
  meta: { request_id: string; bank_id: string; api_version: string; timestamp: string };
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  const token = await getDemoToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });
  return res.json() as Promise<ApiEnvelope<T>>;
}

export async function getAlerts(params: {
  severity?: string;
  status?: string;
  page?: number;
  per_page?: number;
}): Promise<AlertListResponse> {
  const query = new URLSearchParams();
  if (params.severity) query.set('severity', params.severity);
  if (params.status) query.set('status', params.status);
  query.set('page', String(params.page ?? 1));
  query.set('per_page', String(params.per_page ?? 25));

  const envelope = await apiFetch<AlertListResponse>(`/v1/alerts?${query.toString()}`);
  return envelope.data ?? { alerts: [], pagination: { total: 0, page: 1, per_page: 25, total_pages: 0 } };
}

export async function getAlert(alertId: string): Promise<BsaAmlAlert | null> {
  const envelope = await apiFetch<BsaAmlAlert>(`/v1/alerts/${alertId}`);
  return envelope.data;
}

export async function updateAlertStatus(
  alertId: string,
  update: { status: string; investigation_notes?: string; sar_reference_number?: string },
): Promise<{ success: boolean; error?: string }> {
  const envelope = await apiFetch<unknown>(`/v1/alerts/${alertId}`, {
    method: 'PATCH',
    body: JSON.stringify(update),
  });
  if (!envelope.success) {
    return { success: false, error: envelope.error?.message ?? 'Update failed' };
  }
  return { success: true };
}

export async function screenTransaction(transaction: unknown): Promise<ScreeningResult | null> {
  const envelope = await apiFetch<ScreeningResult>('/v1/transactions/screen', {
    method: 'POST',
    body: JSON.stringify({ transaction }),
  });
  return envelope.data;
}
