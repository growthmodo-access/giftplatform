'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const ctaLight =
  'rounded-xl border border-primary/40 text-primary bg-transparent hover:bg-primary/5 hover:border-primary/60 hover:text-primary px-6 py-3.5 text-base font-medium w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none'

export function IndustryLeaders() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-transparent"
    >
      <div className="landing-container">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center min-w-0">
          <div className="order-1 w-full min-w-0 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl xl:max-w-2xl mx-auto lg:mx-0 rounded-2xl overflow-hidden">
              <Image
                src="/IMG1.png"
                alt="Corporate gifting challenges - spreadsheets and coordination"
                width={1536}
                height={1024}
                className="w-full h-auto object-contain"
                sizes="(max-width: 1023px) 100vw, (max-width: 1280px) 36rem, 42rem"
                priority
              />
            </div>
          </div>
          <div className="order-2 flex flex-col items-start w-full max-w-xl lg:max-w-2xl mx-auto lg:mx-0 text-left">
            <span className="inline-block text-primary text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-3 pl-3 border-l-2 border-primary/60">
              The problem
            </span>
            <h2 id="problem-heading" className="landing-heading text-balance mb-4">
              Gifting breaks the moment your company grows
            </h2>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-lg mb-8">
              Corporate gifting should be simple but instead it turns into outdated Excel sheets, endless vendor follow ups, late deliveries, manual approvals stuck in email threads, different vendors for different countries, no tracking, and weeks of unnecessary chaos.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/contact'}
              className={ctaLight}
              aria-label="Talk to sales"
            >
              Talk to sales
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </Button>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
