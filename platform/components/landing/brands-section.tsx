'use client'

import Image from 'next/image'

/**
 * Brands we've worked with — 10 logos in 5/5 layout with upgraded presentation.
 * SVG logo files live in /public (see repo platform/public).
 */
const BRANDS = [
  'Google', 'Swiggy', 'Zoho', 'Philips', 'Microsoft',
  'Zomato', 'Paytm', 'Disney+ Hotstar', 'Snapdeal', 'Adobe',
]

/** Map brand name -> public path for its logo SVG */
const BRAND_LOGOS: Record<string, string> = {
  Google: '/logos/Google.svg',
  Swiggy: '/swiggy-logo.svg',
  Zoho: '/zoho-1.svg',
  Philips: '/philips.svg',
  Microsoft: '/microsoft-6.svg',
  Zomato: '/zomato-2.svg',
  Paytm: '/paytm-1.svg',
  'Disney+ Hotstar': '/disney-2.svg',
  Snapdeal: '/snapdeal.svg',
  Adobe: '/adobe-44195.svg',
}

const LOGO_CELL_CLASS =
  'flex items-center justify-center h-12 sm:h-14 md:h-16 w-full min-w-0 opacity-80 hover:opacity-100 transition-opacity'

function BrandCell({ name }: { name: string }) {
  const logoSrc = BRAND_LOGOS[name]
  if (!logoSrc) return null

  const isSmallLogo = name === 'Google' || name === 'Adobe'

  return (
    <div className={LOGO_CELL_CLASS}>
      <div className="relative h-6 w-[90px] sm:h-8 sm:w-[120px] md:h-9 md:w-[130px] flex items-center justify-center overflow-hidden">
        <Image
          src={logoSrc}
          alt={name}
          width={160}
          height={64}
          className={`object-contain object-center ${isSmallLogo ? 'scale-110' : ''}`}
          unoptimized
        />
      </div>
    </div>
  )
}

export function BrandsSection() {
  return (
    <section
      className="landing-section w-full max-w-full border-t border-border/20 bg-white"
      aria-label="Brands we've worked with"
    >
      <div className="landing-container">
        <p className="landing-label text-center mb-2">Trusted by</p>
        <h2 className="landing-heading text-center mb-8 sm:mb-10 leading-[1.25]">
          Brands we&apos;ve worked with
        </h2>
        <div className="max-w-4xl mx-auto px-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 items-stretch justify-items-center">
            {BRANDS.map((name) => (
              <BrandCell key={name} name={name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
