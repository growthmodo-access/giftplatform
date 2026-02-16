import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ArrowRight, Package, Plus, Eye } from 'lucide-react'
import Link from 'next/link'
import { getDashboardStats } from '@/actions/dashboard'
import { getInitials } from '@/lib/utils/dashboard'

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
      <Card className="rounded-none border border-border/20 bg-white shadow-sm overflow-hidden">
        <CardHeader className="pb-3 pt-4 sm:pt-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">Recent Orders</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">Latest gift orders</CardDescription>
            </div>
            <Link href="/orders">
              <Button variant="ghost" size="sm" className="gap-2 text-xs sm:text-sm w-full sm:w-auto rounded-none">
                See All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
            <div className="p-4 rounded-none bg-muted/50 mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No orders yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Create your first gift order to get started
            </p>
            <Button asChild className="rounded-none">
              <Link href="/orders">
                <Plus className="w-4 h-4 mr-2" />
                Create Order
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-none border border-border/20 bg-white shadow-sm overflow-hidden">
      <CardHeader className="pb-3 pt-4 sm:pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Recent Orders</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Latest gift orders</CardDescription>
          </div>
          <Link href="/orders">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted/50 text-xs sm:text-sm w-full sm:w-auto rounded-none">
              See All <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-0.5">
          {recentOrders.map((order) => {
            const status = order.status as keyof typeof statusColors
            const employeeEmail = (order as any).employeeEmail || order.employee
            const initials = getInitials(order.employee, employeeEmail)
            return (
              <Link key={order.id} href={`/orders?order=${order.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-none hover:bg-muted/40 active:bg-muted/50 transition-colors group cursor-pointer">
                  <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarFallback className="text-xs bg-muted/50">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
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
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-semibold text-sm text-foreground">{order.amount}</p>
                    </div>
                    <Eye className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
