import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { Breadcrumbs } from '@/components/dashboard/breadcrumbs'
import { KeyboardShortcuts } from '@/components/dashboard/keyboard-shortcuts'
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
    <div className="flex h-screen bg-white overflow-hidden min-w-0">
      <Sidebar
        userRole={userRole}
        userName={userName}
        userEmail={userEmail}
        userInitials={userInitials}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 pl-0 sm:pl-16 lg:pl-0">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
          <KeyboardShortcuts />
          <div className="w-full max-w-7xl mx-auto py-4 pl-14 pr-14 sm:px-5 sm:py-6 lg:px-8 lg:py-8 min-w-0">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
