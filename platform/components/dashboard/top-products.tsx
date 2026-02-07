import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getDashboardStats } from '@/actions/dashboard'
import { formatCurrencyShort } from '@/lib/currency'


export async function TopProducts() {
  const { topProducts, canViewRevenue } = await getDashboardStats()

  if (topProducts.length === 0) {
    return (
      <Card className="card-mobile-soft rounded-2xl border-0 bg-muted/20 shadow-none sm:rounded-xl sm:border sm:border-border/50 sm:bg-white sm:shadow-sm">
        <CardHeader className="pb-3 pt-4 sm:pt-5">
          <CardTitle className="text-base font-semibold text-foreground">Top Products</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Most popular this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3 rounded-xl bg-muted/50 mb-3">
              <Trophy className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">No products yet</p>
            <p className="text-sm text-muted-foreground">Rankings will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-mobile-soft rounded-2xl border-0 bg-muted/20 shadow-none sm:rounded-xl sm:border sm:border-border/50 sm:bg-white sm:shadow-sm">
      <CardHeader className="pb-3 pt-4 sm:pt-5">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <CardTitle className="text-base font-semibold text-foreground">Top Products</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">Most popular this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0.5">
          {topProducts.map((product, index) => {
            // Simulate growth indicator (in real app, compare with previous period)
            const growth = index === 0 ? 12.5 : index === 1 ? 8.3 : index === 2 ? -2.1 : 0
            const hasGrowth = growth > 0
            const hasDecline = growth < 0
            
            return (
              <div
                key={product.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-2xl hover:bg-muted/40 active:bg-muted/50 transition-colors gap-3 group sm:rounded-xl"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                    index === 0 ? 'bg-foreground/10' : 'bg-muted'
                  }`}>
                    {index === 0 ? (
                      <Trophy className="w-4 h-4 text-foreground" />
                    ) : (
                      <span className="font-semibold text-xs text-foreground">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{product.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground">{product.orders} orders</p>
                      {growth !== 0 && (
                        <div className={`flex items-center gap-0.5 text-xs ${
                          hasGrowth ? 'text-foreground' : hasDecline ? 'text-muted-foreground' : ''
                        }`}>
                          {hasGrowth ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : hasDecline ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                          <span className="font-medium">{Math.abs(growth)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {canViewRevenue && (
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="font-semibold text-sm text-foreground">{formatCurrencyShort(product.revenue, 'INR')}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Revenue</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
