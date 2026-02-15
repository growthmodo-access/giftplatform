'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const ctaLight =
  'rounded-lg border border-primary/40 text-primary bg-transparent hover:bg-primary/5 hover:border-primary/60 px-5 py-2.5 text-sm font-medium w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none'

export function ServicesSection() {
  return (
    <section id="services" className="landing-section w-full max-w-full overflow-hidden border-t border-border/20 bg-white">
      <div className="landing-container">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-14 items-center min-w-0">
          <div className="order-2 lg:order-1 w-full min-w-0 flex justify-center lg:justify-end">
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
          <div className="order-1 lg:order-2 flex flex-col items-center lg:items-start w-full max-w-xl lg:max-w-none mx-auto lg:mx-0 text-center lg:text-left">
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
            <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-lg mb-8">
              From storage and customization to shipping and tracking—globally.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/contact'} className={ctaLight}>
              Talk to sales
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
