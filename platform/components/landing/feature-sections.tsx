'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Gift, MapPin, BarChart3, Scale, Zap } from 'lucide-react'

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
      {/* Core benefit 1 */}
      <section id="benefits" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center min-w-0">
            <div className="flex justify-center order-2 lg:order-1 w-full">
              <div className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden border border-border/50 shadow-xl shadow-black/5 bg-muted/20 ring-1 ring-black/5">
                <Image
                  src="/IMG1.png"
                  alt="Premium swag and gifts showcase"
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
              <p className="text-primary text-xs font-semibold uppercase tracking-widest">Core benefits</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight max-w-xl mx-auto lg:mx-0">
                Send gifts anywhere in the world
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Global fulfillment without managing multiple vendors or couriers.
              </p>
              <div className="flex items-start gap-3 max-w-xl mx-auto lg:mx-0 p-4 rounded-xl bg-muted/30 border border-border/40 w-full">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="font-semibold text-foreground">Eliminate address chaos</p>
                  <p className="text-sm text-muted-foreground mt-1">Recipients securely enter their own delivery details—no more wrong addresses or re-shipments.</p>
                </div>
              </div>
              <Button
                onClick={() => window.location.href = '/signup'}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 text-base font-semibold shadow-lg shadow-primary/20 w-full sm:max-w-[280px] lg:max-w-none lg:w-auto"
              >
                Book a demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core benefit 2 */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-muted/30 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center min-w-0">
            <div className="lg:order-2 flex justify-center w-full">
              <div className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden border border-border/50 shadow-xl shadow-black/5 bg-white ring-1 ring-black/5">
                <Image
                  src="/d4.png"
                  alt="Thoughtful branded gifts showcase"
                  width={1536}
                  height={1024}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>
            <div className="lg:order-1 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight max-w-xl mx-auto lg:mx-0">
                Branded swag people actually keep
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Premium, curated merchandise that reflects your brand—not cheap giveaways.
              </p>
              <div className="flex items-start gap-3 max-w-xl mx-auto lg:mx-0 p-4 rounded-xl bg-white border border-border/40 shadow-sm w-full">
                <BarChart3 className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="font-semibold text-foreground">Full visibility, end to end</p>
                  <p className="text-sm text-muted-foreground mt-1">Track inventory, shipments, and deliveries in real time.</p>
                </div>
              </div>
              <Button
                onClick={() => window.location.href = '/signup'}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 text-base font-semibold shadow-lg shadow-primary/20 w-full sm:max-w-[280px] lg:max-w-none lg:w-auto"
              >
                Book a demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core benefit 3 + What you can send + Use cases */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center min-w-0">
            <div className="flex justify-center order-2 lg:order-1 w-full">
              <div className="relative w-full max-w-xl mx-auto rounded-2xl overflow-hidden border border-border/50 shadow-xl shadow-black/5 bg-muted/20 ring-1 ring-black/5">
                <Image
                  src="/f2.png"
                  alt="Use cases - onboarding, rewards, events"
                  width={1536}
                  height={1024}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
              <div className="flex items-start gap-3 max-w-xl mx-auto lg:mx-0">
                <Scale className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
                    Finance-friendly by design
                  </h2>
                  <p className="text-base text-muted-foreground mt-2">Clear approvals, predictable pricing, and clean reporting.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 max-w-xl mx-auto lg:mx-0">
                <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="font-semibold text-foreground">Scale without changing your workflow</p>
                  <p className="text-sm text-muted-foreground mt-1">Send 10 gifts or 10,000 using the same process.</p>
                </div>
              </div>

              <div className="w-full max-w-xl mx-auto lg:mx-0 space-y-4">
                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">What you can send</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {whatYouCanSend.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-primary shrink-0" strokeWidth={1.75} />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-medium text-foreground">All customizable. All trackable. All handled for you.</p>

                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest pt-2">Use cases</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {useCases.map((uc) => (
                    <div
                      key={uc.title}
                      className="rounded-xl border border-border/40 bg-muted/20 p-4 text-left hover:border-primary/20 hover:bg-muted/30 transition-colors"
                    >
                      <p className="text-sm font-semibold text-foreground mb-1">
                        {uc.emoji} {uc.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{uc.copy}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => window.location.href = '/signup'}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 text-base font-semibold shadow-lg shadow-primary/20 w-full sm:max-w-[280px] lg:max-w-none lg:w-auto"
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
