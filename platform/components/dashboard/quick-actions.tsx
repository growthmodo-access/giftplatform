import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, Package, Sparkles, ArrowRight } from 'lucide-react'
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
      icon: Package,
      href: '/orders',
      allowedRoles: ['ADMIN', 'MANAGER', 'SUPER_ADMIN'],
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
      allowedRoles: ['ADMIN', 'HR', 'MANAGER', 'SUPER_ADMIN'],
    },
    {
      title: 'Add Product',
      description: 'Add new gift product',
      icon: Plus,
      href: '/products',
      allowedRoles: ['ADMIN', 'SUPER_ADMIN'],
    },
  ].filter(action => action.allowedRoles.includes(role || ''))

  if (actions.length === 0) {
    return null
  }

  return (
    <Card className="border border-border/50 bg-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground">Quick Actions</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1.5">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 hover:bg-muted/60 transition-all group rounded-lg"
                >
                  <div className="p-1.5 rounded-md bg-muted/50 mr-3 flex-shrink-0 group-hover:bg-muted transition-colors">
                    <Icon className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-sm text-foreground leading-tight">{action.title}</p>
                    <p className="text-xs text-muted-foreground leading-tight mt-0.5">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0 opacity-0 group-hover:opacity-100 ml-2" />
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
