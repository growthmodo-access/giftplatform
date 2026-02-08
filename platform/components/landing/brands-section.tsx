'use client'

/**
 * Brands we've worked with — two rows of logos in dark teal/green on white.
 * Add logo images to public/logos/ (e.g. google.svg, swiggy.svg) and switch to Image when ready.
 */
const BRANDS_ROW_1 = ['Google', 'Swiggy', 'Zoho', 'Philips', 'Microsoft', 'Zomato', 'Paytm']
const BRANDS_ROW_2 = ['Disney+ Hotstar', 'Snapdeal', 'Apna', 'Walmart', 'Uber', 'Philips', 'Adobe']

const brandColor = 'hsl(172 42% 22%)' // dark teal/green to match reference

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
          {/* Row 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 sm:gap-8 items-center justify-items-center">
            {BRANDS_ROW_1.map((name) => (
              <span
                key={name}
                className="text-lg sm:text-xl font-semibold tracking-tight opacity-90 hover:opacity-100 transition-opacity text-center"
                style={{ color: brandColor }}
              >
                {name}
              </span>
            ))}
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 sm:gap-8 items-center justify-items-center">
            {BRANDS_ROW_2.map((name) => (
              <span
                key={`${name}-row2`}
                className="text-lg sm:text-xl font-semibold tracking-tight opacity-90 hover:opacity-100 transition-opacity text-center"
                style={{ color: brandColor }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
