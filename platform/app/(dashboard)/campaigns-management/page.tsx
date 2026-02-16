import { CampaignsManagementClient } from '@/components/campaigns/campaigns-management-client'
import { getCampaignsManagement } from '@/actions/campaigns'
import { getCachedAuth } from '@/lib/auth-server'
import { toAppRole } from '@/lib/roles'
import { redirect } from 'next/navigation'

export default async function CampaignsManagementPage() {
  const auth = await getCachedAuth()
  if (!auth) redirect('/login')

  const userRole = toAppRole(auth.currentUser.role)
  if (userRole !== 'SUPER_ADMIN') redirect('/campaigns')

  const { data: campaigns } = await getCampaignsManagement()

  return (
    <CampaignsManagementClient
      campaigns={campaigns || []}
      currentUserRole="SUPER_ADMIN"
    />
  )
}
