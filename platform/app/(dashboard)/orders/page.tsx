import { OrdersPageClient } from '@/components/orders/orders-page-client'
import { getOrders } from '@/actions/orders'
import { getCachedAuth } from '@/lib/auth-server'
import { toAppRole } from '@/lib/roles'
import { redirect } from 'next/navigation'

export default async function OrdersPage() {
  const auth = await getCachedAuth()
  if (!auth) redirect('/login')

  const currentUser = auth.currentUser
  const { data: orders, error } = await getOrders()

  const userRole = toAppRole(currentUser.role)
  return (
    <OrdersPageClient
      orders={orders || []}
      currentUserRole={userRole}
      error={error || undefined}
    />
  )
}
