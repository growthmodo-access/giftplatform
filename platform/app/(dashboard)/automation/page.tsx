import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AutomationPageClient } from '@/components/campaigns/automation-page-client'
import { getCampaigns } from '@/actions/campaigns'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AutomationPage() {
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
    .single()

  const { data: campaigns, error } = await getCampaigns()

  return (
    <AutomationPageClient 
      campaigns={campaigns || []} 
      currentUserRole={currentUser?.role || 'EMPLOYEE'}
    />
  )
}
