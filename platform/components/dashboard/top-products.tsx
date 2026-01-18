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
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">Top Products</CardTitle>
          <CardDescription className="mt-1 text-sm">Most popular gifts this month</CardDescription>
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
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">Top Products</CardTitle>
        </div>
        <CardDescription className="mt-1 text-sm">Most popular gifts this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 lg:space-y-4">
          {topProducts.map((product, index) => {
            const isTopThree = index < 3
            return (
              <div 
                key={product.id} 
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 gap-3"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isTopThree 
                      ? `bg-gradient-to-br ${rankColors[index]} shadow-sm sm:shadow-lg` 
                      : rankBgColors[index] || 'bg-gray-100'
                  }`}>
                    {isTopThree ? (
                      <span className="text-white font-bold text-xs sm:text-sm">{index + 1}</span>
                    ) : (
                      <span className={`font-bold text-xs sm:text-sm ${
                        index === 1 ? 'text-gray-600' : 'text-gray-700'
                      }`}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{product.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <p className="text-xs sm:text-sm text-gray-500">{product.orders} orders</p>
                      {product.orders > 0 && (
                        <div className="flex items-center gap-1 text-xs text-emerald-600">
                          <TrendingUp className="w-3 h-3" />
                          <span className="font-medium">Active</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <p className="font-bold text-base sm:text-lg text-gray-900">${(product.revenue / 1000).toFixed(1)}k</p>
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
