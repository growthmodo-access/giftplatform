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

  const userRole = (currentUser.role as 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE') || 'EMPLOYEE'
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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header 
          userName={userName}
          userEmail={userEmail}
          userInitials={userInitials}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="container-padding py-4 lg:py-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
