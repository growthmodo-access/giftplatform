'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Gift, MapPin, BarChart3, Scale, Zap, ArrowRight } from 'lucide-react'

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

const ctaLight =
  'rounded-lg border border-primary/40 text-primary bg-transparent hover:bg-primary/5 hover:border-primary/60 px-5 py-2.5 text-sm font-medium w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none'

export function FeatureSections() {
  return (
    <>
      <section id="benefits" className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-white">
        <div className="landing-container">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-14 items-center min-w-0">
            <div className="order-2 lg:order-1 w-full min-w-0 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xl xl:max-w-2xl mx-auto lg:mx-0 rounded-2xl overflow-hidden">
                <Image src="/IMG3.png" alt="Premium swag and gifts showcase" width={600} height={400} className="w-full h-auto object-contain" priority />
              </div>
            </div>
            <div className="order-1 lg:order-2 flex flex-col items-center lg:items-start w-full max-w-xl lg:max-w-none mx-auto lg:mx-0 text-center lg:text-left">
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
              <Button variant="outline" onClick={() => window.location.href = '/signup'} className={ctaLight}>
                Learn more <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-white">
        <div className="landing-container">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-14 items-center min-w-0">
            <div className="order-2 lg:order-1 w-full min-w-0 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xl xl:max-w-2xl mx-auto lg:mx-0 rounded-2xl overflow-hidden">
                <Image src="/IMG4.png" alt="Thoughtful branded gifts showcase" width={1536} height={1024} className="w-full h-auto object-contain" priority />
              </div>
            </div>
            <div className="order-1 lg:order-2 flex flex-col items-center lg:items-start w-full max-w-xl lg:max-w-none mx-auto lg:mx-0 text-center lg:text-left">
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
              <Button variant="outline" onClick={() => window.location.href = '/signup'} className={ctaLight}>
                Learn more <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-white">
        <div className="landing-container">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-14 items-center min-w-0">
            <div className="order-2 lg:order-1 w-full min-w-0 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xl xl:max-w-2xl mx-auto lg:mx-0 rounded-2xl overflow-hidden">
                <Image src="/IMG6.png" alt="Use cases - onboarding, rewards, events" width={1536} height={1024} className="w-full h-auto object-contain" priority />
              </div>
            </div>
            <div className="order-1 lg:order-2 flex flex-col items-center lg:items-start w-full max-w-xl lg:max-w-none mx-auto lg:mx-0 text-center lg:text-left">
              <p className="landing-label mb-2">Scale & control</p>
              <div className="flex items-start gap-4 mb-4">
                <Scale className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <h2 className="landing-heading text-balance">Finance-friendly by design</h2>
                  <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed mt-2">
                    Clear approvals, predictable pricing, and clean reporting.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 mb-6">
                <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="font-medium text-foreground text-sm sm:text-base">Scale without changing your workflow</p>
                  <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed mt-1">
                    Send 10 gifts or 10,000 using the same process.
                  </p>
                </div>
              </div>

              <div className="w-full max-w-lg space-y-4 mb-6">
                <p className="landing-label text-muted-foreground text-xs">What you can send</p>
                <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  {whatYouCanSend.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Gift className="h-4 w-4 text-primary/80 shrink-0" strokeWidth={1.75} />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-foreground/90">All customizable. All trackable. All handled for you.</p>

                <p className="landing-label text-muted-foreground text-xs pt-4">Use cases</p>
                <ul className="space-y-3">
                  {useCases.map((uc) => (
                    <li key={uc.title} className="text-left">
                      <p className="text-sm font-medium text-foreground">{uc.emoji} {uc.title}</p>
                      <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed mt-0.5">{uc.copy}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <Button variant="outline" onClick={() => window.location.href = '/signup'} className={ctaLight}>
                Learn more <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
