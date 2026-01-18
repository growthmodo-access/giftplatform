import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, TrendingUp } from 'lucide-react'
import { getDashboardStats } from '@/actions/dashboard'

export async function SalesChart() {
  const { chartData, stats } = await getDashboardStats()

  // Calculate max revenue for scaling
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1)
  const maxHeight = 200 // Chart height in pixels

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">Revenue Overview</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Last 7 days performance</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm w-full sm:w-auto border-border">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="flex items-center gap-6 pb-4 border-b border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Monthly Revenue</p>
              <p className="text-2xl font-semibold text-foreground tracking-tight">${(stats.monthlyRevenue / 1000).toFixed(1)}k</p>
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

          {/* Chart */}
          <div className="relative">
            <div className="h-[200px] flex items-end justify-between gap-2">
              {chartData.map((data, index) => {
                const height = (data.revenue / maxRevenue) * maxHeight
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-full flex items-end justify-center h-full">
                      {/* Bar */}
                      <div
                        className="w-full rounded-t bg-foreground/80 hover:bg-foreground transition-all duration-200 cursor-pointer"
                        style={{ height: `${Math.max(height, 8)}px` }}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <div className="bg-foreground text-background text-xs rounded-md py-1.5 px-2 whitespace-nowrap">
                            <div className="font-medium">${data.revenue.toFixed(2)}</div>
                            <div className="text-[10px] opacity-80">{data.orders} orders</div>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                              <div className="border-4 border-transparent border-t-foreground"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Date label */}
                    <div className="mt-3 text-xs text-muted-foreground text-center">
                      {data.date}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pr-2">
              <span>${(maxRevenue / 1000).toFixed(1)}k</span>
              <span>${(maxRevenue / 2000).toFixed(1)}k</span>
              <span>$0</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
