'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const ctaItems = ['👜', '📓', '💧', '🔊', '🧥', '☕']

export function CTASection() {
  const router = useRouter()

  const handleRequestDemo = () => {
    router.push('/signup')
  }

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-white border-t border-border/40 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="text-center flex flex-col items-center w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4 sm:mb-6 px-2 sm:px-0 leading-tight max-w-3xl">
            Stop managing gifting. Start automating it.
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0 leading-relaxed">
            Send gifts people actually love—without the operational headache.
          </p>
          <div className="w-full flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-2">
            <Button
              onClick={handleRequestDemo}
              size="lg"
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold shadow-sm w-full max-w-[280px] sm:max-w-none sm:w-auto focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Book a demo"
            >
              Book a demo
            </Button>
            <Button
              onClick={() => router.push('/signup')}
              size="lg"
              variant="outline"
              className="rounded-xl border-border/40 hover:bg-muted/30 px-8 py-6 text-base font-semibold w-full max-w-[280px] sm:max-w-none sm:w-auto"
              aria-label="Get started in minutes"
            >
              Get started in minutes
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-8 sm:mb-12 px-2 text-center">
            No credit card required · Custom quote in 24 hours
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-10">
            {ctaItems.map((item, index) => (
              <div
                key={index}
                className="text-3xl sm:text-4xl md:text-5xl hover:scale-125 transition-transform duration-300 cursor-default"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
