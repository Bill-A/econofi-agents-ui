'use server';

import { updateAlertStatus } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export interface ActionState {
  error: string | null;
  success: boolean;
}

export async function updateInvestigationStatus(
  alertId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const status = formData.get('status') as string;
  const notes = formData.get('investigation_notes') as string | null;
  const sarRef = formData.get('sar_reference_number') as string | null;

  const result = await updateAlertStatus(alertId, {
    status,
    investigation_notes: notes ?? undefined,
    sar_reference_number: sarRef ?? undefined,
  });

  if (!result.success) {
    return { error: result.error ?? 'Update failed', success: false };
  }

  revalidatePath(`/alerts/${alertId}`);
  revalidatePath('/alerts');
  return { error: null, success: true };
}
