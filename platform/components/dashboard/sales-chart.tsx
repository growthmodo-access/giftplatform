import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

export function SalesChart() {
  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sales Report</CardTitle>
            <CardDescription>Revenue over time</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="default" size="sm">12 Months</Button>
          <Button variant="outline" size="sm">6 Months</Button>
          <Button variant="outline" size="sm">30 Days</Button>
          <Button variant="outline" size="sm">7 Days</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500">Chart visualization will be implemented with a charting library</p>
        </div>
      </CardContent>
    </Card>
  )
}
