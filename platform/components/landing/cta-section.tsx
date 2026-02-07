'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTASection() {
  const router = useRouter()

  const handleRequestDemo = () => {
    router.push('/signup')
  }

  return (
    <section className="relative py-20 sm:py-24 lg:py-28 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-t border-border/40 w-full max-w-full overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,hsl(var(--primary)/0.08),transparent)] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0 overflow-x-hidden">
        <div className="text-center flex flex-col items-center w-full">
          <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="h-4 w-4" strokeWidth={2} />
            Get started
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-foreground tracking-tight mb-4 sm:mb-5 leading-tight max-w-3xl">
            Stop managing gifting. Start automating it.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-2xl leading-relaxed">
            Send gifts people actually love—without the operational headache.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 sm:mb-10 w-full justify-center items-center">
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
              onClick={() => router.push('/signup')}
              size="lg"
              variant="outline"
              className="rounded-xl border-2 border-border/60 bg-white hover:bg-muted/40 px-8 py-6 text-base font-semibold w-full sm:w-auto"
              aria-label="Get started in minutes"
            >
              Get started in minutes
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required · Custom quote in 24 hours
          </p>
        </div>
      </div>
    </section>
  )
}
