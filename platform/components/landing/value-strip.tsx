'use client'

import { Globe, Gift, Zap, Headphones } from 'lucide-react'

const items = [
  { icon: Globe, label: '80+ countries', desc: 'Ship anywhere' },
  { icon: Gift, label: 'Premium catalog', desc: 'Curated gifts' },
  { icon: Zap, label: 'No minimums', desc: 'Start small' },
  { icon: Headphones, label: 'Human support', desc: 'We’re here to help' },
]

export function ValueStrip() {
  return (
    <section className="py-6 sm:py-8 bg-muted/30 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full">
        <div className="rounded-xl border border-border/60 bg-white shadow-sm p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-10">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg px-4 py-2.5 sm:px-5 sm:py-3 border border-border/50 bg-background/60 min-w-0 flex-1 sm:flex-initial sm:min-w-[160px]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground leading-tight">{item.label}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
