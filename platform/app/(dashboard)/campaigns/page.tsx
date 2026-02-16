import { CampaignsPageClient } from '@/components/campaigns/campaigns-page-client'
import { getCampaigns, getCampaignsManagement } from '@/actions/campaigns'
import { getCachedAuth } from '@/lib/auth-server'
import { toAppRole } from '@/lib/roles'
import { redirect } from 'next/navigation'

export default async function CampaignsPage() {
  const auth = await getCachedAuth()
  if (!auth) redirect('/login')

  const userRole = toAppRole(auth.currentUser.role)
  const { data: campaigns } = await getCampaigns()

  let managementCampaigns: any[] = []
  if (userRole === 'SUPER_ADMIN') {
    const { data: mgmtData } = await getCampaignsManagement()
    managementCampaigns = mgmtData || []
  }

  return (
    <CampaignsPageClient
      campaigns={campaigns || []}
      managementCampaigns={managementCampaigns}
      currentUserRole={userRole}
    />
  )
}
