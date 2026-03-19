import { LandingPage } from '@/components/landing/landing-page'
import { JsonLd } from '@/components/seo/json-ld'
import { getFAQPageJsonLd } from '@/lib/faq-data'
import { redirect } from 'next/navigation'

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = (await searchParams) || {}
  const code = typeof params.code === 'string' ? params.code : undefined
  const type = typeof params.type === 'string' ? params.type : undefined

  // Some Supabase recovery emails may land on Site URL with ?code=...
  // Route through callback server-side so code is exchanged reliably.
  if (code && (!type || type === 'recovery')) {
    redirect(`/api/auth/callback?code=${encodeURIComponent(code)}&type=recovery&next=%2Freset-password`)
  }

  return (
    <>
      <JsonLd data={getFAQPageJsonLd()} />
      <LandingPage />
    </>
  )
}
