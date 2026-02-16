import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Gift, ExternalLink } from 'lucide-react'
import { getMyGiftStatus } from '@/actions/campaign-recipients'
import { format } from 'date-fns'

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  SHIPPED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Expired: 'bg-muted text-muted-foreground',
}

function statusLabel(s: string) {
  if (s === 'PENDING' || s === 'Pending') return 'Pending'
  if (s === 'PROCESSING') return 'Processing'
  if (s === 'SHIPPED') return 'Shipped'
  if (s === 'DELIVERED') return 'Delivered'
  return s
}

export default async function GiftsPage() {
  const { data: myGifts, error } = await getMyGiftStatus()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My gift</h1>
        <p className="text-muted-foreground mt-1">
          Gifts assigned to you from campaigns. Use your link to choose or check status.
        </p>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Gift status</CardTitle>
          <CardDescription>Campaign gifts sent to you and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm text-destructive mb-4">{error}</p>
          )}
          {!myGifts?.length ? (
            <EmptyState
              icon={<Gift className="w-8 h-8 text-muted-foreground" />}
              title="No gifts yet"
              description="When you're added to a gift campaign, you'll see it here and receive an email with your personal link to choose your gift."
            />
          ) : (
            <div className="space-y-4">
              {myGifts.map((gift) => (
                <div
                  key={gift.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-none border border-border/20 hover:bg-muted/30 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{gift.campaignName}</p>
                      <Badge className={statusColors[gift.status] ?? 'bg-muted text-muted-foreground'}>
                        {statusLabel(gift.status)}
                      </Badge>
                    </div>
                    {gift.productName && (
                      <p className="text-sm text-muted-foreground">Gift: {gift.productName}</p>
                    )}
                    {gift.orderNumber && (
                      <p className="text-xs text-muted-foreground mt-1">Order {gift.orderNumber}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {gift.selectedAt
                        ? `Selected on ${format(new Date(gift.selectedAt), 'PPP')}`
                        : `Added on ${format(new Date(gift.createdAt), 'PPP')}`}
                    </p>
                  </div>
                  {gift.status === 'Pending' && gift.giftLinkUrl && (
                    <Button asChild variant="outline" size="sm" className="shrink-0 border-border/50">
                      <a href={gift.giftLinkUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Choose your gift
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
