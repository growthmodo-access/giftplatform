'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function ServicesSection() {
  return (
    <section id="services" className="landing-section bg-white w-full max-w-full overflow-hidden border-t border-border/40">
      <div className="landing-container">
        <div className="landing-grid">
          {/* Visual left */}
          <div className="order-2 lg:order-1 w-full min-w-0 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-xl mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-border/50 shadow-xl shadow-black/5 bg-white ring-1 ring-black/5">
              <Image
                src="/services-grid.png"
                alt="Corporate gifting services - Employees, Clients, Swag, Global Gifting"
                width={1536}
                height={1024}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
          {/* Text right */}
          <div className="order-1 lg:order-2 space-y-6 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start w-full max-w-xl lg:max-w-none mx-auto lg:mx-0">
            <p className="landing-label">Solution</p>
            <h2 className="landing-heading">
              One platform that handles everything for you
            </h2>
            <p className="landing-body">
              We built a system specifically for teams that need to send gifts at scale—without adding operational burden.
            </p>
            <p className="text-lg font-semibold text-foreground leading-snug">
              You decide what to send. We handle everything else.
            </p>
            <p className="landing-body">
              From storage and customization to shipping and tracking—globally.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/signup'}
              className="rounded-xl border-2 border-primary text-primary bg-white hover:bg-primary/5 hover:border-primary/80 px-5 py-4 text-base font-semibold w-full sm:w-auto inline-flex items-center gap-2"
            >
              Learn more
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
