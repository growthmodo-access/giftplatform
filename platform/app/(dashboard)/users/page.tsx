import { UsersManagementClient } from '@/components/users/users-management-client'
import { getAllUsers } from '@/actions/users'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function UsersPage() {
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

  // Only SUPER_ADMIN can access this page
  if (userRole !== 'SUPER_ADMIN') {
    redirect('/dashboard')
  }

  const { data: users, error } = await getAllUsers()

  return (
    <UsersManagementClient 
      users={users || []} 
    />
  )
}
