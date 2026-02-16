'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const ctaLight =
  'rounded-xl border border-primary/40 text-primary bg-transparent hover:bg-primary/5 hover:border-primary/60 hover:text-primary px-6 py-3.5 text-base font-medium w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none'

export function ServicesSection() {
  return (
    <section id="services" className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-white">
      <div className="landing-container">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center min-w-0">
          <div className="order-1 w-full min-w-0 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl xl:max-w-2xl mx-auto lg:mx-0 rounded-2xl overflow-hidden">
              <Image
                src="/IMG2.png"
                alt="Corporate gifting services - Employees, Clients, Swag, Global Gifting"
                width={1536}
                height={1024}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
          <div className="order-2 flex flex-col items-start w-full max-w-xl lg:max-w-2xl mx-auto lg:mx-0 text-left">
            <p className="landing-label mb-2">Solution</p>
            <h2 className="landing-heading text-balance mb-4">
              One platform that handles everything for you
            </h2>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-lg mb-4">
              We built a system specifically for teams that need to send gifts at scale—without adding operational burden.
            </p>
            <p className="text-base sm:text-lg font-medium text-foreground leading-snug mb-4">
              You decide what to send. We handle everything else.
            </p>
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-lg mb-6">
              From storage and customization to shipping and tracking—globally.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/contact'} className={ctaLight}>
              Talk to sales
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Button>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
