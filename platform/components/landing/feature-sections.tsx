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

const ctaOutline = "rounded-xl border-2 border-primary text-primary bg-white hover:bg-primary/5 hover:border-primary/80 px-5 py-4 text-base font-semibold w-full sm:w-auto inline-flex items-center gap-2"

export function FeatureSections() {
  return (
    <>
      {/* Core benefit 1: image left, text right */}
      <section id="benefits" className="landing-section bg-white w-full max-w-full overflow-hidden border-t border-border/40">
        <div className="landing-container">
          <div className="landing-grid">
            <div className="order-2 lg:order-1 w-full min-w-0 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-xl mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-border/50 shadow-xl shadow-black/5 bg-muted/20 ring-1 ring-black/5">
                <Image src="/IMG1.png" alt="Premium swag and gifts showcase" width={600} height={400} className="w-full h-auto object-contain" priority />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start w-full max-w-xl lg:max-w-none mx-auto lg:mx-0">
              <p className="landing-label">Core benefits</p>
              <h2 className="landing-heading">Send gifts anywhere in the world</h2>
              <p className="landing-body">Global fulfillment without managing multiple vendors or couriers.</p>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/30 border border-border/40 w-full">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="font-semibold text-foreground">Eliminate address chaos</p>
                  <p className="landing-body text-sm mt-1">Recipients securely enter their own delivery details—no more wrong addresses or re-shipments.</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => window.location.href = '/signup'} className={ctaOutline}>
                Learn more <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core benefit 2: image left, text right */}
      <section className="landing-section bg-white w-full max-w-full overflow-hidden border-t border-border/40">
        <div className="landing-container">
          <div className="landing-grid">
            <div className="order-2 lg:order-1 w-full min-w-0 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-xl mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-border/50 shadow-xl shadow-black/5 bg-white ring-1 ring-black/5">
                <Image src="/d4.png" alt="Thoughtful branded gifts showcase" width={1536} height={1024} className="w-full h-auto object-contain" priority />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start w-full max-w-xl lg:max-w-none mx-auto lg:mx-0">
              <p className="landing-label">Branded & visible</p>
              <h2 className="landing-heading">Branded swag people actually keep</h2>
              <p className="landing-body">Premium, curated merchandise that reflects your brand—not cheap giveaways.</p>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-white border border-border/40 shadow-sm w-full">
                <BarChart3 className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="font-semibold text-foreground">Full visibility, end to end</p>
                  <p className="landing-body text-sm mt-1">Track inventory, shipments, and deliveries in real time.</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => window.location.href = '/signup'} className={ctaOutline}>
                Learn more <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core benefit 3: image left, text right */}
      <section className="landing-section bg-white w-full max-w-full overflow-hidden border-t border-border/40">
        <div className="landing-container">
          <div className="landing-grid">
            <div className="order-2 lg:order-1 w-full min-w-0 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-xl mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-border/50 shadow-xl shadow-black/5 bg-muted/20 ring-1 ring-black/5">
                <Image src="/f2.png" alt="Use cases - onboarding, rewards, events" width={1536} height={1024} className="w-full h-auto object-contain" priority />
              </div>
            </div>
            <div className="order-1 lg:order-2 space-y-6 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start w-full max-w-xl lg:max-w-none mx-auto lg:mx-0">
              <p className="landing-label">Scale & control</p>
              <div className="flex items-start gap-4">
                <Scale className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <h2 className="landing-heading">Finance-friendly by design</h2>
                  <p className="landing-body mt-2">Clear approvals, predictable pricing, and clean reporting.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="font-semibold text-foreground">Scale without changing your workflow</p>
                  <p className="landing-body text-sm mt-1">Send 10 gifts or 10,000 using the same process.</p>
                </div>
              </div>

              <div className="w-full space-y-4">
                <p className="landing-label text-muted-foreground">What you can send</p>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {whatYouCanSend.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Gift className="h-4 w-4 text-primary shrink-0" strokeWidth={1.75} />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-medium text-foreground">All customizable. All trackable. All handled for you.</p>

                <p className="landing-label text-muted-foreground pt-2">Use cases</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {useCases.map((uc) => (
                    <div key={uc.title} className="rounded-xl border border-border/40 bg-muted/20 p-4 text-left hover:border-primary/20 hover:bg-muted/30 transition-colors">
                      <p className="text-sm font-semibold text-foreground mb-1">{uc.emoji} {uc.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{uc.copy}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" onClick={() => window.location.href = '/signup'} className={ctaOutline}>
                Learn more <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
