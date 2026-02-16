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
  CreditCard,
  ClipboardList,
  ScrollText,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'

interface MenuItem {
  icon: any
  label: string
  href: string
  allowedRoles: UserRole[]
}

// V1: Company Admin = view/billing only; HR = hero (campaigns/employees); Employee = no dashboard (Gifts only)
const allMenuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER'] },
  { icon: Package, label: 'Products', href: '/products', allowedRoles: ['SUPER_ADMIN', 'HR', 'MANAGER'] },
  { icon: ShoppingCart, label: 'Orders', href: '/orders', allowedRoles: ['SUPER_ADMIN', 'HR', 'MANAGER'] },
  { icon: Gift, label: 'Gifts', href: '/gifts', allowedRoles: ['SUPER_ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  { icon: CreditCard, label: 'Billing', href: '/billing', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER'] },
  { icon: Users, label: 'Employees', href: '/employees', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR'] },
  { icon: Zap, label: 'Campaigns', href: '/campaigns', allowedRoles: ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER'] },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', allowedRoles: ['SUPER_ADMIN', 'HR', 'MANAGER'] },
  { icon: Building2, label: 'Companies', href: '/companies', allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
  { icon: Users, label: 'Users', href: '/users', allowedRoles: ['SUPER_ADMIN'] },
  { icon: ClipboardList, label: 'Ops', href: '/ops', allowedRoles: ['SUPER_ADMIN'] },
  { icon: ScrollText, label: 'Audit log', href: '/audit', allowedRoles: ['SUPER_ADMIN'] },
  { icon: Settings, label: 'Settings', href: '/settings', allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
]

interface SidebarProps {
  userRole: UserRole
  userName: string
  userEmail: string
  userInitials: string
  isMobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
}

export function Sidebar({ userRole, userName, userEmail, userInitials, isMobileOpen: controlledMobileOpen, onMobileOpenChange }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [internalMobileOpen, setInternalMobileOpen] = useState(false)
  const isMobileOpen = onMobileOpenChange ? (controlledMobileOpen ?? false) : internalMobileOpen
  const setMobileOpen = onMobileOpenChange ?? setInternalMobileOpen
  const setMobileOpenValue = (open: boolean) => (onMobileOpenChange ? onMobileOpenChange(open) : setInternalMobileOpen(open))

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
    setMobileOpenValue(false)
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
        setMobileOpenValue(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileOpen, isCollapsed])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileMenu = () => {
    setMobileOpenValue(!isMobileOpen)
  }
  
  // Check if current path starts with any menu item href
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
      if (response.ok) {
        window.location.href = '/login'
      } else {
        window.location.href = '/login'
      }
    } catch {
      window.location.href = '/login'
    }
  }

  return (
    <>
      {/* Mobile overlay - tap to close menu */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-[45] transition-opacity duration-200"
          onClick={() => setMobileOpenValue(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - clean drawer on mobile, collapsible on desktop */}
      <aside className={cn(
        'flex flex-col bg-white transition-all duration-300 ease-out',
        'lg:sticky fixed top-0 h-screen z-[50]',
        'lg:translate-x-0 lg:border-r lg:border-border/20',
        isMobileOpen ? 'translate-x-0 w-[min(280px,88vw)] shadow-xl' : '-translate-x-full lg:translate-x-0 lg:shadow-none',
        isCollapsed ? 'lg:w-[72px]' : 'lg:w-64'
      )}>
        {/* Logo + collapse / mobile close */}
        <div className="p-4 lg:p-4 border-b border-border/20 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/dashboard"
              className={cn(
                'flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-80 flex-shrink-0 min-w-0',
                isCollapsed ? 'opacity-0 w-0 overflow-hidden pointer-events-none' : 'opacity-100'
              )}
            >
              <Image
                src="/logogoodies.png"
                alt="Goodies"
                width={200}
                height={100}
                className="h-9 w-auto object-contain"
                priority
                unoptimized
              />
            </Link>
            <div className="flex items-center gap-1 shrink-0">
              {/* Mobile: close button inside sidebar so it doesn't overlay the logo */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpenValue(false)}
                className="lg:hidden h-9 w-9 rounded-none hover:bg-muted/60"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
              {/* Desktop: collapse/expand */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hidden lg:flex h-9 w-9 rounded-none hover:bg-muted/60"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
        </div>
      </div>
      
        {/* Navigation - generous tap targets on mobile */}
        <nav className="flex-1 p-3 lg:p-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-none transition-all group relative touch-manipulation',
                  'lg:px-3 lg:py-2.5',
                  'hover:bg-muted/50 active:scale-[0.99]',
                active
                    ? 'bg-muted/70 text-foreground font-semibold'
                    : 'text-foreground hover:text-foreground lg:text-muted-foreground lg:hover:text-foreground',
                  isCollapsed && 'justify-center lg:justify-center'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  'w-5 h-5 flex-shrink-0',
                  active ? 'text-foreground' : 'text-foreground group-hover:text-foreground lg:text-muted-foreground lg:group-hover:text-foreground'
                )} />
                <span className={cn(
                  'transition-opacity duration-300 whitespace-nowrap text-sm font-medium min-w-0',
                  isCollapsed ? 'opacity-0 w-0 overflow-hidden lg:opacity-0' : 'opacity-100'
                )}>
                  {item.label}
                </span>
                {isCollapsed && (
                  <div className="hidden lg:block absolute left-full ml-2 px-2.5 py-1.5 bg-popover border border-border text-popover-foreground text-xs font-medium rounded-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-lg">
                    {item.label}
                  </div>
                )}
            </Link>
          )
        })}
      </nav>
      
        {/* Bottom: Profile */}
        <div className="p-3 lg:p-4 border-t border-border/20 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
          <button
                className={cn(
                  'flex items-center gap-3 w-full rounded-none p-2.5 text-left hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  isCollapsed && 'justify-center lg:justify-center p-2'
                )}
                title={isCollapsed ? userName : undefined}
              >
                <Avatar className="h-9 w-9 shrink-0 border border-border/60">
                  <AvatarFallback className="bg-muted text-foreground text-sm font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  'min-w-0 flex-1',
                  isCollapsed && 'opacity-0 w-0 overflow-hidden lg:opacity-0'
                )}>
                  <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
                <ChevronUp className={cn(
                  'w-4 h-4 shrink-0 text-muted-foreground rotate-180',
                  isCollapsed && 'lg:hidden'
                )} />
          </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56 border-border/60 bg-white">
              <div className="px-3 py-2.5 border-b border-border/50">
                <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{userEmail}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-muted/50">
                <Link href="/settings" className="flex items-center w-full">
                  <Settings className="w-4 h-4 mr-2.5 text-muted-foreground" />
                  <span className="text-sm">Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer focus:bg-muted/50 text-muted-foreground focus:text-destructive"
                onSelect={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2.5" />
                <span className="text-sm">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
    </aside>
    </>
  )
}
