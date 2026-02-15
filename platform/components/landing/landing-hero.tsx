'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Globe, Users, CheckCircle, ArrowRight } from 'lucide-react'

export function LandingHero() {
  const router = useRouter()

  const handleTalkToSales = () => router.push('/contact')

  return (
    <section id="home" className="relative overflow-hidden w-full max-w-full bg-white">
      <div className="landing-container relative">
        <div className="flex items-center justify-center pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-10 sm:pb-12">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto w-full px-0 sm:px-2">
            <div className="mb-8 sm:mb-10 w-full">
              <span className="inline-flex items-center justify-center gap-2 text-foreground/90 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium">
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

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-14 w-full max-w-sm sm:max-w-none mx-auto px-2 sm:px-0 justify-center items-stretch sm:items-center">
              <Button
                onClick={handleTalkToSales}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3.5 text-base font-medium w-full sm:w-auto transition-colors focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none"
                aria-label="Talk to sales"
              >
                Talk to sales
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/contact')}
                className="rounded-xl border border-primary/40 text-primary bg-transparent hover:bg-primary/5 hover:border-primary/60 hover:text-primary px-6 py-3.5 text-base font-medium w-full sm:w-auto inline-flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none"
                aria-label="Talk to sales"
              >
                Talk to sales
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-12 px-2 text-center">
              No credit card required · Live in under 2 minutes
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 w-full max-w-2xl mx-auto">
              <div className="flex items-center gap-2.5 text-foreground/90">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" strokeWidth={1.75} />
                <span className="text-xs sm:text-sm font-medium">Ship to 100+ locations</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/90">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" strokeWidth={1.75} />
                <span className="text-xs sm:text-sm font-medium">HR & Ops teams</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/90">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" strokeWidth={1.75} />
                <span className="text-xs sm:text-sm font-medium">Reliable & scalable</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-6 px-2 text-center">
              Trusted by fast-growing companies to deliver gifts across teams and borders
            </p>
          </div>
        </div>

        <div className="pb-14 sm:pb-16 md:pb-20 lg:pb-24 relative w-full">
          <div className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden">
            <Image
              src="https://github.com/growthmodo-access/giftplatform/blob/main/platform/public/MAINIMAGE.png?raw=true"
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
