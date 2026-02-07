'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function FeatureSections() {
  return (
    <>
      {/* Order Premium Swag Section - dashboard-style cards */}
      <section id="swag" className="py-12 sm:py-20 md:py-24 lg:py-28 bg-white w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 w-full max-w-full box-border min-w-0">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-24 items-center min-w-0">
            <div className="flex justify-center order-2 lg:order-1 w-full">
              <div className="w-full max-w-xl relative mx-auto">
                <div className="absolute inset-0 bg-primary/5 rounded-xl -z-10" />
                <Image
                  src="/IMG1.png"
                  alt="Premium swag and gifts showcase"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-xl object-contain shadow-sm border border-border/40 transition-shadow duration-300"
                  priority
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
              <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4 sm:mb-6">
                GLOBAL FULFILLMENT
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6 sm:mb-8 leading-tight max-w-xl">
                One catalog. One invoice. Delivery in 80+ countries.
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Stop managing multiple vendors and RFPs. We hold inventory and handle fulfillment so you order from a single catalog. Warehousing, customs, and last-mile delivery are included. No volume minimums and no logistics team required.
              </p>
              <Button
                onClick={() => window.location.href = '/signup'}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 text-sm sm:text-base font-semibold w-full sm:max-w-[280px] lg:max-w-none lg:w-auto"
              >
                Book a demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Gifts Section */}
      <section id="gifts" className="py-12 sm:py-20 md:py-24 lg:py-28 bg-muted/30 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 w-full max-w-full box-border min-w-0">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-24 items-center min-w-0">
            <div className="lg:order-2 flex justify-center order-2 w-full">
              <div className="w-full max-w-xl relative mx-auto">
                <div className="absolute inset-0 bg-primary/5 rounded-xl -z-10" />
                <Image
                  src="/d4.png"
                  alt="Thoughtful gifts showcase"
                  width={1536}
                  height={1024}
                  className="w-full h-auto rounded-xl object-contain shadow-sm border border-border/40 transition-shadow duration-300"
                  priority
                />
              </div>
            </div>
            <div className="lg:order-1 order-1 space-y-6 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
              <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4 sm:mb-6">
                BETTER THAN GIFT CARDS
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6 sm:mb-8 leading-tight max-w-xl">
                Branded gifts that recipients actually use—and remember you for.
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Gift cards get forgotten. Curated, branded gifts land in the right hands and reinforce your brand. From welcome kits and anniversaries to client thank-yous and event swag, every send is trackable and on-brand.
              </p>
              <Button
                onClick={() => window.location.href = '/signup'}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 text-sm sm:text-base font-semibold w-full sm:max-w-[280px] lg:max-w-none lg:w-auto"
              >
                Book a demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Automate Gifts Section */}
      <section className="py-12 sm:py-20 md:py-24 lg:py-28 bg-white w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 w-full max-w-full box-border min-w-0">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-24 items-center min-w-0">
            <div className="flex justify-center order-2 lg:order-1 w-full">
              <div className="w-full max-w-xl relative mx-auto">
                <div className="absolute inset-0 bg-primary/5 rounded-xl -z-10" />
                <Image
                  src="/f2.png"
                  alt="Use cases visualization"
                  width={1536}
                  height={1024}
                  className="w-full h-auto rounded-xl object-contain shadow-sm border border-border/40 transition-shadow duration-300"
                  priority
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
              <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4 sm:mb-6">
                USE CASES
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6 sm:mb-8 leading-tight max-w-xl">
                Employee recognition, client appreciation, and campaigns—from one place.
              </h2>
              <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 w-full max-w-xl mx-auto lg:mx-0">
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-border/40 shadow-sm text-left">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Employee recognition:</strong> Welcome kits, anniversaries, performance rewards—all with one approval workflow.
                  </p>
                </div>
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-border/40 shadow-sm text-left">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Client appreciation:</strong> Thank-you gifts, deal closings, milestones—track who received what and when.
                  </p>
                </div>
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-border/40 shadow-sm text-left">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Events & campaigns:</strong> Conference swag, launches, offsites—run campaigns without spreadsheets or vendor chaos.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => window.location.href = '/signup'}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 text-sm sm:text-base font-semibold w-full sm:max-w-[280px] lg:max-w-none lg:w-auto"
              >
                Book a demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
