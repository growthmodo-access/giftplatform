'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { NewOrderDialog } from './new-order-dialog'

const statusColors: Record<string, string> = {
  DELIVERED: 'bg-green-100 text-green-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-yellow-100 text-yellow-700',
  PENDING: 'bg-gray-100 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

type Order = {
  id: string
  orderNumber: string
  employee: string
  product: string
  amount: string
  status: string
  date: string
}

interface OrdersPageClientProps {
  orders: Order[]
  currentUserRole: 'SUPER_ADMIN' | 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE'
}

export function OrdersPageClient({ orders, currentUserRole }: OrdersPageClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const canCreateOrders = currentUserRole === 'ADMIN' || currentUserRole === 'HR' || 
                          currentUserRole === 'MANAGER' || currentUserRole === 'SUPER_ADMIN'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage all gift orders</p>
        </div>
        {canCreateOrders && (
          <Button className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            New Order
          </Button>
        )}
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage gift orders</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders found. {canCreateOrders && 'Create your first order to get started.'}
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <Badge className={statusColors[order.status] || statusColors.PENDING}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{order.product}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.employee} • {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {canCreateOrders && (
        <NewOrderDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      )}
    </div>
  )
}
