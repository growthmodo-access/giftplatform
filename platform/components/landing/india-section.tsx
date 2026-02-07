'use client'

import { Globe } from 'lucide-react'

export function IndiaSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-muted/30 w-full max-w-full overflow-hidden border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
            <Globe className="h-4 w-4" strokeWidth={2} />
            From India to the world
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6 leading-tight">
            Built for global teams. Powered from India.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            We help Indian and international companies send gifts worldwide with consistent quality, reliable delivery, and complete visibility—no matter where recipients are located.
          </p>
        </div>
      </div>
    </section>
  )
}
