import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const orders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    employee: 'John Doe',
    product: 'Premium Swag Box',
    amount: '$149.99',
    status: 'Delivered',
    date: 'Jan 17, 2024',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    employee: 'Jane Smith',
    product: 'Gift Card - Amazon',
    amount: '$50.00',
    status: 'Shipped',
    date: 'Jan 17, 2024',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    employee: 'Mike Johnson',
    product: 'Custom T-Shirt',
    amount: '$29.99',
    status: 'Processing',
    date: 'Jan 16, 2024',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    employee: 'Sarah Williams',
    product: 'Experience Gift',
    amount: '$199.99',
    status: 'Pending',
    date: 'Jan 16, 2024',
  },
]

const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  Pending: 'bg-gray-100 text-gray-700',
}

export function RecentOrders() {
  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest gift orders and their status</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-2">
            See All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-medium text-gray-900">{order.orderNumber}</p>
                  <Badge className={statusColors[order.status as keyof typeof statusColors]}>
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
      </CardContent>
    </Card>
  )
}
