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
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 gradient-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 px-4 sm:px-0 leading-tight">
            Ready to build stronger relationships through gifting?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed">
            Let's talk about your gifting needs. We'll show you how premium, branded gifts can transform how you engage with employees, clients, and events worldwide.
          </p>
          <Button
            onClick={handleRequestDemo}
            size="lg"
            className="gradient-button text-white px-6 py-5 sm:px-8 sm:py-6 text-base sm:text-lg font-medium mb-8 sm:mb-12 shadow-primary-lg"
          >
            Talk to sales
          </Button>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {ctaItems.map((item, index) => (
              <div
                key={index}
                className="text-2xl sm:text-3xl md:text-4xl hover:scale-125 transition-transform cursor-default"
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
