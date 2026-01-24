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
        <div className="min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center py-12 sm:py-16 md:py-20">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto w-full">
            {/* Trust Badge */}
            <div className="mb-4 sm:mb-6">
              <span className="inline-block bg-[#F8F3EC] text-foreground px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide border border-[#F8F3EC]/50 shadow-sm">
                Made in India, delivered globally
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-[1.1] sm:leading-tight px-2">
              <span className="gradient-text">Corporate gifting that actually builds relationships</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl px-4 sm:px-0 leading-relaxed">
              Send premium, branded gifts to employees, clients, and events worldwide. We handle inventory, fulfillment, and logistics so you can focus on building relationships.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 w-full sm:w-auto px-4 sm:px-0">
              <Button
                onClick={handleRequestDemo}
                size="lg"
                className="gradient-button text-white px-6 py-5 sm:px-8 sm:py-6 text-base sm:text-lg font-medium shadow-primary-lg w-full sm:w-auto"
              >
                Talk to sales
              </Button>
              <Button
                onClick={handleExploreCountries}
                variant="outline"
                size="lg"
                className="border-[#7B61FF]/30 bg-white/90 backdrop-blur-sm hover:bg-[#F8F3EC]/80 px-6 py-5 sm:px-8 sm:py-6 text-base sm:text-lg font-medium text-[#7B61FF] w-full sm:w-auto"
              >
                See how it works
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-muted-foreground px-4">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl">🌍</span>
                <span className="text-xs sm:text-sm font-medium">80+ countries, zero logistics hassle</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-foreground text-base sm:text-lg">🎁</span>
                <span className="text-xs sm:text-sm font-semibold">Premium inventory, human managed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image Visualization */}
        <div className="pb-12 sm:pb-16 md:pb-20 relative px-4 sm:px-0">
          <div className="relative w-full max-w-6xl mx-auto">
            <Image
              src="/hero1.png"
              alt="Global gifting visualization"
              width={1536}
              height={1024}
              className="w-full h-auto rounded-2xl sm:rounded-3xl object-contain shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
