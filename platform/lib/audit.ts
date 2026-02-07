'use server'

import { createClient } from '@/lib/supabase/server'

export type AuditAction =
  | 'campaign.create'
  | 'campaign.update'
  | 'campaign.delete'
  | 'order.create'
  | 'order.update'
  | 'vendor.assign'
  | 'vendor.assignment.update'

export type AuditResourceType = 'campaign' | 'order' | 'order_vendor_assignment'

/**
 * Append-only audit log. Call after successful create/update/assign.
 * Only SUPER_ADMIN can read audit_log (RLS).
 */
export async function insertAuditLog(
  userId: string,
  action: AuditAction,
  resourceType: AuditResourceType,
  resourceId: string,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.from('audit_log').insert({
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details: details ?? null,
    })
  } catch {
    // Don't fail the main action if audit write fails
  }
}
