import { AnalyticsPageClient } from '@/components/analytics/analytics-page-client'
import { getCachedAuth } from '@/lib/auth-server'
import { toAppRole } from '@/lib/roles'
import { redirect } from 'next/navigation'

export default async function AnalyticsPage() {
  const auth = await getCachedAuth()
  if (!auth) redirect('/login')

  const userRole = toAppRole(auth.currentUser.role)
  if (userRole === 'EMPLOYEE') redirect('/dashboard')

  return (
    <AnalyticsPageClient
      initialData={null}
      currentUserRole={userRole}
    />
  )
}
