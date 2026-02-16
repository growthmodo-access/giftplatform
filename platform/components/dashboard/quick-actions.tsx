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
    <section className="rounded-none border border-border/20 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground shrink-0 sm:mr-2 sm:border-r sm:border-border/40 sm:pr-4">
          Quick Actions
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 sm:flex sm:flex-wrap gap-2 flex-1 min-w-0">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center gap-3 rounded-none border border-border/20 bg-muted/20 hover:bg-muted/40 hover:border-border/50 p-3 sm:min-w-[160px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-w-0 touch-manipulation"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="font-medium text-sm text-foreground leading-tight">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-snug mt-0.5 line-clamp-1">
                    {action.description}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
