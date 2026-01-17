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

  // Get current user's role to check permissions
  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const { data: employees, error } = await getEmployees()

  return (
    <EmployeesPageClient 
      employees={employees || []}
      currentUserRole={currentUser?.role || 'EMPLOYEE'}
      currentUserId={user.id}
    />
  )
}
