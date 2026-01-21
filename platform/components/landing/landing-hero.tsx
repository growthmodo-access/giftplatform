'use client'

import { useRouter } from 'next/navigation'
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
    <section id="home" className="relative overflow-hidden gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full">
        {/* Centered Hero Content */}
        <div className="min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center py-12 sm:py-16 md:py-20">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto w-full">
            {/* Trust Badge */}
            <div className="mb-4 sm:mb-6">
              <span className="inline-block bg-[#F8F3EC] text-foreground px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide border border-[#F8F3EC]/50 shadow-sm">
                Built in India, shipping globally
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold mb-4 sm:mb-6 leading-[1.1] sm:leading-tight px-2">
              <span className="gradient-text">Corporate gifting that actually builds relationships</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl px-4 sm:px-0 leading-relaxed">
              Send premium, branded gifts to employees, clients, and events worldwide. We handle inventory, fulfillment, and logistics—you focus on relationships.
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
                <span className="text-xs sm:text-sm font-semibold">Premium inventory, human-managed</span>
              </div>
            </div>
          </div>
        </div>

        {/* World Map Visualization */}
        <div className="pb-12 sm:pb-16 md:pb-20 relative px-4 sm:px-0">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-muted/30 rounded-2xl sm:rounded-3xl overflow-hidden border border-border/50">
            {/* Map background */}
            <div className="absolute inset-0 bg-muted/20" />

            {/* Product Showcase 1 - Left */}
            <div className="absolute left-[5%] sm:left-[10%] md:left-[15%] top-[20%] sm:top-[25%] md:top-[30%] z-10">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-background backdrop-blur-xl rounded-full flex flex-col items-center justify-center gap-1 sm:gap-2 shadow-sm border border-border/50">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">👕</div>
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">☕</div>
                </div>
                <div className="hidden sm:block absolute top-1/2 left-16 sm:left-20 md:left-24 lg:left-32 w-12 sm:w-16 md:w-20 lg:w-24 border-t-2 border-dashed border-border/50 rotate-12" />
                <div className="hidden md:block absolute top-1/2 left-28 sm:left-36 md:left-44 lg:left-56 flex flex-col items-center gap-1">
                  <div className="text-lg sm:text-xl md:text-2xl">🇨🇦</div>
                  <div className="text-base sm:text-lg md:text-xl">🏠</div>
                </div>
              </div>
            </div>

            {/* Product Showcase 2 - Center */}
            <div className="absolute left-[35%] sm:left-[40%] md:left-[45%] top-[30%] sm:top-[35%] md:top-[40%] z-10">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-background backdrop-blur-xl rounded-full flex flex-col items-center justify-center gap-1 sm:gap-2 shadow-sm border border-border/50">
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">🧥</div>
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">💼</div>
                </div>
                <div className="hidden sm:block absolute top-1/2 left-16 sm:left-20 md:left-24 lg:left-32 w-12 sm:w-16 md:w-20 lg:w-28 border-t-2 border-dashed border-border/50 -rotate-12" />
                <div className="hidden md:block absolute top-1/2 left-28 sm:left-36 md:left-48 lg:left-60 flex flex-col items-center gap-1">
                  <div className="text-lg sm:text-xl md:text-2xl">🇫🇷</div>
                  <div className="text-base sm:text-lg md:text-xl">🏠</div>
                </div>
                <div className="hidden lg:block absolute top-1/2 left-60 translate-x-36 border-t-2 border-dashed border-border/50 rotate-12" />
                <div className="hidden lg:block absolute top-1/2 left-96 flex flex-col items-center gap-1">
                  <div className="text-2xl">🇩🇪</div>
                  <div className="text-xl">🏠</div>
                </div>
              </div>
            </div>

            {/* Product Showcase 3 - Right */}
            <div className="absolute right-[5%] sm:right-[8%] md:right-[10%] top-[40%] sm:top-[45%] md:top-[50%] z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-background backdrop-blur-xl rounded-full flex flex-col items-center justify-center gap-1 sm:gap-2 shadow-sm border border-border/50">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">💻</div>
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">🎧</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
