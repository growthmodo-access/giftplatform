import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
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

  if (currentUserError || !currentUser) {
    // If user profile not found, redirect to login
    redirect('/login')
  }

  // Get role from database - should already be one of the valid UserRole types
  const rawRole = currentUser.role
  
  // Log the raw role value for debugging
  console.log('[Layout] Raw role from database:', {
    rawRole,
    type: typeof rawRole,
    isNull: rawRole === null,
    isUndefined: rawRole === undefined,
    stringValue: String(rawRole),
    userEmail: currentUser.email
  })
  
  // Validate and normalize role
  const userRole: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE' = (() => {
    // Handle null/undefined
    if (!rawRole) {
      console.warn('[Layout] Role is null/undefined, defaulting to EMPLOYEE for:', currentUser.email)
      return 'EMPLOYEE'
    }
    
    const validRoles = ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] as const
    const roleStr = String(rawRole).trim()
    
    // Direct match (most common case) - exact string match
    if (validRoles.includes(roleStr as any)) {
      console.log('[Layout] Role matched exactly:', roleStr)
      return roleStr as 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
    }
    
    // Case-insensitive fallback
    const upperRole = roleStr.toUpperCase()
    if (upperRole === 'SUPER_ADMIN') {
      console.log('[Layout] Role matched (uppercase): SUPER_ADMIN')
      return 'SUPER_ADMIN'
    }
    if (upperRole === 'ADMIN') return 'ADMIN'
    if (upperRole === 'HR') return 'HR'
    if (upperRole === 'MANAGER') return 'MANAGER'
    if (upperRole === 'EMPLOYEE') return 'EMPLOYEE'
    
    // Log warning and default
    console.error('[Layout] Unknown role value:', roleStr, 'for user:', currentUser.email, 'defaulting to EMPLOYEE')
    return 'EMPLOYEE'
  })()
  
  // Debug logging
  console.log('[Layout] Role normalization result:', {
    rawRole,
    normalizedRole: userRole,
    userEmail: currentUser.email,
    match: rawRole === userRole,
    isSuperAdmin: userRole === 'SUPER_ADMIN'
  })
  
  // If user expects SUPER_ADMIN but got EMPLOYEE, log a warning
  if (userRole === 'EMPLOYEE' && rawRole && String(rawRole).trim().toUpperCase() !== 'EMPLOYEE') {
    console.error('[Layout] WARNING: Role normalization issue!', {
      rawRole,
      normalizedRole: userRole,
      userEmail: currentUser.email,
      message: 'If you expected SUPER_ADMIN, check the database role value'
    })
  }
  
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
    <div className="flex h-screen bg-[#fafafa] overflow-hidden">
      <Sidebar userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header 
          userName={userName}
          userEmail={userEmail}
          userInitials={userInitials}
        />
        <main className="flex-1 overflow-y-auto bg-[#fafafa]">
          <div className="container-padding py-6 lg:py-8 max-w-7xl mx-auto px-4 lg:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
