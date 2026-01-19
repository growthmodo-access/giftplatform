import { CampaignsPageClient } from '@/components/campaigns/campaigns-page-client'
import { getCampaigns, getCampaignsManagement } from '@/actions/campaigns'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CampaignsPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get current user's role
  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const userRole = (currentUser?.role as 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE') || 'EMPLOYEE'

  const { data: campaigns, error } = await getCampaigns()
  
  // Get management view data for ADMIN and SUPER_ADMIN
  let managementCampaigns: any[] = []
  if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
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
