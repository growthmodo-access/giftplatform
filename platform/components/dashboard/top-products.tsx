import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, TrendingUp } from 'lucide-react'
import { getDashboardStats } from '@/actions/dashboard'

const rankColors = [
  'from-yellow-400 to-yellow-500',
  'from-gray-300 to-gray-400',
  'from-amber-600 to-amber-700',
  'from-blue-400 to-blue-500',
  'from-purple-400 to-purple-500',
]

const rankBgColors = [
  'bg-yellow-50',
  'bg-gray-50',
  'bg-amber-50',
  'bg-blue-50',
  'bg-purple-50',
]

export async function TopProducts() {
  const { topProducts } = await getDashboardStats()

  if (topProducts.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Top Products</CardTitle>
          <CardDescription className="mt-1">Most popular gifts this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-gray-100 mb-4">
              <Trophy className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium mb-1">No products yet</p>
            <p className="text-sm text-gray-500">Product rankings will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <CardTitle className="text-xl font-bold text-gray-900">Top Products</CardTitle>
        </div>
        <CardDescription className="mt-1">Most popular gifts this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => {
            const isTopThree = index < 3
            return (
              <div 
                key={product.id} 
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200 group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isTopThree 
                      ? `bg-gradient-to-br ${rankColors[index]} shadow-lg` 
                      : rankBgColors[index] || 'bg-gray-100'
                  }`}>
                    {isTopThree ? (
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    ) : (
                      <span className={`font-bold text-sm ${
                        index === 1 ? 'text-gray-600' : 'text-gray-700'
                      }`}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-500">{product.orders} orders</p>
                      {product.orders > 0 && (
                        <div className="flex items-center gap-1 text-xs text-emerald-600">
                          <TrendingUp className="w-3 h-3" />
                          <span className="font-medium">Active</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-lg text-gray-900">${(product.revenue / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-gray-500 mt-0.5">Revenue</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
