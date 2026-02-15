'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function PricingSection() {
  const router = useRouter()

  return (
    <section id="pricing" className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-white">
      <div className="landing-container">
        <div className="text-center max-w-2xl mx-auto space-y-5">
          <p className="landing-label">Pricing</p>
          <h2 className="landing-heading text-balance">Flexible plans that grow with your team</h2>
          <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
            No vendor lock-ins. No operational overhead. Pay only for what you use. We adapt to your volume—occasional sends or year-round gifting.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/contact')}
            className="rounded-xl border border-primary/40 text-primary bg-transparent hover:bg-primary/5 hover:border-primary/60 hover:text-primary px-6 py-3.5 text-base font-medium inline-flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none"
          >
            Talk to sales
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </section>
  )
}
