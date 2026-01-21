import { SwagStorePage } from '@/components/swag-store/swag-store-page'
import { getSwagStoreByIdentifier } from '@/actions/swag-store'
import { notFound } from 'next/navigation'

interface SwagStorePageProps {
  params: {
    identifier: string
  }
}

export default async function SwagStorePublicPage({ params }: SwagStorePageProps) {
  const { identifier } = params

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
