'use client'

import Image from 'next/image'

/**
 * Brands we've worked with — 10 logos in one grid so 2-column view shows 5 left / 5 right (no empty cell).
 * Order: fills row-by-row so grid-cols-2 gives col1 = 1,3,5,7,9 and col2 = 2,4,6,8,10.
 */
const BRANDS_ORDERED = [
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
  'flex items-center justify-center h-11 sm:h-14 md:h-16 w-full rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/30 hover:border-primary/30 transition-all duration-200 min-w-0'

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
      className="landing-section bg-white w-full max-w-full border-t border-border/40"
      aria-label="Brands we've worked with"
    >
      <div className="landing-container">
        <p className="landing-label text-center mb-2">Trusted by</p>
        <h2 className="landing-heading text-center mb-10 sm:mb-12 leading-[1.25] pt-0.5">
          Brands we&apos;ve worked with
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4 max-w-4xl mx-auto items-stretch justify-items-center">
          {BRANDS_ORDERED.map((name) => (
            <BrandCell key={name} name={name} />
          ))}
        </div>
      </div>
    </section>
  )
}
