'use client'

import { Gift, Users, Truck } from 'lucide-react'

const steps = [
  { number: '1', icon: Gift, title: 'Choose your gifts', description: 'Select from curated products or create custom branded kits.' },
  { number: '2', icon: Users, title: 'Add recipients', description: 'Upload a list or let recipients enter their own addresses securely.' },
  { number: '3', icon: Truck, title: 'We fulfill & deliver', description: 'We handle storage, packing, shipping, and tracking—while you monitor everything in one place.' },
]

export function IntegrationsSection() {
  return (
    <section id="solutions" className="landing-section bg-white w-full max-w-full overflow-hidden border-t border-border/40">
      <div className="landing-container">
        <div className="text-center mb-14 sm:mb-16 md:mb-20 max-w-2xl mx-auto space-y-4">
          <p className="landing-label">How it works</p>
          <h2 className="landing-heading">Gifting, simplified into 3 steps</h2>
          <p className="landing-body">From selection to delivery—one platform, zero hassle.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto w-full relative min-w-0">
          <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2 w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="relative bg-white p-8 sm:p-10 rounded-2xl border border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:border-primary/20 transition-all duration-200 text-center flex flex-col items-center"
              >
                <div className="flex h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                  <Icon className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={1.75} />
                </div>
                <span className="text-3xl sm:text-4xl font-bold text-primary/25 mb-2">{step.number}</span>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 tracking-tight">{step.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-[1.6] flex-1">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
