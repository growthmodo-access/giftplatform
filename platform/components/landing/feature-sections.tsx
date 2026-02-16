'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { MapPin, BarChart3, Scale, Zap, ArrowRight } from 'lucide-react'

const ctaLight =
  'rounded-xl border border-primary/40 text-primary bg-transparent hover:bg-primary/5 hover:border-primary/60 hover:text-primary px-6 py-3.5 text-base font-medium w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none'

export function FeatureSections() {
  return (
    <>
      <section id="benefits" className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-transparent">
        <div className="landing-container">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center min-w-0">
              <div className="order-1 w-full min-w-0 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-xl xl:max-w-2xl mx-auto lg:mx-0 rounded-2xl overflow-hidden">
                  <Image src="/IMG3.png" alt="Premium swag and gifts showcase" width={600} height={400} className="w-full h-auto object-contain" priority />
                </div>
              </div>
            <div className="order-2 flex flex-col items-start w-full max-w-xl lg:max-w-2xl mx-auto lg:mx-0 text-left">
              <p className="landing-label mb-2">Core benefits</p>
              <h2 className="landing-heading text-balance mb-4">Send gifts anywhere in the world</h2>
              <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-lg mb-6">
                Global fulfillment without managing multiple vendors or couriers.
              </p>
              <div className="flex items-start gap-4 w-full max-w-lg mb-6">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="font-medium text-foreground text-sm sm:text-base">Eliminate address chaos</p>
                  <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed mt-1">
                    Recipients securely enter their own delivery details—no more wrong addresses or re-shipments.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => window.location.href = '/contact'} className={ctaLight}>
                Talk to sales <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-transparent">
        <div className="landing-container">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center min-w-0">
              <div className="order-1 w-full min-w-0 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-xl xl:max-w-2xl mx-auto lg:mx-0 rounded-2xl overflow-hidden">
                  <Image src="/IMG4.png" alt="Thoughtful branded gifts showcase" width={1536} height={1024} className="w-full h-auto object-contain" priority />
              </div>
            </div>
            <div className="order-2 flex flex-col items-start w-full max-w-xl lg:max-w-2xl mx-auto lg:mx-0 text-left">
              <p className="landing-label mb-2">Branded & visible</p>
              <h2 className="landing-heading text-balance mb-4">Branded swag people actually keep</h2>
              <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-lg mb-6">
                Premium, curated merchandise that reflects your brand—not cheap giveaways.
              </p>
              <div className="flex items-start gap-4 w-full max-w-lg mb-6">
                <BarChart3 className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="font-medium text-foreground text-sm sm:text-base">Full visibility, end to end</p>
                  <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed mt-1">
                    Track inventory, shipments, and deliveries in real time.
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => window.location.href = '/contact'} className={ctaLight}>
                Talk to sales <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-transparent">
        <div className="landing-container">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center min-w-0">
              <div className="order-1 w-full min-w-0 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-xl xl:max-w-2xl mx-auto lg:mx-0 rounded-2xl overflow-hidden">
                  <Image src="/IMG6.png" alt="Use cases - onboarding, rewards, events" width={1536} height={1024} className="w-full h-auto object-contain" priority />
              </div>
            </div>
            <div className="order-2 flex flex-col items-start w-full max-w-xl lg:max-w-2xl mx-auto lg:mx-0 text-left">
              <p className="landing-label mb-2">Scale & control</p>
              <div className="flex items-start gap-4 mb-4">
                <Scale className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <h2 className="landing-heading text-balance">Built for finance and scale</h2>
                  <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed mt-2">
                    Approval workflows, transparent pricing, and reporting that fits your stack.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 mb-8">
                <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="font-medium text-foreground text-sm sm:text-base">One process, any volume</p>
                  <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed mt-1">
                    From dozens to thousands of gifts—same workflow, no extra ops.
                  </p>
                </div>
              </div>

              <Button variant="outline" onClick={() => window.location.href = '/contact'} className={ctaLight}>
                Talk to sales <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
