import { CampaignsManagementClient } from '@/components/campaigns/campaigns-management-client'
import { getCampaignsManagement } from '@/actions/campaigns'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CampaignsManagementPage() {
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

  // Only ADMIN and SUPER_ADMIN can access this page
  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    redirect('/campaigns')
  }

  const { data: campaigns, error } = await getCampaignsManagement()

  return (
    <CampaignsManagementClient 
      campaigns={campaigns || []} 
      currentUserRole={userRole}
    />
  )
}
