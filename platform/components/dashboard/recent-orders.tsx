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
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg lg:text-xl font-bold text-foreground">Recent Orders</CardTitle>
              <CardDescription className="mt-1 text-sm">Latest gift orders and their status</CardDescription>
            </div>
            <Link href="/orders">
              <Button variant="ghost" size="sm" className="gap-2 text-xs sm:text-sm w-full sm:w-auto">
                See All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">No orders yet</p>
            <p className="text-sm text-muted-foreground">Orders will appear here once they're created</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg lg:text-xl font-bold text-foreground">Recent Orders</CardTitle>
            <CardDescription className="mt-1 text-sm">Latest gift orders and their status</CardDescription>
          </div>
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent text-xs sm:text-sm w-full sm:w-auto">
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
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border border-border hover:bg-accent transition-all duration-200 gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <p className="font-semibold text-foreground text-sm lg:text-base truncate">{order.orderNumber}</p>
                    <Badge 
                      className={`${statusColors[status] || statusColors.PENDING} border font-medium text-xs`}
                    >
                      {statusLabels[status] || order.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1 truncate">{order.product}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {order.employee} • {order.date}
                  </p>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <p className="font-bold text-base lg:text-lg text-foreground">{order.amount}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
