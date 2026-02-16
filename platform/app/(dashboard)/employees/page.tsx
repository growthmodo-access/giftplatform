import { EmployeesPageClient } from '@/components/employees/employees-page-client'
import { getEmployees } from '@/actions/employees'
import { getCachedAuth } from '@/lib/auth-server'
import { toAppRole } from '@/lib/roles'
import { redirect } from 'next/navigation'

export default async function EmployeesPage() {
  const auth = await getCachedAuth()
  if (!auth) redirect('/login')

  const userRole = toAppRole(auth.currentUser.role)
  if (userRole !== 'SUPER_ADMIN' && userRole !== 'HR') redirect('/dashboard')

  const { data: employees } = await getEmployees()

  return (
    <EmployeesPageClient
      employees={employees || []}
      currentUserRole={userRole}
      currentUserId={auth.user.id}
    />
  )
}
