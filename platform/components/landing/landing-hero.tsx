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
    console.log('Explore countries clicked')
  }

  return (
    <section id="home" className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-20 -z-10" />

      <div className="max-w-7xl mx-auto px-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Trust Badge */}
          <div className="mb-6">
            <span className="inline-block bg-green-600 text-white px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wide shadow-md">
              Your trusted partner for global gifting.
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Boost engagement globally, send premium swag and gifts
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Improve your culture and increase sales, all in one global gifting platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button
              onClick={handleRequestDemo}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Request a demo
            </Button>
            <Button
              onClick={handleExploreCountries}
              variant="outline"
              size="lg"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg font-semibold"
            >
              Explore countries
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌍</span>
              <span className="text-sm font-medium">Trusted by 50,000+ users globally</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">★★★★★</span>
              <span className="text-sm font-semibold">4.5 / 5 on G2</span>
            </div>
          </div>
        </div>

        {/* World Map Visualization */}
        <div className="mt-20 relative">
          <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-2xl">
            {/* Map background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 opacity-60" />

            {/* Product Showcase 1 - Left */}
            <div className="absolute left-[15%] top-[30%] z-10">
              <div className="relative">
                <div className="w-32 h-32 bg-white/80 backdrop-blur-xl rounded-full flex flex-col items-center justify-center gap-2 shadow-xl border-2 border-white/40">
                  <div className="text-4xl">👕</div>
                  <div className="text-4xl">☕</div>
                </div>
                <div className="absolute top-1/2 left-32 w-24 border-t-2 border-dashed border-purple-400 rotate-12" />
                <div className="absolute top-1/2 left-56 flex flex-col items-center gap-1">
                  <div className="text-2xl">🇨🇦</div>
                  <div className="text-xl">🏠</div>
                </div>
              </div>
            </div>

            {/* Product Showcase 2 - Center */}
            <div className="absolute left-[45%] top-[40%] z-10">
              <div className="relative">
                <div className="w-32 h-32 bg-white/80 backdrop-blur-xl rounded-full flex flex-col items-center justify-center gap-2 shadow-xl border-2 border-white/40">
                  <div className="text-4xl">🧥</div>
                  <div className="text-4xl">💼</div>
                </div>
                <div className="absolute top-1/2 left-32 w-28 border-t-2 border-dashed border-purple-400 -rotate-12" />
                <div className="absolute top-1/2 left-60 flex flex-col items-center gap-1">
                  <div className="text-2xl">🇫🇷</div>
                  <div className="text-xl">🏠</div>
                </div>
                <div className="absolute top-1/2 left-60 translate-x-36 border-t-2 border-dashed border-purple-400 rotate-12" />
                <div className="absolute top-1/2 left-96 flex flex-col items-center gap-1">
                  <div className="text-2xl">🇩🇪</div>
                  <div className="text-xl">🏠</div>
                </div>
              </div>
            </div>

            {/* Product Showcase 3 - Right */}
            <div className="absolute right-[10%] top-[50%] z-10">
              <div className="w-32 h-32 bg-white/80 backdrop-blur-xl rounded-full flex flex-col items-center justify-center gap-2 shadow-xl border-2 border-white/40">
                <div className="text-4xl">💻</div>
                <div className="text-4xl">🎧</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
