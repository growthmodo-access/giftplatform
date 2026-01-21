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
    <section className="py-24 lg:py-32 bg-transparent">
      <div className="max-w-7xl mx-auto px-10">
        <div className="text-center">
          <h2 className="text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Elevate your swag game worldwide.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Deliver every swag, matter, and gift with easy inventory, event management, and team accountability.
          </p>
          <Button
            onClick={handleRequestDemo}
            size="lg"
            className="px-8 py-6 text-lg font-medium mb-12"
          >
            Request a demo
          </Button>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {ctaItems.map((item, index) => (
              <div
                key={index}
                className="text-4xl hover:scale-125 transition-transform cursor-default"
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
