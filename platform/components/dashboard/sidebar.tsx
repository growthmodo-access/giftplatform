'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Zap, 
  BarChart3,
  Settings,
  LogOut,
  Gift,
  Menu,
  ChevronLeft,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'

interface MenuItem {
  icon: any
  label: string
  href: string
  allowedRoles: UserRole[]
}

const allMenuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { icon: Package, label: 'Products', href: '/products', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { icon: ShoppingCart, label: 'Orders', href: '/orders', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { icon: Users, label: 'Employees', href: '/employees', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR'] },
  { icon: Gift, label: 'Gifts', href: '/gifts', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { icon: Zap, label: 'Automation', href: '/automation', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER'] },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER'] },
  { icon: Settings, label: 'Settings', href: '/settings', allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
]

interface SidebarProps {
  userRole: UserRole
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => item.allowedRoles.includes(userRole))

  // Load collapsed state from localStorage on mount (desktop only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebar-collapsed')
      if (savedState !== null) {
        setIsCollapsed(JSON.parse(savedState))
      }
    }
  }, [])

  // Save collapsed state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed))
    }
  }, [isCollapsed])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen)
  }
  
  // Check if current path starts with any menu item href
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok || response.redirected) {
        if (response.redirected) {
          window.location.href = response.url
        } else {
          window.location.href = '/login'
        }
      } else {
        console.error('Logout error:', await response.text())
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/login'
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background shadow-lg border border-border hover:bg-accent transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-foreground" />
        ) : (
          <Menu className="w-5 h-5 text-foreground" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out fixed lg:sticky top-0 h-screen z-40",
        // Mobile: slide in/out
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        // Desktop: width based on collapsed state
        isCollapsed ? "w-16 lg:w-16" : "w-64 lg:w-64"
      )}>
        {/* Header */}
        <div className="p-4 lg:p-5 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className={cn(
              "flex items-center gap-2 transition-opacity duration-300",
              isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            )}>
              <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center flex-shrink-0">
                <span className="text-background font-semibold text-xs">G</span>
              </div>
              <span className="font-semibold text-sm text-foreground whitespace-nowrap">
                Goodies.so
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="lg:hidden h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
              {/* Desktop collapse button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hidden lg:flex h-8 w-8"
              >
                {isCollapsed ? (
                  <Menu className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-3 lg:p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-md transition-all group relative",
                  "hover:bg-muted active:scale-[0.98]",
                  active
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground",
                  isCollapsed && "justify-center lg:justify-center"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  active && "text-foreground"
                )} />
                <span className={cn(
                  "transition-opacity duration-300 whitespace-nowrap text-sm lg:text-base",
                  isCollapsed ? "opacity-0 w-0 overflow-hidden lg:opacity-0" : "opacity-100"
                )}>
                  {item.label}
                </span>
                {isCollapsed && (
                  <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-lg">
                    {item.label}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
        
        {/* Footer */}
        <div className="p-3 lg:p-4 border-t border-border flex-shrink-0">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-all active:scale-[0.98] group relative",
              isCollapsed && "justify-center lg:justify-center"
            )}
            title={isCollapsed ? "Log out" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={cn(
              "transition-opacity duration-300 whitespace-nowrap text-sm lg:text-base",
              isCollapsed ? "opacity-0 w-0 overflow-hidden lg:opacity-0" : "opacity-100"
            )}>
              Log out
            </span>
            {isCollapsed && (
              <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-lg">
                Log out
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
