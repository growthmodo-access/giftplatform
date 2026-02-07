'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { Breadcrumbs } from './breadcrumbs'
import { KeyboardShortcuts } from './keyboard-shortcuts'

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'

interface DashboardShellProps {
  children: React.ReactNode
  userRole: UserRole
  userName: string
  userEmail: string
  userInitials: string
}

export function DashboardShell({
  children,
  userRole,
  userName,
  userEmail,
  userInitials,
}: DashboardShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-white overflow-hidden min-w-0">
      <Sidebar
        userRole={userRole}
        userName={userName}
        userEmail={userEmail}
        userInitials={userInitials}
        isMobileOpen={isMobileOpen}
        onMobileOpenChange={setIsMobileOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onOpenMobileMenu={() => setIsMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-white">
          <KeyboardShortcuts />
          <div className="w-full max-w-7xl mx-auto py-4 px-3 sm:px-5 sm:py-6 lg:px-8 lg:py-8 min-w-0">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
