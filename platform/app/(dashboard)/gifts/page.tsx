import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Plus, Gift } from 'lucide-react'

const gifts: {
  id: string
  recipient: string
  product: string
  status: string
  sentDate: string
}[] = [
  {
    id: '1',
    recipient: 'John Doe',
    product: 'Premium Swag Box',
    status: 'Pending',
    sentDate: 'Jan 17, 2024',
  },
  {
    id: '2',
    recipient: 'Jane Smith',
    product: 'Amazon Gift Card',
    status: 'Redeemed',
    sentDate: 'Jan 15, 2024',
  },
]

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Redeemed: 'bg-green-100 text-green-700',
  Expired: 'bg-gray-100 text-gray-700',
}

export default function GiftsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gifts</h1>
          <p className="text-gray-600 mt-1">Manage all sent gifts</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Send Gift
        </Button>
      </div>

      <Card className="border border-black/[0.06] shadow-sm">
        <CardHeader>
          <CardTitle>All Gifts</CardTitle>
          <CardDescription>View and manage sent gifts</CardDescription>
        </CardHeader>
        <CardContent>
          {gifts.length === 0 ? (
            <EmptyState
              icon={<Gift className="w-8 h-8 text-muted-foreground" />}
              title="No gifts sent yet"
              description="Send your first gift to an employee or client."
              action={{ label: 'Send your first gift', onClick: () => {} }}
            />
          ) : (
          <div className="space-y-4">
            {gifts.map((gift) => (
              <div
                key={gift.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium text-gray-900">{gift.recipient}</p>
                    <Badge className={statusColors[gift.status]}>
                      {gift.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{gift.product}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Sent on {gift.sentDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
