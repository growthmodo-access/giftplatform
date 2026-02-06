'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function LandingHero() {
  const router = useRouter()

  const handleRequestDemo = () => {
    router.push('/signup')
  }

  const scrollToSolutions = () => {
    const el = document.querySelector('#solutions')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="home" className="relative overflow-hidden gradient-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full">
        {/* Centered Hero Content */}
        <div className="flex items-center justify-center py-10 sm:py-14 md:py-16 lg:py-18">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto w-full">
            {/* Trust Badge + Social Proof Quote */}
            <div className="mb-4 sm:mb-8 md:mb-10">
              <span className="inline-flex items-center gap-2 bg-white text-foreground px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide border border-black/[0.08] shadow-sm hover:shadow-md transition-shadow focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                <span className="text-base sm:text-lg">⭐</span>
                Trusted by 20,000+ companies
              </span>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-md mx-auto italic">
                &ldquo;Finally, a gifting platform that understands both Indian preferences and global scale.&rdquo; — Vikram D., COO
              </p>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-7xl font-extrabold mb-4 sm:mb-8 md:mb-10 leading-[1.05] sm:leading-tight px-2 sm:px-6">
              <span className="text-foreground">Business gifting</span>
              <br />
              <span className="text-foreground">made easy</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-10 md:mb-12 max-w-3xl px-2 sm:px-6 leading-relaxed">
              Send <strong className="text-foreground">flexible</strong>, <strong className="text-foreground">delightful</strong> corporate gifts and swag, all on one platform.
            </p>

            {/* CTA Buttons - centered on mobile */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-10 sm:mb-12 md:mb-16 w-full max-w-[min(100%,280px)] sm:max-w-none mx-auto px-4 sm:px-0 justify-center items-center">
              <Button
                onClick={handleRequestDemo}
                size="lg"
                className="gradient-button text-white px-8 py-6 sm:px-10 sm:py-7 text-base sm:text-lg font-semibold shadow-primary-lg hover:shadow-primary-xl hover:scale-105 transition-all duration-200 w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Start gifting - sign up"
              >
                Start gifting
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToSolutions}
                className="w-full sm:w-auto border-2 border-[#7B61FF] bg-white/90 text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="See how it works"
              >
                See how it works
              </Button>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10 px-4 sm:px-0">
              It's free and takes less than a minute.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 md:gap-12 text-muted-foreground px-2 sm:px-4">
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-full border border-black/[0.06] shadow-sm">
                <span className="text-xl sm:text-2xl">🌍</span>
                <span className="text-sm sm:text-base font-semibold">80+ countries, zero logistics hassle</span>
              </div>
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-full border border-black/[0.06] shadow-sm">
                <span className="text-foreground text-xl sm:text-2xl">🎁</span>
                <span className="text-sm sm:text-base font-semibold">Premium inventory, human managed</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mt-6 px-4 text-center">
              Trusted by startups and enterprises across India and beyond
            </p>
          </div>
        </div>

        {/* Hero Image Visualization */}
        <div className="pb-12 sm:pb-20 md:pb-24 lg:pb-28 relative px-4 sm:px-6 md:px-8">
          <div className="relative w-full max-w-7xl mx-auto">
            <Image
              src="/hero1.png"
              alt="Global gifting visualization"
              width={1536}
              height={1024}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
              className="w-full h-auto rounded-3xl sm:rounded-[2rem] object-contain shadow-2xl hover:shadow-3xl transition-shadow duration-300"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
