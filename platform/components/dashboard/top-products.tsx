import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const products = [
  { name: 'Premium Swag Box', orders: 234, revenue: '$35,100' },
  { name: 'Amazon Gift Card', orders: 189, revenue: '$9,450' },
  { name: 'Custom T-Shirt', orders: 156, revenue: '$4,680' },
  { name: 'Experience Gift', orders: 98, revenue: '$19,600' },
  { name: 'Coffee Subscription', orders: 87, revenue: '$2,610' },
]

export function TopProducts() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Most popular gifts this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.orders} orders</p>
                </div>
              </div>
              <p className="font-semibold text-gray-900">{product.revenue}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
