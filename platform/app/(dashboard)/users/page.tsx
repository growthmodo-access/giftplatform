import { UsersManagementClient } from '@/components/users/users-management-client'
import { getAllUsers } from '@/actions/users'
import { getCachedAuth } from '@/lib/auth-server'
import { toAppRole } from '@/lib/roles'
import { redirect } from 'next/navigation'

export default async function UsersPage() {
  const auth = await getCachedAuth()
  if (!auth) redirect('/login')

  const userRole = toAppRole(auth.currentUser.role)
  if (userRole !== 'SUPER_ADMIN') redirect('/dashboard')

  const { data: users, error } = await getAllUsers()

  return (
    <UsersManagementClient 
      users={users || []} 
    />
  )
}
