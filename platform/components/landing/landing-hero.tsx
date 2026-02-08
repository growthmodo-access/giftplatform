'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Globe, Users, CheckCircle, ArrowRight } from 'lucide-react'

export function LandingHero() {
  const router = useRouter()

  const handleRequestDemo = () => {
    router.push('/signup')
  }

  return (
    <section id="home" className="relative overflow-hidden w-full max-w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-muted/30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="landing-container relative">
        <div className="flex items-center justify-center pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-12 sm:pb-16">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto w-full px-0 sm:px-2">
            <div className="mb-8 sm:mb-10 w-full">
              <span className="inline-flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm text-foreground px-5 py-3 sm:px-6 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium border border-border/50 shadow-sm">
                <span className="text-lg">🇮🇳</span>
                Built for India · Ships to 100+ locations
              </span>
            </div>

            <h1 className="landing-heading-hero mb-5 sm:mb-6 w-full px-1">
              Corporate gifting, without the chaos
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl w-full px-2 leading-[1.4] font-medium">
              Send gifts to employees, clients, and partners—globally, in minutes.
            </p>
            <p className="landing-body mb-10 sm:mb-12 max-w-2xl w-full px-2">
              Manage gifting, swag, addresses, approvals, branding, and worldwide delivery from one dashboard. No spreadsheets. No vendors to chase. No last-minute panic.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12 sm:mb-14 w-full max-w-sm sm:max-w-none mx-auto px-2 sm:px-0 justify-center items-stretch sm:items-center">
              <Button
                onClick={handleRequestDemo}
                size="lg"
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl transition-all w-full sm:w-auto"
                aria-label="Book a demo"
              >
                Book a demo
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/signup')}
                className="rounded-xl border-2 border-primary text-primary bg-white hover:bg-primary/5 hover:border-primary/80 px-8 py-6 text-base font-semibold w-full sm:w-auto inline-flex items-center justify-center gap-2"
                aria-label="Get started"
              >
                Get started
                <ArrowRight className="h-5 w-5" strokeWidth={2} />
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-12 px-2 text-center">
              No credit card required · Live in under 2 minutes
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-2xl mx-auto">
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-border/40 px-5 py-3.5 rounded-xl shadow-sm hover:shadow transition-shadow">
                <Globe className="h-5 w-5 text-primary shrink-0" strokeWidth={1.75} />
                <span className="text-sm font-medium text-foreground">Ship to 100+ locations</span>
              </div>
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-border/40 px-5 py-3.5 rounded-xl shadow-sm hover:shadow transition-shadow">
                <Users className="h-5 w-5 text-primary shrink-0" strokeWidth={1.75} />
                <span className="text-sm font-medium text-foreground">HR & Ops teams</span>
              </div>
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-border/40 px-5 py-3.5 rounded-xl shadow-sm hover:shadow transition-shadow">
                <CheckCircle className="h-5 w-5 text-primary shrink-0" strokeWidth={1.75} />
                <span className="text-sm font-medium text-foreground">Reliable & scalable</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-6 px-2 text-center">
              Trusted by fast-growing companies to deliver gifts across teams and borders
            </p>
          </div>
        </div>

        <div className="pb-20 sm:pb-24 md:pb-28 lg:pb-32 relative w-full">
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
