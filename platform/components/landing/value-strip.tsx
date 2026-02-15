'use client'

import { Globe, Users, CheckCircle } from 'lucide-react'

const items = [
  { icon: Globe, label: 'Ship to 100+ locations', desc: 'Deliver gifts across teams and borders' },
  { icon: Users, label: 'Designed for modern HR & Ops teams', desc: 'Built for scale and visibility' },
  { icon: CheckCircle, label: 'Reliable, trackable, and scalable', desc: 'No spreadsheets, no chaos' },
]

export function ValueStrip() {
  return (
    <section className="py-10 sm:py-12 md:py-14 bg-white border-y border-border/20 w-full max-w-full overflow-hidden">
      <div className="landing-container">
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
          Trusted by fast-growing companies to deliver gifts across teams and borders
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 max-w-3xl mx-auto">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm sm:text-base leading-tight">{item.label}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
