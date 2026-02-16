import { AutomationPageClient } from '@/components/campaigns/automation-page-client'
import { getCampaigns } from '@/actions/campaigns'
import { getCachedAuth } from '@/lib/auth-server'
import { toAppRole } from '@/lib/roles'
import { redirect } from 'next/navigation'

export default async function AutomationPage() {
  const auth = await getCachedAuth()
  if (!auth) redirect('/login')

  const { data: campaigns } = await getCampaigns()
  const userRole = toAppRole(auth.currentUser.role)

  return (
    <AutomationPageClient
      campaigns={campaigns || []}
      currentUserRole={userRole}
    />
  )
}
