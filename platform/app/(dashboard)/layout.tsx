import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get current user's role and profile data
  const { data: currentUser, error: currentUserError } = await supabase
    .from('users')
    .select('role, name, email')
    .eq('id', user.id)
    .maybeSingle()

  if (currentUserError) {
    console.error('[Layout] Error fetching user profile:', currentUserError)
    // Redirect to login with error message
    redirect('/login?error=profile_error')
  }

  if (!currentUser) {
    console.error('[Layout] User profile not found for user:', user.id, user.email)
    // Redirect to login with error message
    redirect('/login?error=profile_not_found')
  }

  // Get role from database and normalize it
  const rawRole = currentUser.role
  
  // Validate and normalize role
  const userRole: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE' = (() => {
    // Handle null/undefined
    if (!rawRole) {
      return 'EMPLOYEE'
    }
    
    const validRoles = ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] as const
    const roleStr = String(rawRole).trim()
    
    // Direct match (most common case) - exact string match
    if (validRoles.includes(roleStr as any)) {
      return roleStr as 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
    }
    
    // Case-insensitive fallback
    const upperRole = roleStr.toUpperCase()
    if (upperRole === 'SUPER_ADMIN') return 'SUPER_ADMIN'
    if (upperRole === 'ADMIN') return 'ADMIN'
    if (upperRole === 'HR') return 'HR'
    if (upperRole === 'MANAGER') return 'MANAGER'
    if (upperRole === 'EMPLOYEE') return 'EMPLOYEE'
    
    // Default fallback
    return 'EMPLOYEE'
  })()
  
  const userName = currentUser.name || user.email?.split('@')[0] || 'User'
  const userEmail = currentUser.email || user.email || ''

  // Generate initials for avatar
  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return email[0]?.toUpperCase() || 'U'
  }

  const userInitials = getInitials(currentUser.name, userEmail)

  return (
    <DashboardShell
      userRole={userRole}
      userName={userName}
      userEmail={userEmail}
      userInitials={userInitials}
    >
      {children}
    </DashboardShell>
  )
}
