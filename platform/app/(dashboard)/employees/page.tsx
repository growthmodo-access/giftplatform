import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { EmployeesList } from '@/components/employees/employees-list'
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600 mt-1">Manage your team members</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
          <CardDescription>View and manage team members</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeesList 
            employees={employees || []} 
            currentUserRole={currentUser?.role || 'EMPLOYEE'}
            currentUserId={user.id}
          />
        </CardContent>
      </Card>
    </div>
  )
}
