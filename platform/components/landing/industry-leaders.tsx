'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const pains = [
  'Excel sheets with outdated addresses',
  'Endless vendor coordination',
  'Late deliveries and zero tracking',
  'Manual approvals stuck in email threads',
  'Different vendors for different countries',
  'No visibility on inventory or spend',
]

/* CTA: outline + hover lift and shadow for clear affordance */
const problemCtaClass =
  'rounded-xl border-2 border-primary text-primary bg-white px-6 py-4 text-base font-semibold w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-all duration-200 hover:bg-primary/10 hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0'

export function IndustryLeaders() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="landing-section w-full max-w-full overflow-hidden border-t border-border/40 bg-gradient-to-b from-white to-muted/20"
    >
      <div className="landing-container">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-8 xl:gap-10 items-center min-w-0">
          {/* Image: elevated card with stronger shadow for depth */}
          <div className="order-2 lg:order-1 w-full min-w-0 flex justify-center lg:justify-start px-0 sm:px-2">
            <div className="relative w-full max-w-2xl xl:max-w-3xl mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-border/40 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04] transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <Image
                src="/IMG1.png"
                alt="Corporate gifting challenges - spreadsheets and coordination"
                width={1536}
                height={1024}
                className="w-full h-auto object-contain"
                sizes="(max-width: 1023px) 100vw, (max-width: 1280px) 42rem, 48rem"
                priority
              />
            </div>
          </div>

          {/* Text: clear hierarchy and scannable list block */}
          <div className="order-1 lg:order-2 flex flex-col items-center lg:items-start w-full max-w-xl lg:max-w-none mx-auto lg:mx-0 text-center lg:text-left">
            <p className="landing-label mb-1">The problem</p>
            <h2 id="problem-heading" className="landing-heading text-balance mt-0 mb-2">
              Gifting breaks the moment your company grows
            </h2>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-lg mb-5 sm:mb-6">
              Corporate gifting should be simple. Instead, it becomes messy fast.
            </p>

            <ul
              role="list"
              className="w-full text-left rounded-xl border border-border/40 bg-white/80 backdrop-blur-sm px-5 py-4 sm:px-6 sm:py-5 space-y-3 sm:space-y-3.5 mb-5 sm:mb-6 shadow-sm"
            >
              {pains.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] sm:text-base text-foreground/90 leading-relaxed">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0 flex-shrink-0" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-7 max-w-lg">
              What starts as a &ldquo;small task&rdquo; turns into weeks of follow-ups.
            </p>

            <Button
              variant="outline"
              onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
              className={problemCtaClass}
              aria-label="See the better way - scroll to solutions"
            >
              See the better way
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
