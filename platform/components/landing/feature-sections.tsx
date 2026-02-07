'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

const whatYouCanSend = [
  'Employee onboarding kits',
  'Company swag & merchandise',
  'Client and partner gifts',
  'Event & conference kits',
  'Rewards and milestone gifts',
]

const useCases = [
  { emoji: '🎉', title: 'Employee onboarding', copy: 'Deliver branded kits before day one—no coordination required.' },
  { emoji: '🏆', title: 'Rewards & milestones', copy: 'Automate birthdays, anniversaries, and achievements.' },
  { emoji: '🤝', title: 'Client & partner gifting', copy: 'Strengthen relationships with premium, timely gifts.' },
  { emoji: '🎪', title: 'Events & conferences', copy: 'Ship kits to attendees before or after events—globally.' },
]

export function FeatureSections() {
  return (
    <>
      {/* Core benefit 1: Send gifts anywhere + Eliminate address chaos */}
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
                CORE BENEFITS
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6 sm:mb-8 leading-tight max-w-xl">
                Send gifts anywhere in the world
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Global fulfillment without managing multiple vendors or couriers.
              </p>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground max-w-xl mx-auto lg:mx-0">
                Eliminate address chaos
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Recipients securely enter their own delivery details—no more wrong addresses or re-shipments.
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

      {/* Core benefit 2: Branded swag + Full visibility */}
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6 sm:mb-8 leading-tight max-w-xl">
                Branded swag people actually keep
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Premium, curated merchandise that reflects your brand—not cheap giveaways.
              </p>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground max-w-xl mx-auto lg:mx-0">
                Full visibility, end to end
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Track inventory, shipments, and deliveries in real time.
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

      {/* Core benefit 3: Finance-friendly + Scale + What you can send + Use cases */}
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6 sm:mb-8 leading-tight max-w-xl">
                Finance-friendly by design
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Clear approvals, predictable pricing, and clean reporting.
              </p>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground max-w-xl mx-auto lg:mx-0">
                Scale without changing your workflow
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Send 10 gifts or 10,000 using the same process.
              </p>

              <div className="w-full max-w-xl mx-auto lg:mx-0">
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-3">
                  WHAT YOU CAN SEND
                </p>
                <ul className="space-y-2 mb-6 list-disc list-inside text-sm text-muted-foreground">
                  {whatYouCanSend.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="text-sm font-medium text-foreground mb-6">
                  All customizable. All trackable. All handled for you.
                </p>

                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-4">
                  USE CASES
                </p>
                <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 w-full">
                  {useCases.map((uc) => (
                    <div
                      key={uc.title}
                      className="bg-muted/30 p-4 sm:p-5 rounded-xl border border-border/40 text-left"
                    >
                      <p className="text-sm sm:text-base text-foreground font-semibold mb-1">
                        {uc.emoji} {uc.title}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{uc.copy}</p>
                    </div>
                  ))}
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
