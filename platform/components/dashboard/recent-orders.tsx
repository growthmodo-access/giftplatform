import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Package } from 'lucide-react'
import Link from 'next/link'
import { getDashboardStats } from '@/actions/dashboard'

const statusColors = {
  DELIVERED: 'bg-muted text-foreground border-border',
  SHIPPED: 'bg-muted text-foreground border-border',
  PROCESSING: 'bg-muted text-muted-foreground border-border',
  PENDING: 'bg-muted text-muted-foreground border-border',
  CANCELLED: 'bg-muted text-muted-foreground border-border',
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
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">Recent Orders</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Latest gift orders and their status</CardDescription>
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
            <div className="p-3 rounded-md bg-muted mb-3">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">No orders yet</p>
            <p className="text-sm text-muted-foreground">Orders will appear here once they're created</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">Recent Orders</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Latest gift orders and their status</CardDescription>
          </div>
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted text-xs sm:text-sm w-full sm:w-auto">
              See All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {recentOrders.map((order) => {
            const status = order.status as keyof typeof statusColors
            return (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-md hover:bg-muted transition-colors gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <p className="font-medium text-sm text-foreground truncate">{order.orderNumber}</p>
                    <Badge 
                      variant="outline"
                      className="border-border bg-muted text-xs font-normal"
                    >
                      {statusLabels[status] || order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground mb-0.5 truncate">{order.product}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {order.employee} • {order.date}
                  </p>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <p className="font-semibold text-sm text-foreground">{order.amount}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
