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

/* CTA: outline style with correct hover (overrides default outline hover) */
const problemCtaClass =
  'rounded-xl border-2 border-primary text-primary bg-white px-5 py-4 text-base font-semibold w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors hover:bg-primary/10 hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30'

export function IndustryLeaders() {
  return (
    <section id="problem" className="landing-section bg-white w-full max-w-full overflow-hidden border-t border-border/40">
      <div className="landing-container">
        {/* Tighter gap between image and text: gap-6 lg:gap-8 xl:gap-10 */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-8 xl:gap-10 items-center min-w-0">
          {/* Visual left (desktop) / second on mobile) – larger image for impact */}
          <div className="order-2 lg:order-1 w-full min-w-0 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-2xl xl:max-w-3xl mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-border/50 shadow-xl shadow-black/5 bg-muted/20 ring-1 ring-black/5">
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
          {/* Text right (desktop) / first on mobile */}
          <div className="order-1 lg:order-2 space-y-5 sm:space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start w-full max-w-xl lg:max-w-none mx-auto lg:mx-0">
            <p className="landing-label">The problem</p>
            <h2 className="landing-heading text-balance">
              Gifting breaks the moment your company grows
            </h2>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-lg">
              Corporate gifting should be simple. Instead, it becomes messy fast.
            </p>
            <ul className="text-[15px] sm:text-base text-muted-foreground leading-relaxed space-y-2.5 text-left w-full">
              {pains.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
              What starts as a &ldquo;small task&rdquo; turns into weeks of follow-ups.
            </p>
            <div className="pt-1">
              <Button
                variant="outline"
                onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
                className={problemCtaClass}
              >
                See the better way
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
