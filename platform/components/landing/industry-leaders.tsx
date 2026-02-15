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

const ctaLight =
  'rounded-lg border border-primary/40 text-primary bg-transparent hover:bg-primary/5 hover:border-primary/60 px-5 py-2.5 text-sm font-medium w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none'

export function IndustryLeaders() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-white"
    >
      <div className="landing-container">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-14 items-center min-w-0">
          <div className="order-2 lg:order-1 w-full min-w-0 flex justify-center lg:justify-end">
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
          <div className="order-1 lg:order-2 flex flex-col items-center lg:items-start w-full max-w-xl lg:max-w-none mx-auto lg:mx-0 text-center lg:text-left">
            <p className="landing-label mb-2">The problem</p>
            <h2 id="problem-heading" className="landing-heading text-balance mb-4">
              Gifting breaks the moment your company grows
            </h2>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-lg mb-4">
              Corporate gifting should be simple. Instead, it becomes messy fast.
            </p>
            <ul role="list" className="w-full text-left space-y-2.5 mb-4">
              {pains.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] sm:text-base text-muted-foreground leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/80 shrink-0" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-lg mb-8">
              What starts as a &ldquo;small task&rdquo; turns into weeks of follow-ups.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/contact'}
              className={ctaLight}
              aria-label="Talk to sales"
            >
              Talk to sales
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
