import type { BsaAmlAlert, InvestigationStatus } from './types';

const OPEN_STATUSES = new Set<InvestigationStatus>(['pending', 'in_progress']);
const SAR_DEADLINE_DAYS = 25;

export function alertAgeDays(createdAt: string): number {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000);
}

export function isAlertOpen(status: InvestigationStatus): boolean {
  return OPEN_STATUSES.has(status);
}

export function isOverdue(alert: Pick<BsaAmlAlert, 'investigation_status' | 'created_at'>): boolean {
  return isAlertOpen(alert.investigation_status) && alertAgeDays(alert.created_at) > SAR_DEADLINE_DAYS;
}

export function daysTillDeadline(createdAt: string): number {
  return SAR_DEADLINE_DAYS - alertAgeDays(createdAt);
}
