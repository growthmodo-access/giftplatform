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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      allowedRoles: ['ADMIN', 'MANAGER', 'SUPER_ADMIN'],
    },
    {
      title: 'Add Employee',
      description: 'Invite team member',
      icon: Users,
      href: '/employees',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      allowedRoles: ['ADMIN', 'HR', 'SUPER_ADMIN'],
    },
    {
      title: 'New Campaign',
      description: 'Create gift campaign',
      icon: Sparkles,
      href: '/automation',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      allowedRoles: ['ADMIN', 'HR', 'MANAGER', 'SUPER_ADMIN'],
    },
    {
      title: 'Add Product',
      description: 'Add new gift product',
      icon: Plus,
      href: '/products',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      allowedRoles: ['ADMIN', 'SUPER_ADMIN'],
    },
  ].filter(action => action.allowedRoles.includes(role || ''))

  if (actions.length === 0) {
    return null
  }

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">Quick Actions</CardTitle>
        <CardDescription className="mt-1 text-sm">Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 lg:space-y-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 lg:p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className={`p-2 rounded-lg ${action.bgColor} mr-3 group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${action.iconColor}`} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">{action.title}</p>
                    <p className="text-xs text-gray-500 truncate">{action.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
