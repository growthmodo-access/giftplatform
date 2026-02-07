'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function IndustryLeaders() {
  return (
    <section className="py-12 sm:py-24 md:py-28 lg:py-32 xl:py-36 bg-white w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-24 items-center min-w-0">
          <div className="order-2 lg:order-1 space-y-6 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6 sm:mb-8 leading-tight max-w-xl">
              From India to the world
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Built in India, shipping worldwide. We understand local preferences and global scale. Whether you're a startup expanding internationally or an enterprise managing distributed teams, we have you covered.
            </p>
            <Button
              onClick={() => window.location.href = '/signup'}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 text-sm sm:text-base font-semibold w-full sm:max-w-[280px] lg:max-w-none lg:w-auto"
            >
              Talk to sales
            </Button>
          </div>
          <div className="order-1 lg:order-2 w-full">
            <div className="w-full max-w-xl relative mx-auto">
              <div className="absolute inset-0 bg-primary/5 rounded-xl -z-10" />
              <Image
                src="/g4.png"
                alt="From India to the world visualization"
                width={1536}
                height={1024}
                className="w-full h-auto rounded-xl object-contain shadow-sm border border-border/40 transition-shadow duration-300"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
