import { appendFileSync } from 'fs'
import path from 'path'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { getCachedAuth } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

const workspaceRoot = process.cwd().endsWith('platform') ? path.join(process.cwd(), '..') : process.cwd()
const DEBUG_LOG_PATH = path.join(workspaceRoot, '.cursor', 'debug.log')
function agentLog(payload: Record<string, unknown>) {
  try {
    appendFileSync(DEBUG_LOG_PATH, JSON.stringify(payload) + '\n')
  } catch {
    // ignore
  }
}

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await getCachedAuth()
  if (!auth) redirect('/login')
  const { user, currentUser } = auth

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
  const userEmail = currentUser.email ?? user.email ?? ''

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
