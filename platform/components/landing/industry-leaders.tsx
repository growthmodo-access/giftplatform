'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function IndustryLeaders() {
  return (
    <section className="py-12 sm:py-24 md:py-28 lg:py-32 xl:py-36 gradient-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 space-y-6 sm:space-y-8 text-center sm:text-left flex flex-col items-center sm:items-start">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
              From India to the world
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed max-w-lg">
              Built in India, shipping worldwide. We understand local preferences and global scale. Whether you're a startup expanding internationally or an enterprise managing distributed teams, we have you covered.
            </p>
            <Button
              onClick={() => window.location.href = '/signup'}
              className="gradient-button text-white px-8 py-6 text-base sm:text-lg font-semibold shadow-primary-lg hover:shadow-primary-xl hover:scale-105 transition-all duration-200 w-full max-w-[280px] sm:max-w-none sm:w-auto"
            >
              Talk to sales
            </Button>
          </div>
          <div className="order-1 lg:order-2">
            <div className="w-full max-w-xl relative mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7B61FF]/10 to-[#2883EB]/10 rounded-3xl blur-2xl -z-10"></div>
              <Image
                src="/g4.png"
                alt="From India to the world visualization"
                width={1536}
                height={1024}
                className="w-full h-auto rounded-3xl sm:rounded-[2rem] object-contain shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
