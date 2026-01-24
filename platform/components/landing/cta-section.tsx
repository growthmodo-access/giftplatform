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
    <section className="py-24 sm:py-28 md:py-32 lg:py-40 xl:py-48 gradient-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 sm:mb-8 md:mb-10 px-4 sm:px-0 leading-tight">
            Ready to build stronger relationships through gifting?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed">
            Let's talk about your gifting needs. We'll show you how premium, branded gifts can transform how you engage with employees, clients, and events worldwide.
          </p>
          <Button
            onClick={handleRequestDemo}
            size="lg"
            className="gradient-button text-white px-10 py-7 sm:px-12 sm:py-8 text-lg sm:text-xl font-semibold mb-10 sm:mb-14 md:mb-16 shadow-primary-lg hover:shadow-primary-xl hover:scale-110 transition-all duration-200"
          >
            Talk to sales
          </Button>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10">
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
