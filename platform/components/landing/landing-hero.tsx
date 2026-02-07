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
    <section id="home" className="relative overflow-hidden bg-white w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="flex items-center justify-center py-10 sm:py-14 md:py-16 lg:py-20">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto w-full px-0 sm:px-2">
            {/* Trust Badge */}
            <div className="mb-6 sm:mb-8 md:mb-10 w-full">
              <span className="inline-flex items-center justify-center gap-2 bg-primary/5 text-foreground px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-border/40">
                <span className="text-base sm:text-lg">🇮🇳</span>
                Built for India · Ships to 100+ locations
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-[1.1] tracking-tight text-foreground w-full px-1 sm:px-4">
              Corporate gifting, without the chaos
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6 max-w-2xl w-full px-2 sm:px-4 leading-relaxed text-center">
              Send gifts to employees, clients, and partners—globally, in minutes.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl w-full px-2 sm:px-4 leading-relaxed text-center">
              Manage gifting, swag, addresses, approvals, branding, and worldwide delivery from one dashboard. No spreadsheets. No vendors to chase. No last-minute panic.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 w-full max-w-sm sm:max-w-none mx-auto px-2 sm:px-0 justify-center items-stretch sm:items-center">
              <Button
                onClick={handleRequestDemo}
                size="lg"
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 sm:px-8 sm:py-6 text-sm sm:text-base font-semibold shadow-sm w-full sm:w-auto"
                aria-label="Book a demo"
              >
                Book a demo
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/signup')}
                className="rounded-xl border border-border/40 bg-white hover:bg-muted/30 w-full sm:w-auto"
                aria-label="Get started"
              >
                Get started
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 px-2 text-center">
              No credit card required · Live in under 2 minutes
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-6 text-muted-foreground w-full sm:w-auto max-w-md sm:max-w-none mx-auto px-2">
              <div className="flex items-center gap-3 bg-muted/20 border border-border/40 px-4 py-3 rounded-xl w-full sm:w-auto text-left shadow-sm">
                <span className="text-xl flex-shrink-0">🌍</span>
                <span className="text-xs sm:text-sm font-medium">Ship to 100+ locations</span>
              </div>
              <div className="flex items-center gap-3 bg-muted/20 border border-border/40 px-4 py-3 rounded-xl w-full sm:w-auto text-left shadow-sm">
                <span className="text-xl flex-shrink-0">✔</span>
                <span className="text-xs sm:text-sm font-medium">Designed for modern HR & Ops teams</span>
              </div>
              <div className="flex items-center gap-3 bg-muted/20 border border-border/40 px-4 py-3 rounded-xl w-full sm:w-auto text-left shadow-sm">
                <span className="text-xl flex-shrink-0">✔</span>
                <span className="text-xs sm:text-sm font-medium">Reliable, trackable, and scalable</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-4 px-2 text-center w-full">
              Trusted by fast-growing companies to deliver gifts across teams and borders
            </p>
          </div>
        </div>

        {/* Hero Image */}
        <div className="pb-12 sm:pb-16 md:pb-24 lg:pb-28 relative w-full">
          <div className="relative w-full max-w-7xl mx-auto rounded-xl overflow-hidden border border-border/40 shadow-sm bg-white">
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
