'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function FeatureSections() {
  return (
    <>
      {/* Order Premium Swag Section */}
      <section id="swag" className="py-12 sm:py-24 md:py-28 lg:py-32 xl:py-36 gradient-landing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-24 items-center">
            <div className="flex justify-center order-2 lg:order-1">
              <div className="w-full max-w-xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/10 to-[#2883EB]/10 rounded-3xl blur-2xl -z-10"></div>
                <Image
                  src="/IMG1.png"
                  alt="Premium swag and gifts showcase"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-3xl sm:rounded-[2rem] object-contain shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                  priority
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6 sm:space-y-8 text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="text-muted-foreground text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 sm:mb-6">
                GLOBAL FULFILLMENT
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
                Premium swag and gifts, shipped worldwide
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed">
                We own inventory across 80+ countries. Order branded swag, premium gifts, or curated selections. We handle warehousing, customs, and delivery. No volume minimums, no logistics headaches.
              </p>
              <Button
                onClick={() => window.location.href = '/signup'}
                className="gradient-button text-white px-8 py-6 text-base sm:text-lg font-semibold shadow-primary-lg hover:shadow-primary-xl hover:scale-105 transition-all duration-200 w-full max-w-[280px] sm:max-w-none sm:w-auto"
              >
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Gifts Section */}
      <section id="gifts" className="py-12 sm:py-24 md:py-28 lg:py-32 xl:py-36 gradient-landing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-24 items-center">
            <div className="lg:order-2 flex justify-center order-2 lg:order-2">
              <div className="w-full max-w-xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/10 to-[#2883EB]/10 rounded-3xl blur-2xl -z-10"></div>
                <Image
                  src="/d4.png"
                  alt="Thoughtful gifts showcase"
                  width={1536}
                  height={1024}
                  className="w-full h-auto rounded-3xl sm:rounded-[2rem] object-contain shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                  priority
                />
              </div>
            </div>
            <div className="lg:order-1 order-1 lg:order-1 space-y-6 sm:space-y-8 text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="text-muted-foreground text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 sm:mb-6">
                WHY GIFTS BEAT GIFT CARDS
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
                Thoughtful gifts build stronger relationships
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed">
                Gift cards feel transactional. Branded, curated gifts show you care. We curate premium selections that recipients actually want, from tech accessories to wellness products. Every gift reinforces your brand and strengthens relationships.
              </p>
              <Button
                onClick={() => window.location.href = '/signup'}
                className="gradient-button text-white px-8 py-6 text-base sm:text-lg font-semibold shadow-primary-lg hover:shadow-primary-xl hover:scale-105 transition-all duration-200 w-full max-w-[280px] sm:max-w-none sm:w-auto"
              >
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Automate Gifts Section */}
      <section className="py-12 sm:py-24 md:py-28 lg:py-32 xl:py-36 gradient-landing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-24 items-center">
            <div className="flex justify-center order-2 lg:order-1">
              <div className="w-full max-w-xl relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/10 to-[#2883EB]/10 rounded-3xl blur-2xl -z-10"></div>
                <Image
                  src="/f2.png"
                  alt="Use cases visualization"
                  width={1536}
                  height={1024}
                  className="w-full h-auto rounded-3xl sm:rounded-[2rem] object-contain shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                  priority
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6 sm:space-y-8 text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="text-muted-foreground text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 sm:mb-6">
                USE CASES
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
                Gifts for employees, clients, and events
              </h2>
              <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10 w-full">
                <div className="bg-white/60 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-black/[0.06] shadow-sm text-left">
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Employee recognition:</strong> Welcome kits, work anniversaries, performance rewards
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-black/[0.06] shadow-sm text-left">
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Client appreciation:</strong> Thank you gifts, deal closings, partnership milestones
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-black/[0.06] shadow-sm text-left">
                  <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Events & campaigns:</strong> Conference swag, product launches, team offsites
                  </p>
                </div>
              </div>
              <Button
                onClick={() => window.location.href = '/signup'}
                className="gradient-button text-white px-8 py-6 text-base sm:text-lg font-semibold shadow-primary-lg hover:shadow-primary-xl hover:scale-105 transition-all duration-200 w-full max-w-[280px] sm:max-w-none sm:w-auto"
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
