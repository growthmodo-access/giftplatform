import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getOpsSummary, getOpsCampaigns } from '@/actions/ops'
import { OpsPageClient } from '@/components/ops/ops-page-client'

export default async function OpsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: currentUser } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (currentUser?.role !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  const [summary, { data: campaigns, error }] = await Promise.all([
    getOpsSummary(),
    getOpsCampaigns(),
  ])

  return (
    <OpsPageClient
      summary={summary}
      campaigns={campaigns || []}
      error={error || null}
    />
  )
}
