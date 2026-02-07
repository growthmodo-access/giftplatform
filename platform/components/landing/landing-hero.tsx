'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Globe, Users, CheckCircle } from 'lucide-react'

export function LandingHero() {
  const router = useRouter()

  const handleRequestDemo = () => {
    router.push('/signup')
  }

  return (
    <section id="home" className="relative overflow-hidden w-full max-w-full">
      {/* Subtle gradient background for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-muted/30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full box-border min-w-0">
        <div className="flex items-center justify-center pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-10 sm:pb-14">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto w-full px-0 sm:px-2">
            {/* Trust Badge */}
            <div className="mb-6 sm:mb-8 w-full">
              <span className="inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm text-foreground px-4 py-2.5 sm:px-5 sm:py-3 rounded-full text-xs sm:text-sm font-medium border border-border/50 shadow-sm">
                <span className="text-lg">🇮🇳</span>
                Built for India · Ships to 100+ locations
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5 leading-[1.12] tracking-tight text-foreground w-full px-1">
              Corporate gifting, without the chaos
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-3 max-w-2xl w-full px-2 leading-snug font-medium">
              Send gifts to employees, clients, and partners—globally, in minutes.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10 max-w-2xl w-full px-2 leading-relaxed">
              Manage gifting, swag, addresses, approvals, branding, and worldwide delivery from one dashboard. No spreadsheets. No vendors to chase. No last-minute panic.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12 w-full max-w-sm sm:max-w-none mx-auto px-2 sm:px-0 justify-center items-stretch sm:items-center">
              <Button
                onClick={handleRequestDemo}
                size="lg"
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-7 py-6 sm:px-8 sm:py-6 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all w-full sm:w-auto"
                aria-label="Book a demo"
              >
                Book a demo
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/signup')}
                className="rounded-xl border-2 border-border/60 bg-white hover:bg-muted/40 px-7 py-6 text-base font-semibold w-full sm:w-auto"
                aria-label="Get started"
              >
                Get started
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-10 px-2 text-center">
              No credit card required · Live in under 2 minutes
            </p>

            {/* Trust row - clean pill style */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-2xl mx-auto">
              <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-sm border border-border/40 px-4 py-3 rounded-xl shadow-sm hover:shadow transition-shadow">
                <Globe className="h-5 w-5 text-primary shrink-0" strokeWidth={1.75} />
                <span className="text-sm font-medium text-foreground">Ship to 100+ locations</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-sm border border-border/40 px-4 py-3 rounded-xl shadow-sm hover:shadow transition-shadow">
                <Users className="h-5 w-5 text-primary shrink-0" strokeWidth={1.75} />
                <span className="text-sm font-medium text-foreground">HR & Ops teams</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-sm border border-border/40 px-4 py-3 rounded-xl shadow-sm hover:shadow transition-shadow">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" strokeWidth={1.75} />
                <span className="text-sm font-medium text-foreground">Reliable & scalable</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-5 px-2 text-center">
              Trusted by fast-growing companies to deliver gifts across teams and borders
            </p>
          </div>
        </div>

        {/* Hero Image - premium container */}
        <div className="pb-16 sm:pb-20 md:pb-24 lg:pb-28 relative w-full">
          <div className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden border border-border/50 shadow-xl shadow-black/5 bg-white ring-1 ring-black/5">
            <Image
              src="/hero1.png"
              alt="Global gifting dashboard and delivery"
              width={1536}
              height={1024}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
