import { AnalyticsPageClient } from '@/components/analytics/analytics-page-client'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AnalyticsPage() {
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

  if (userRole === 'EMPLOYEE') {
    redirect('/dashboard')
  }

  return (
    <AnalyticsPageClient 
      initialData={null}
      currentUserRole={userRole}
    />
  )
}
