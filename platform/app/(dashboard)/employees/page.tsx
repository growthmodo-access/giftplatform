import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmployeesPageClient } from '@/components/employees/employees-page-client'
import { getEmployees } from '@/actions/employees'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function EmployeesPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: currentUser, error: userError } = await supabase
    .from('users')
    .select('role, company_id')
    .eq('id', user.id)
    .single()

  const userRole = (currentUser?.role as 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE') || 'EMPLOYEE'
  if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN' && userRole !== 'HR') {
    redirect('/dashboard')
  }

  const { data: employees, error } = await getEmployees()

  return (
    <EmployeesPageClient 
      employees={employees || []}
      currentUserRole={userRole}
      currentUserId={user.id}
    />
  )
}
