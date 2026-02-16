'use server'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export type CachedUserRow = { id: string; role: string | null; company_id: string | null; name: string | null; email: string | null }

/**
 * Request-scoped cache: one getUser + one users row per request.
 * Use in layout and server actions to avoid duplicate auth round-trips.
 */
export const getCachedAuth = cache(async (): Promise<{ user: { id: string; email?: string }; currentUser: CachedUserRow } | null> => {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  const { data: currentUser } = await supabase
    .from('users')
    .select('id, role, company_id, name, email')
    .eq('id', user.id)
    .maybeSingle()
  if (!currentUser) return null
  return { user: { id: user.id, email: user.email }, currentUser }
})
