import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

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
]

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  Pending: 'bg-gray-100 text-gray-700',
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage all gift orders</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Order
        </Button>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage gift orders</CardDescription>
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
                    <Badge className={statusColors[order.status]}>
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
    </div>
  )
}
