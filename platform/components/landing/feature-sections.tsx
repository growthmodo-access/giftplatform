'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function FeatureSections() {
  return (
    <>
      {/* Order Premium Swag Section - dashboard-style cards */}
      <section id="swag" className="py-12 sm:py-20 md:py-24 lg:py-28 bg-white w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full max-w-full box-border min-w-0">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-24 items-center min-w-0">
            <div className="flex justify-center order-2 lg:order-1 w-full">
              <div className="w-full max-w-xl relative mx-auto">
                <div className="absolute inset-0 bg-primary/5 rounded-2xl -z-10" />
                <Image
                  src="/IMG1.png"
                  alt="Premium swag and gifts showcase"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-2xl sm:rounded-3xl object-contain shadow-lg border border-border/40 transition-shadow duration-300"
                  priority
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
              <div className="text-muted-foreground text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 sm:mb-6">
                GLOBAL FULFILLMENT
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight max-w-xl">
                Premium swag and gifts, shipped worldwide
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                We own inventory across 80+ countries. Order branded swag, premium gifts, or curated selections. We handle warehousing, customs, and delivery. No volume minimums, no logistics headaches.
              </p>
              <Button
                onClick={() => window.location.href = '/signup'}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 text-sm sm:text-base font-semibold w-full sm:max-w-[280px] lg:max-w-none lg:w-auto"
              >
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Gifts Section */}
      <section id="gifts" className="py-12 sm:py-20 md:py-24 lg:py-28 bg-muted/30 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full max-w-full box-border min-w-0">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-24 items-center min-w-0">
            <div className="lg:order-2 flex justify-center order-2 w-full">
              <div className="w-full max-w-xl relative mx-auto">
                <div className="absolute inset-0 bg-primary/5 rounded-2xl -z-10" />
                <Image
                  src="/d4.png"
                  alt="Thoughtful gifts showcase"
                  width={1536}
                  height={1024}
                  className="w-full h-auto rounded-2xl sm:rounded-3xl object-contain shadow-lg border border-border/40 transition-shadow duration-300"
                  priority
                />
              </div>
            </div>
            <div className="lg:order-1 order-1 space-y-6 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
              <div className="text-muted-foreground text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 sm:mb-6">
                WHY GIFTS BEAT GIFT CARDS
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight max-w-xl">
                Thoughtful gifts build stronger relationships
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Gift cards feel transactional. Branded, curated gifts show you care. We curate premium selections that recipients actually want, from tech accessories to wellness products. Every gift reinforces your brand and strengthens relationships.
              </p>
              <Button
                onClick={() => window.location.href = '/signup'}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 text-sm sm:text-base font-semibold w-full sm:max-w-[280px] lg:max-w-none lg:w-auto"
              >
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Automate Gifts Section */}
      <section className="py-12 sm:py-20 md:py-24 lg:py-28 bg-white w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full max-w-full box-border min-w-0">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-24 items-center min-w-0">
            <div className="flex justify-center order-2 lg:order-1 w-full">
              <div className="w-full max-w-xl relative mx-auto">
                <div className="absolute inset-0 bg-primary/5 rounded-2xl -z-10" />
                <Image
                  src="/f2.png"
                  alt="Use cases visualization"
                  width={1536}
                  height={1024}
                  className="w-full h-auto rounded-2xl sm:rounded-3xl object-contain shadow-lg border border-border/40 transition-shadow duration-300"
                  priority
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
              <div className="text-muted-foreground text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 sm:mb-6">
                USE CASES
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight max-w-xl">
                Gifts for employees, clients, and events
              </h2>
              <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 w-full max-w-xl mx-auto lg:mx-0">
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-border/60 shadow-sm text-left">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Employee recognition:</strong> Welcome kits, anniversaries, performance rewards
                  </p>
                </div>
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-border/60 shadow-sm text-left">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Client appreciation:</strong> Thank you gifts, deal closings, milestones
                  </p>
                </div>
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-border/60 shadow-sm text-left">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Events & campaigns:</strong> Conference swag, launches, offsites
                  </p>
                </div>
              </div>
              <Button
                onClick={() => window.location.href = '/signup'}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 text-sm sm:text-base font-semibold w-full sm:max-w-[280px] lg:max-w-none lg:w-auto"
              >
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
