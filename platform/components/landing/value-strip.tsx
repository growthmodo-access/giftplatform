'use client'

import { Globe, Users, CheckCircle } from 'lucide-react'

const items = [
  { icon: Globe, label: 'Ship to 100+ locations', desc: 'Deliver gifts across teams and borders' },
  { icon: Users, label: 'Designed for modern HR & Ops teams', desc: 'Built for scale and visibility' },
  { icon: CheckCircle, label: 'Reliable, trackable, and scalable', desc: 'No spreadsheets, no chaos' },
]

export function ValueStrip() {
  return (
    <section className="py-12 sm:py-14 bg-muted/30 border-y border-border/40 w-full max-w-full overflow-hidden">
      <div className="landing-container">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Trusted by fast-growing companies to deliver gifts across teams and borders
        </p>
        <div className="flex flex-wrap items-stretch justify-center gap-5 sm:gap-6 md:gap-8">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-2xl bg-white border border-border/40 px-6 py-5 sm:px-7 sm:py-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 min-w-0 flex-1 sm:flex-initial sm:min-w-[220px] max-w-[300px]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground leading-tight">{item.label}</p>
                  <p className="text-xs text-muted-foreground leading-snug mt-1">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
