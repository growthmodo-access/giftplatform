import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Zap } from 'lucide-react'

const campaigns = [
  {
    id: '1',
    name: 'New Hire Welcome',
    trigger: 'NEW_HIRE',
    status: 'Active',
    giftsSent: 45,
  },
  {
    id: '2',
    name: 'Birthday Gifts',
    trigger: 'BIRTHDAY',
    status: 'Active',
    giftsSent: 128,
  },
  {
    id: '3',
    name: 'Anniversary Rewards',
    trigger: 'ANNIVERSARY',
    status: 'Inactive',
    giftsSent: 67,
  },
]

export default function AutomationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Automation</h1>
          <p className="text-gray-600 mt-1">Automated gift campaigns</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="glass hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <Badge className={campaign.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                  {campaign.status}
                </Badge>
              </div>
              <CardTitle className="mt-4">{campaign.name}</CardTitle>
              <CardDescription>Trigger: {campaign.trigger.replace('_', ' ')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{campaign.giftsSent}</p>
                  <p className="text-sm text-gray-600">Gifts sent</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
