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
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">Revenue Overview</CardTitle>
            <CardDescription className="mt-1 text-sm">Last 7 days performance</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2 border-gray-200 hover:bg-gray-50 text-xs sm:text-sm w-full sm:w-auto">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="flex items-center gap-6 pb-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500 mb-1">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${(stats.monthlyRevenue / 1000).toFixed(1)}k</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold ${
                stats.revenueChange >= 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {stats.revenueChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingUp className="w-4 h-4 rotate-180" />
                )}
                {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange.toFixed(1)}%
              </div>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          </div>

          {/* Chart */}
          <div className="relative">
            <div className="h-[200px] flex items-end justify-between gap-2">
              {chartData.map((data, index) => {
                const height = (data.revenue / maxRevenue) * maxHeight
                const isHighest = data.revenue === maxRevenue
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center group">
                    <div className="relative w-full flex items-end justify-center h-full">
                      {/* Bar */}
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg group-hover:scale-105"
                        style={{ height: `${Math.max(height, 8)}px` }}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                            <div className="font-semibold">${data.revenue.toFixed(2)}</div>
                            <div className="text-gray-400 text-[10px]">{data.orders} orders</div>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                              <div className="border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Date label */}
                    <div className="mt-3 text-xs font-medium text-gray-600 text-center">
                      {data.date}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 pr-2">
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
