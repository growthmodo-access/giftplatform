import { Gift, Users, Sparkles, Package, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function QuickActions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = currentUser?.role

  const actions = [
    {
      title: 'New Order',
      description: 'Create a gift order',
      icon: Gift,
      href: '/orders',
      allowedRoles: ['HR', 'MANAGER', 'SUPER_ADMIN'],
    },
    {
      title: 'Add Employee',
      description: 'Invite team member',
      icon: Users,
      href: '/employees',
      allowedRoles: ['ADMIN', 'HR', 'SUPER_ADMIN'],
    },
    {
      title: 'New Campaign',
      description: 'Create gift campaign',
      icon: Sparkles,
      href: '/campaigns',
      allowedRoles: ['HR', 'MANAGER', 'SUPER_ADMIN'],
    },
    {
      title: 'Add Product',
      description: 'Add new gift product',
      icon: Package,
      href: '/products',
      allowedRoles: ['ADMIN', 'SUPER_ADMIN'],
    },
  ].filter(action => action.allowedRoles.includes(role || ''))

  if (actions.length === 0) {
    return null
  }

  return (
    <section className="sm:rounded-2xl sm:border sm:border-border/50 sm:bg-white sm:shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 py-2 sm:p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground px-1 sm:mb-0 sm:mr-2 sm:border-r sm:border-border/50 sm:pr-4 shrink-0">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 flex-1 min-w-0">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center gap-4 rounded-2xl bg-muted/30 active:bg-muted/50 sm:rounded-xl sm:border sm:border-border/40 sm:bg-background/60 hover:bg-muted/50 sm:hover:border-primary/20 p-4 sm:p-3 sm:min-w-[180px] transition-all duration-200 sm:hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-w-0 touch-manipulation"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors sm:h-10 sm:w-10 sm:rounded-lg">
                  <Icon className="h-6 w-6 sm:h-5 sm:w-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="font-semibold text-[15px] text-foreground leading-tight sm:text-sm">
                    {action.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-snug mt-0.5 line-clamp-1 sm:text-xs sm:line-clamp-2">
                    {action.description}
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all sm:h-4 sm:w-4" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
