import { CampaignsPageClient } from '@/components/campaigns/campaigns-page-client'
import { getCampaigns } from '@/actions/campaigns'
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

  const { data: campaigns, error } = await getCampaigns()

  return (
    <CampaignsPageClient 
      campaigns={campaigns || []} 
      currentUserRole={(currentUser?.role as 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE') || 'EMPLOYEE'}
    />
  )
}
