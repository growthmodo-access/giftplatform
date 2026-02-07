import { LandingPage } from '@/components/landing/landing-page'
import { JsonLd } from '@/components/seo/json-ld'
import { getFAQPageJsonLd } from '@/lib/faq-data'

export default function Home() {
  return (
    <>
      <JsonLd data={getFAQPageJsonLd()} />
      <LandingPage />
    </>
  )
}
