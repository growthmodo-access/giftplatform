import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Package } from 'lucide-react'
import Link from 'next/link'
import { getDashboardStats } from '@/actions/dashboard'

const statusColors = {
  DELIVERED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  SHIPPED: 'bg-blue-100 text-blue-700 border-blue-200',
  PROCESSING: 'bg-amber-100 text-amber-700 border-amber-200',
  PENDING: 'bg-gray-100 text-gray-700 border-gray-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
}

const statusLabels = {
  DELIVERED: 'Delivered',
  SHIPPED: 'Shipped',
  PROCESSING: 'Processing',
  PENDING: 'Pending',
  CANCELLED: 'Cancelled',
}

export async function RecentOrders() {
  const { recentOrders } = await getDashboardStats()

  if (recentOrders.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Recent Orders</CardTitle>
              <CardDescription className="mt-1">Latest gift orders and their status</CardDescription>
            </div>
            <Link href="/orders">
              <Button variant="ghost" size="sm" className="gap-2">
                See All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-gray-100 mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-1">No orders yet</p>
            <p className="text-sm text-gray-500">Orders will appear here once they're created</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Recent Orders</CardTitle>
            <CardDescription className="mt-1">Latest gift orders and their status</CardDescription>
          </div>
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-gray-50">
              See All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentOrders.map((order) => {
            const status = order.status as keyof typeof statusColors
            return (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-gray-900 truncate">{order.orderNumber}</p>
                    <Badge 
                      className={`${statusColors[status] || statusColors.PENDING} border font-medium text-xs`}
                    >
                      {statusLabels[status] || order.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1 truncate">{order.product}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {order.employee} • {order.date}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-lg text-gray-900">{order.amount}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
