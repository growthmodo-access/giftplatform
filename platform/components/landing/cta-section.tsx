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
    <section className="py-14 sm:py-20 md:py-28 lg:py-32 bg-white border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full">
        <div className="text-center flex flex-col items-center w-full">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0 leading-tight max-w-3xl">
            Ready to build stronger relationships through gifting?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2 sm:px-0 leading-relaxed">
            We'll show you how premium, branded gifts can transform how you engage with employees, clients, and events worldwide.
          </p>
          <div className="w-full flex justify-center mb-8 sm:mb-12 px-2">
            <Button
              onClick={handleRequestDemo}
              size="lg"
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base sm:text-lg font-semibold w-full max-w-[280px] sm:max-w-none sm:w-auto focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Talk to sales"
            >
              Talk to sales
            </Button>
          </div>
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
