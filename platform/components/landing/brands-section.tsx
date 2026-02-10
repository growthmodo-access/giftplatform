'use client'

import Image from 'next/image'

/**
 * Brands we've worked with — 10 logos in 5/5 layout with upgraded presentation.
 * SVG logo files live in /public (see repo platform/public).
 */
const BRANDS_ROW_1 = ['Google', 'Swiggy', 'Zoho', 'Philips', 'Microsoft']
const BRANDS_ROW_2 = ['Zomato', 'Paytm', 'Disney+ Hotstar', 'Snapdeal', 'Adobe']

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
  'flex items-center justify-center h-12 sm:h-14 w-[120px] sm:w-[140px] rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 hover:border-primary/20 transition-all duration-200'

function BrandCell({ name }: { name: string }) {
  const logoSrc = BRAND_LOGOS[name]
  if (!logoSrc) return null

  const isSmallLogo = name === 'Google' || name === 'Adobe'

  return (
    <div className={LOGO_CELL_CLASS}>
      <div className="relative h-7 sm:h-8 w-[100px] sm:w-[115px] flex items-center justify-center overflow-hidden">
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
      className="landing-section bg-white w-full max-w-full overflow-hidden border-t border-border/40"
      aria-label="Brands we've worked with"
    >
      <div className="landing-container">
        <p className="landing-label text-center mb-2">Trusted by</p>
        <h2 className="landing-heading text-center mb-10 sm:mb-12">
          Brands we&apos;ve worked with
        </h2>
        <div className="flex flex-col gap-4 sm:gap-5 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 items-stretch justify-items-center">
            {BRANDS_ROW_1.map((name) => (
              <BrandCell key={name} name={name} />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 items-stretch justify-items-center">
            {BRANDS_ROW_2.map((name) => (
              <BrandCell key={name} name={name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
