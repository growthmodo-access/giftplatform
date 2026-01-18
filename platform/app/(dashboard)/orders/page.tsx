import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OrdersPageClient } from '@/components/orders/orders-page-client'
import { getOrders } from '@/actions/orders'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OrdersPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get current user's role to check permissions
  const { data: currentUser, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (userError || !currentUser) {
    redirect('/login')
  }

  const { data: orders, error } = await getOrders()

  return (
    <OrdersPageClient 
      orders={orders || []}
      currentUserRole={currentUser.role || 'EMPLOYEE'}
      error={error || undefined}
    />
  )
}
