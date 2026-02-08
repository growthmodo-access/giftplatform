'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  const router = useRouter()
  const handleRequestDemo = () => router.push('/signup')

  return (
    <section className="relative landing-section bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-t border-border/40 w-full max-w-full overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,hsl(var(--primary)/0.08),transparent)] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0 overflow-x-hidden">
        <div className="text-center flex flex-col items-center w-full space-y-6 sm:space-y-8">
          <p className="landing-label">Get started</p>
          <h2 className="landing-heading max-w-3xl">
            Stop managing gifting. Start automating it.
          </h2>
          <p className="landing-body-lg max-w-2xl leading-[1.7]">
            Send gifts people actually love—without the operational headache.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center pt-2">
            <Button
              onClick={handleRequestDemo}
              size="lg"
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl w-full sm:w-auto inline-flex items-center gap-2"
              aria-label="Book a demo"
            >
              Book a demo
              <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/signup')}
              className="rounded-xl border-2 border-primary text-primary bg-white hover:bg-primary/5 hover:border-primary/80 px-8 py-6 text-base font-semibold w-full sm:w-auto inline-flex items-center gap-2"
              aria-label="Get started in minutes"
            >
              Get started in minutes
              <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-2">
            No credit card required · Custom quote in 24 hours
          </p>
        </div>
      </div>
    </section>
  )
}
