'use client'

import Image from 'next/image'

/**
 * Brands we've worked with — two rows of logos in dark teal/green on white.
 * Add logo images to public/logos/ (e.g. Google.svg, Swiggy.svg) to show image instead of text.
 */
const BRANDS_ROW_1 = ['Google', 'Swiggy', 'Zoho', 'Philips', 'Microsoft', 'Zomato', 'Paytm']
const BRANDS_ROW_2 = ['Disney+ Hotstar', 'Snapdeal', 'Apna', 'Walmart', 'Uber', 'Philips', 'Adobe']

/** Logo filename in /logos/ (without path). Use exact filename e.g. Google.svg */
const BRAND_LOGOS: Record<string, string> = {
  Google: 'Google.svg',
}

const brandColor = 'hsl(172 42% 22%)' // dark teal/green to match reference

function BrandCell({ name }: { name: string }) {
  const logo = BRAND_LOGOS[name]
  if (logo) {
    return (
      <div className="flex items-center justify-center h-8 sm:h-9 w-full max-w-[140px] mx-auto">
        <Image
          src={`/logos/${logo}`}
          alt={name}
          width={140}
          height={36}
          className="w-full h-auto object-contain object-center"
          unoptimized
        />
      </div>
    )
  }
  return (
    <span
      className="text-lg sm:text-xl font-semibold tracking-tight opacity-90 hover:opacity-100 transition-opacity text-center"
      style={{ color: brandColor }}
    >
      {name}
    </span>
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
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 sm:gap-8 items-center justify-items-center">
            {BRANDS_ROW_1.map((name) => (
              <BrandCell key={name} name={name} />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 sm:gap-8 items-center justify-items-center">
            {BRANDS_ROW_2.map((name) => (
              <BrandCell key={`${name}-row2`} name={name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
