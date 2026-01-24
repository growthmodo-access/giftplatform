'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function LandingHero() {
  const router = useRouter()

  const handleRequestDemo = () => {
    router.push('/signup')
  }

  const handleExploreCountries = () => {
    // Scroll to countries section or show modal
    // Navigate to signup or dashboard
  }

  return (
    <section id="home" className="relative overflow-hidden gradient-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full">
        {/* Centered Hero Content */}
        <div className="min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center py-16 sm:py-20 md:py-24 lg:py-28">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto w-full">
            {/* Trust Badge */}
            <div className="mb-6 sm:mb-8 md:mb-10">
              <span className="inline-block bg-[#F8F3EC] text-foreground px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide border border-[#F8F3EC]/50 shadow-md hover:shadow-lg transition-shadow">
                Made in India, delivered globally
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 md:mb-10 leading-[1.1] sm:leading-tight px-4 sm:px-6">
              <span className="gradient-text">Corporate gifting that actually builds relationships</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-10 md:mb-12 max-w-3xl px-4 sm:px-6 leading-relaxed">
              Send premium, branded gifts to employees, clients, and events worldwide. We handle inventory, fulfillment, and logistics so you can focus on building relationships.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-10 sm:mb-12 md:mb-16 w-full sm:w-auto px-4 sm:px-0">
              <Button
                onClick={handleRequestDemo}
                size="lg"
                className="gradient-button text-white px-8 py-6 sm:px-10 sm:py-7 text-base sm:text-lg font-semibold shadow-primary-lg hover:shadow-primary-xl hover:scale-105 transition-all duration-200 w-full sm:w-auto"
              >
                Talk to sales
              </Button>
              <Button
                onClick={handleExploreCountries}
                variant="outline"
                size="lg"
                className="border-2 border-[#7B61FF]/40 bg-white/95 backdrop-blur-sm hover:bg-[#F8F3EC]/90 hover:border-[#7B61FF]/60 px-8 py-6 sm:px-10 sm:py-7 text-base sm:text-lg font-semibold text-[#7B61FF] hover:scale-105 transition-all duration-200 w-full sm:w-auto"
              >
                See how it works
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 md:gap-12 text-muted-foreground px-4">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-full border border-[#F8F3EC]/50 shadow-sm">
                <span className="text-xl sm:text-2xl">🌍</span>
                <span className="text-sm sm:text-base font-semibold">80+ countries, zero logistics hassle</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-full border border-[#F8F3EC]/50 shadow-sm">
                <span className="text-foreground text-xl sm:text-2xl">🎁</span>
                <span className="text-sm sm:text-base font-semibold">Premium inventory, human managed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image Visualization */}
        <div className="pb-16 sm:pb-20 md:pb-24 lg:pb-28 relative px-4 sm:px-6 md:px-8">
          <div className="relative w-full max-w-7xl mx-auto">
            <Image
              src="/hero1.png"
              alt="Global gifting visualization"
              width={1536}
              height={1024}
              className="w-full h-auto rounded-3xl sm:rounded-[2rem] object-contain shadow-2xl hover:shadow-3xl transition-shadow duration-300"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
