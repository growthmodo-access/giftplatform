import { getCampaignAndProductsForToken } from '@/actions/campaign-recipients'
import { GiftSelectionForm } from './gift-selection-form'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function GiftPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const { data, error } = await getCampaignAndProductsForToken(token)

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="text-xl font-semibold text-foreground">Invalid or expired link</h1>
          <p className="text-muted-foreground">{error ?? 'This gift link is no longer valid.'}</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Go to Goodies.so
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logogoodies.png" alt="Goodies" width={100} height={32} className="h-8 w-auto" />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Choose your gift</h1>
          <p className="mt-1 text-muted-foreground">
            You’ve been invited to pick a gift from <strong>{data.campaign.name}</strong>.
          </p>
        </div>
        <GiftSelectionForm
          token={token}
          campaignName={data.campaign.name}
          products={data.products}
          recipientEmail={data.recipient.email}
        />
      </main>
    </div>
  )
}
