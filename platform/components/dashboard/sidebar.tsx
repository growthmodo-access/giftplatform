'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  X,
  Building2,
  CreditCard
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
  { icon: Gift, label: 'Gifts', href: '/gifts', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { icon: CreditCard, label: 'Billing', href: '/billing', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { icon: Users, label: 'Employees', href: '/employees', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR'] },
  { icon: Zap, label: 'Campaigns', href: '/campaigns', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER'] },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER'] },
  { icon: Building2, label: 'Companies', href: '/companies', allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
  { icon: Users, label: 'Users', href: '/users', allowedRoles: ['SUPER_ADMIN'] },
  { icon: Settings, label: 'Settings', href: '/settings', allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
]

interface SidebarProps {
  userRole: UserRole
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Validate role and ensure it's a valid UserRole type
  const normalizedRole: UserRole = (() => {
    if (!userRole) {
      return 'EMPLOYEE'
    }
    
    // Ensure it's a valid UserRole type
    const validRoles: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER', 'EMPLOYEE']
    if (validRoles.includes(userRole as UserRole)) {
      return userRole as UserRole
    }
    
    // Fallback if role doesn't match exactly
    return 'EMPLOYEE'
  })()

  const menuItems = allMenuItems.filter(item => item.allowedRoles.includes(normalizedRole))

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle sidebar with Cmd/Ctrl + B
      if ((e.metaKey || e.ctrlKey) && e.key === 'b' && window.innerWidth >= 1024) {
        e.preventDefault()
        toggleSidebar()
      }
      // Close mobile menu with Escape
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileOpen, isCollapsed])

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
        className="lg:hidden fixed top-4 left-4 z-[60] p-2.5 rounded-lg bg-background border border-border/50 hover:bg-muted transition-all shadow-md hover:shadow-lg active:scale-95"
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
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-md z-[45] transition-opacity animate-in fade-in duration-200"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-white/95 backdrop-blur-lg border-r border-[#F8F3EC]/50 flex flex-col transition-all duration-300 ease-in-out shadow-sm",
        // Mobile: fixed positioning with slide animation
        "lg:sticky fixed top-0 h-screen z-[50]",
        // Mobile: slide in/out
        "lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        // Desktop: width based on collapsed state
        isCollapsed ? "w-16 lg:w-16" : "w-64 lg:w-64"
      )}>
        {/* Header */}
        <div className="p-3 lg:p-4 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard"
              className={cn(
                "flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-80 flex-shrink-0",
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              )}
            >
              <Image
                src="/logogoodies.png"
                alt="Goodies Logo"
                width={200}
                height={100}
                className="h-6 lg:h-8 xl:h-10 w-auto object-contain"
                priority
                unoptimized
              />
            </Link>
            <div className="flex items-center gap-1.5">
              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="lg:hidden h-8 w-8 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
              {/* Desktop collapse button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hidden lg:flex h-8 w-8 hover:bg-muted"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
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
        <nav className="flex-1 p-2 lg:p-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
                  "hover:bg-muted/60 active:scale-[0.98]",
                  active
                    ? "bg-[#F8F3EC] text-[#7B61FF] font-semibold shadow-sm border-l-2 border-[#7B61FF]"
                    : "text-muted-foreground hover:text-[#7B61FF] hover:bg-[#F8F3EC]/50",
                  isCollapsed && "justify-center lg:justify-center"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full transition-all",
                  active ? "bg-[#7B61FF] opacity-100" : "bg-transparent opacity-0"
                )} />
                <Icon className={cn(
                  "w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 transition-all",
                  active
                    ? "text-[#7B61FF] scale-110"
                    : "text-muted-foreground group-hover:text-[#7B61FF] group-hover:scale-105"
                )} />
                <span className={cn(
                  "transition-opacity duration-300 whitespace-nowrap text-sm font-medium",
                  isCollapsed ? "opacity-0 w-0 overflow-hidden lg:opacity-0" : "opacity-100"
                )}>
                  {item.label}
                </span>
                {isCollapsed && (
                  <div className="hidden lg:block absolute left-full ml-3 px-3 py-2 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 whitespace-nowrap shadow-xl">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-foreground border-b-4 border-b-transparent"></div>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      
        {/* Footer */}
        <div className="p-3 lg:p-4 border-t border-border/50 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/60 hover:text-foreground w-full transition-all active:scale-[0.98] group relative",
              isCollapsed && "justify-center lg:justify-center"
            )}
            title={isCollapsed ? "Log out" : undefined}
          >
            <LogOut className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 transition-transform group-hover:rotate-[-15deg]" />
            <span className={cn(
              "transition-opacity duration-300 whitespace-nowrap text-sm font-medium",
              isCollapsed ? "opacity-0 w-0 overflow-hidden lg:opacity-0" : "opacity-100"
            )}>
              Log out
            </span>
            {isCollapsed && (
              <div className="hidden lg:block absolute left-full ml-3 px-3 py-2 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 whitespace-nowrap shadow-xl">
                Log out
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-r-4 border-r-foreground border-b-4 border-b-transparent"></div>
              </div>
            )}
          </button>
      </div>
    </aside>
    </>
  )
}
