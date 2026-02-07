'use client'

import { Globe, Users, CheckCircle } from 'lucide-react'

const items = [
  { icon: Globe, label: 'Ship to 100+ locations', desc: 'Deliver gifts across teams and borders' },
  { icon: Users, label: 'Designed for modern HR & Ops teams', desc: 'Built for scale and visibility' },
  { icon: CheckCircle, label: 'Reliable, trackable, and scalable', desc: 'No spreadsheets, no chaos' },
]

export function ValueStrip() {
  return (
    <section className="py-6 sm:py-8 bg-muted/20 border-y border-border/40 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 w-full max-w-full box-border">
        <p className="text-center text-sm font-medium text-muted-foreground mb-4">
          Trusted by fast-growing companies to deliver gifts across teams and borders
        </p>
        <div className="rounded-xl border border-border/40 bg-white shadow-sm p-3 sm:p-4 min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 border border-border/40 bg-muted/20 min-w-0 w-full sm:w-auto sm:min-w-[160px]"
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
