'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  const router = useRouter()
  const handleRequestDemo = () => router.push('/signup')

  return (
    <section className="relative landing-section bg-white border-t border-border/20 w-full max-w-full overflow-hidden">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0 overflow-x-hidden">
        <div className="text-center flex flex-col items-center w-full space-y-5 sm:space-y-6">
          <p className="landing-label">Get started</p>
          <h2 className="landing-heading text-balance max-w-3xl">
            Stop managing gifting. Start automating it.
          </h2>
          <p className="text-[15px] sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Send gifts people actually love—without the operational headache.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center items-center pt-2">
            <Button
              onClick={handleRequestDemo}
              className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-sm font-medium w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none"
              aria-label="Book a demo"
            >
              Book a demo
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/signup')}
              className="rounded-lg border border-primary/40 text-primary bg-transparent hover:bg-primary/5 hover:border-primary/60 px-6 py-3 text-sm font-medium w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none"
              aria-label="Get started in minutes"
            >
              Get started in minutes
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
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
