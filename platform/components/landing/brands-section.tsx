'use client'

import Image from 'next/image'

/**
 * Brands we've worked with — two rows of logos in dark teal/green on white.
 * SVG logo files live in /public as shown here:
 * https://github.com/growthmodo-access/giftplatform/tree/main/platform/public
 */
const BRANDS_ROW_1 = ['Google', 'Swiggy', 'Zoho', 'Philips', 'Microsoft', 'Zomato', 'Paytm']
const BRANDS_ROW_2 = ['Disney+ Hotstar', 'Snapdeal', 'Apna', 'Walmart', 'Uber', 'Philips', 'Adobe']

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
  Uber: '/uber-12.svg',
  Adobe: '/adobe-44195.svg',
  // Apna and Walmart currently have no SVG configured
}

function BrandCell({ name }: { name: string }) {
  const logoSrc = BRAND_LOGOS[name]
  if (!logoSrc) return null

  return (
    <div className="flex items-center justify-center h-8 sm:h-9 md:h-10 w-full max-w-[160px] mx-auto">
      <Image
        src={logoSrc}
        alt={name}
        width={160}
        height={40}
        className="h-full w-auto object-contain object-center"
        unoptimized
      />
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
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-6 md:gap-8 items-center justify-items-center">
            {BRANDS_ROW_1.filter((name) => BRAND_LOGOS[name]).map((name) => (
              <BrandCell key={name} name={name} />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 sm:gap-6 md:gap-8 items-center justify-items-center">
            {BRANDS_ROW_2.filter((name) => BRAND_LOGOS[name]).map((name) => (
              <BrandCell key={`${name}-row2`} name={name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
