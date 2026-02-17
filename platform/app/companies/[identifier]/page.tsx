import type { Metadata } from 'next'
import { SwagStorePage } from '@/components/swag-store/swag-store-page'
import { getSwagStoreByIdentifier } from '@/actions/swag-store'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'

interface SwagStorePageProps {
  params: Promise<{ identifier: string }>
}

export async function generateMetadata({ params }: SwagStorePageProps): Promise<Metadata> {
  const { identifier } = await params
  const { data } = await getSwagStoreByIdentifier(identifier)
  if (!data) return {}
  return buildMetadata({
    title: `${data.companyName} Swag Store`,
    description: `Shop ${data.companyName} swag and corporate gifts. ${data.products?.length ?? 0} products available.`,
    path: `companies/${identifier}`,
    noIndex: false,
  })
}

export default async function SwagStorePublicPage({ params }: SwagStorePageProps) {
  const { identifier } = await params

  const { data: storeData, error } = await getSwagStoreByIdentifier(identifier)

  if (error || !storeData) {
    notFound()
  }

  // Check if store is enabled
  if (!storeData.isEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Store Unavailable</h1>
          <p className="text-muted-foreground">This swag store is currently disabled.</p>
        </div>
      </div>
    )
  }

  return <SwagStorePage storeData={storeData} />
}
