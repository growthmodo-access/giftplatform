'use client'

import { Gift, Users, Truck } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: Gift,
    title: 'Choose your gifts',
    description: 'Select from curated products or create custom branded kits.',
  },
  {
    number: '2',
    icon: Users,
    title: 'Add recipients',
    description: 'Upload a list or let recipients enter their own addresses securely.',
  },
  {
    number: '3',
    icon: Truck,
    title: 'We fulfill & deliver',
    description: 'We handle storage, packing, shipping, and tracking—while you monitor everything in one place.',
  },
]

export function IntegrationsSection() {
  return (
    <section id="solutions" className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 max-w-2xl mx-auto">
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            How it works
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-foreground mb-4 leading-tight tracking-tight">
            Gifting, simplified into 3 steps
          </h2>
          <p className="text-base text-muted-foreground">
            From selection to delivery—one platform, zero hassle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto w-full relative">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-20 left-1/2 -translate-x-1/2 w-[calc(100%-8rem)] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="relative bg-white p-6 sm:p-8 rounded-2xl border border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:border-primary/20 transition-all duration-200 text-center flex flex-col items-center"
              >
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={1.75} />
                </div>
                <span className="text-3xl sm:text-4xl font-bold text-primary/30 mb-2">{step.number}</span>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
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
