import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, TrendingUp } from 'lucide-react'
import { getDashboardStats } from '@/actions/dashboard'
import { formatCurrency, formatCurrencyShort } from '@/lib/currency'

export async function SalesChart() {
  const { chartData, stats, canViewRevenue } = await getDashboardStats()

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1)
  const maxOrders = Math.max(...chartData.map(d => d.orders), 1)
  const maxHeight = 200
  const maxValue = canViewRevenue ? maxRevenue : maxOrders

  return (
    <Card className="rounded-none border border-border/20 bg-white shadow-sm overflow-hidden">
      <CardHeader className="pb-3 pt-4 sm:pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {canViewRevenue ? 'Revenue Overview' : 'Order Volume'}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Last 7 days</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm w-full sm:w-auto border-border/50 rounded-none">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {canViewRevenue && (
            <div className="flex items-center gap-6 pb-4 border-b border-border/50">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Monthly Revenue</p>
                <p className="text-2xl font-semibold text-foreground tracking-tight">{formatCurrencyShort(stats.monthlyRevenue, 'INR')}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-muted">
                  {stats.revenueChange >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingUp className="w-3 h-3 rotate-180" />
                  )}
                  {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange.toFixed(1)}%
                </div>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 0.5, 1].map((pos) => (
                <div 
                  key={pos}
                  className="border-t border-border/30"
                  style={{ marginTop: pos === 0 ? '0' : pos === 1 ? '100%' : '50%' }}
                />
              ))}
            </div>
            
            <div className="h-[200px] flex items-end justify-between gap-2 relative">
              {chartData.map((data, index) => {
                const value = canViewRevenue ? data.revenue : data.orders
                const height = maxValue > 0 ? (value / maxValue) * maxHeight : 0
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center group"
                    style={{ animation: `slideUp 0.6s ease-out ${index * 0.1}s both` }}
                  >
                    <div className="relative w-full flex items-end justify-center h-full">
                      <div
                        className="w-full rounded-t bg-primary/80 hover:bg-primary transition-all duration-200 cursor-pointer origin-bottom"
                        style={{ height: `${Math.max(height, 8)}px` }}
                      >
                        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <div className="bg-foreground text-background text-xs rounded-md py-1.5 px-2.5 whitespace-nowrap shadow-lg">
                            {canViewRevenue ? (
                              <>
                                <div className="font-semibold">{formatCurrency(data.revenue, 'INR')}</div>
                                <div className="text-[10px] opacity-80 mt-0.5">{data.orders} order{data.orders !== 1 ? 's' : ''}</div>
                              </>
                            ) : (
                              <div className="font-semibold">{data.orders} order{data.orders !== 1 ? 's' : ''}</div>
                            )}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                              <div className="border-4 border-transparent border-t-foreground" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground text-center font-medium">{data.date}</div>
                  </div>
                )
              })}
            </div>
            {canViewRevenue && (
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pr-2 pointer-events-none">
                <span className="font-medium">{formatCurrencyShort(maxRevenue, 'INR')}</span>
                <span className="font-medium">{formatCurrencyShort(maxRevenue / 2, 'INR')}</span>
                <span>₹0</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
