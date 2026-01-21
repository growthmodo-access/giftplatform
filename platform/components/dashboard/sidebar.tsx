'use client'

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
  Gift
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Products', href: '/products' },
  { icon: ShoppingCart, label: 'Orders', href: '/orders' },
  { icon: Users, label: 'Employees', href: '/employees' },
  { icon: Gift, label: 'Gifts', href: '/gifts' },
  { icon: Zap, label: 'Automation', href: '/automation' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  
  // Check if current path starts with any menu item href
  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/goodies.png"
              alt="Goodies.so Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Goodies.so
          </span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                active
                  ? "bg-purple-50 text-purple-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
