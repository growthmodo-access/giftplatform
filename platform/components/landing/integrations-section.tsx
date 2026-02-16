'use client'

import { Gift, Users, Truck } from 'lucide-react'

const steps = [
  { number: '1', icon: Gift, title: 'Choose your gifts', description: 'Select from curated products or create custom branded kits.' },
  { number: '2', icon: Users, title: 'Add recipients', description: 'Upload a list or let recipients enter their own addresses securely.' },
  { number: '3', icon: Truck, title: 'We fulfill & deliver', description: 'We handle storage, packing, shipping, and tracking—while you monitor everything in one place.' },
]

export function IntegrationsSection() {
  return (
    <section id="solutions" className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-transparent">
      <div className="landing-container">
        <div className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto space-y-4">
          <p className="landing-label">How it works</p>
          <h2 className="landing-heading text-balance">Gifting, simplified into 3 steps</h2>
          <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
            From selection to delivery—one platform, zero hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-4xl mx-auto w-full min-w-0">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.75} />
                </div>
                <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider mb-2">Step {step.number}</span>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 tracking-tight">{step.title}</h3>
                <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-xs mx-auto">
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
