'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Home } from 'lucide-react'

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Products',
  orders: 'Orders',
  employees: 'Employees',
  campaigns: 'Campaigns',
  gifts: 'Gifts',
  analytics: 'Analytics',
  companies: 'Companies',
  users: 'Users',
  settings: 'Settings',
  billing: 'Billing',
}

export function Breadcrumbs() {
  const pathname = usePathname()
  
  // Don't show breadcrumbs on root or auth pages
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return null
  }

  const paths = pathname.split('/').filter(Boolean)
  
  // Don't show breadcrumbs if only on dashboard
  if (paths.length === 1 && paths[0] === 'dashboard') {
    return null
  }

  const breadcrumbs = paths.map((path, index) => {
    const href = '/' + paths.slice(0, index + 1).join('/')
    const label = routeLabels[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')
    const isLast = index === paths.length - 1

    return {
      href,
      label,
      isLast,
    }
  })

  return (
    <Breadcrumb className="mb-3 sm:mb-4">
      <BreadcrumbList className="flex-wrap min-w-0">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard" className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
