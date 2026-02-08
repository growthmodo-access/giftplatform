'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function PricingSection() {
  const router = useRouter()

  return (
    <section id="pricing" className="landing-section bg-white w-full max-w-full overflow-hidden border-t border-border/40">
      <div className="landing-container">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <p className="landing-label">Pricing</p>
          <h2 className="landing-heading">Flexible plans that grow with your team</h2>
          <p className="landing-body">
            No vendor lock-ins. No operational overhead. Pay only for what you use. We adapt to your volume—occasional sends or year-round gifting.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/contact')}
            className="rounded-xl border-2 border-primary text-primary bg-white hover:bg-primary/5 hover:border-primary/80 px-6 py-4 text-base font-semibold inline-flex items-center gap-2"
          >
            Talk to sales
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </section>
  )
}
