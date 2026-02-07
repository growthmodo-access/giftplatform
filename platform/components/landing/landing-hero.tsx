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
    <section id="home" className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full box-border">
        <div className="flex items-center justify-center py-10 sm:py-14 md:py-16 lg:py-20">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto w-full px-0 sm:px-2">
            {/* Trust Badge */}
            <div className="mb-6 sm:mb-8 md:mb-10 w-full">
              <span className="inline-flex items-center justify-center gap-2 bg-white text-foreground px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide border border-border/60 shadow-sm">
                <span className="text-base sm:text-lg">⭐</span>
                Trusted by 20,000+ companies
              </span>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-md mx-auto italic px-1 text-center">
                &ldquo;Finally, a gifting platform that understands both Indian preferences and global scale.&rdquo; — Vikram D., COO
              </p>
            </div>

            {/* Main Heading - dashboard-style typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight text-foreground w-full px-1 sm:px-4">
              Business gifting
              <br />
              <span className="text-primary">made easy</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 max-w-2xl w-full px-2 sm:px-4 leading-relaxed text-center">
              Send <strong className="text-foreground">flexible</strong>, <strong className="text-foreground">delightful</strong> corporate gifts and swag, all on one platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12 w-full max-w-sm sm:max-w-none mx-auto px-2 sm:px-0 justify-center items-stretch sm:items-center">
              <Button
                onClick={handleRequestDemo}
                size="lg"
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 sm:px-8 sm:py-6 text-sm sm:text-base font-semibold shadow-md w-full sm:w-auto"
                aria-label="Start gifting - sign up"
              >
                Start gifting
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToSolutions}
                className="rounded-xl border-2 border-primary text-primary bg-white hover:bg-primary/5 w-full sm:w-auto"
                aria-label="See how it works"
              >
                See how it works
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 px-2 text-center">
              Free to start — takes less than a minute.
            </p>

            {/* Trust Indicators - card style */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-6 text-muted-foreground w-full sm:w-auto max-w-md sm:max-w-none mx-auto px-2">
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-border/60 shadow-sm w-full sm:w-auto text-left sm:text-left">
                <span className="text-xl flex-shrink-0">🌍</span>
                <span className="text-xs sm:text-sm font-medium">80+ countries, zero logistics hassle</span>
              </div>
              <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-border/60 shadow-sm w-full sm:w-auto text-left sm:text-left">
                <span className="text-xl flex-shrink-0">🎁</span>
                <span className="text-xs sm:text-sm font-medium">Premium inventory, human managed</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-4 px-2 text-center w-full">
              Trusted by startups and enterprises across India and beyond
            </p>
          </div>
        </div>

        {/* Hero Image */}
        <div className="pb-12 sm:pb-16 md:pb-24 lg:pb-28 relative w-full">
          <div className="relative w-full max-w-7xl mx-auto rounded-2xl overflow-hidden border border-border/40 shadow-lg bg-white">
            <Image
              src="/hero1.png"
              alt="Global gifting visualization"
              width={1536}
              height={1024}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
