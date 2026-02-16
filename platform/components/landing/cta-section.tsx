'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  const router = useRouter()
  const handleTalkToSales = () => router.push('/contact')

  return (
    <section className="relative landing-section bg-transparent border-t border-border/20 w-full max-w-full overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0 overflow-x-hidden">
        <div className="text-center flex flex-col items-center w-full space-y-4 sm:space-y-5">
          <p className="landing-label">Get started</p>
          <h2 className="landing-heading text-balance max-w-3xl">
            Stop managing gifting. Start automating it.
          </h2>
          <p className="text-[15px] sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Send gifts people actually love—without the operational headache.
          </p>
          <div className="w-full flex justify-center pt-2">
            <Button
              onClick={handleTalkToSales}
              className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-semibold w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none shadow-lg hover:shadow-xl"
              aria-label="Talk to sales"
            >
              Talk to sales
              <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground pt-1">
            No credit card required · Custom quote in 24 hours
          </p>
        </div>
      </div>
    </section>
  )
}
