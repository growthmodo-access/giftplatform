'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type AuditLogEntry = {
  id: string
  user_id: string | null
  action: string
  resource_type: string
  resource_id: string | null
  details: Record<string, unknown> | null
  created_at: string
  user_email?: string | null
}

/** Get audit log (SUPER_ADMIN only). */
export async function getAuditLog(limit = 100): Promise<{ data: AuditLogEntry[]; error?: string }> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) redirect('/login')

    const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (currentUser?.role !== 'SUPER_ADMIN') return { data: [], error: 'Forbidden' }

    const { data: rows, error } = await supabase
      .from('audit_log')
      .select('id, user_id, action, resource_type, resource_id, details, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) return { data: [], error: error.message }
    if (!rows?.length) return { data: [], error: null }

    const userIds = [...new Set((rows as { user_id: string | null }[]).map((r) => r.user_id).filter(Boolean))] as string[]
    const { data: users } = userIds.length
      ? await supabase.from('users').select('id, email').in('id', userIds)
      : { data: [] }
    const emailMap = new Map((users ?? []).map((u) => [u.id, u.email]))

    const data: AuditLogEntry[] = (rows ?? []).map((r) => ({
      id: r.id,
      user_id: r.user_id,
      action: r.action,
      resource_type: r.resource_type,
      resource_id: r.resource_id,
      details: r.details,
      created_at: r.created_at,
      user_email: r.user_id ? emailMap.get(r.user_id) ?? null : null,
    }))
    return { data, error: null }
  } catch (e) {
    return { data: [], error: e instanceof Error ? e.message : 'Failed to load audit log' }
  }
}
